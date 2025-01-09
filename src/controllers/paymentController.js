const https = require("https");
const Cart = require("../models/Cart");

exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate(
            "products.productId"
        );
        if (!cart) return res.status(404).send("Cart not found");

        const totalAmount = cart.products.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        );

        // MoMo API credentials (should be stored in environment variables)
        const momoPartnerCode = process.env.MOMO_PARTNER_CODE;
        const momoAccessKey = process.env.MOMO_ACCESS_KEY;
        const momoSecretKey = process.env.MOMO_SECRET_KEY;
        const momoNotifyUrl = process.env.MOMO_NOTIFY_URL;
        const momoReturnUrl = process.env.MOMO_RETURN_URL;
        const orderId = `ORDER_${Date.now()}`;
        const requestId = `REQ_${Date.now()}`;

        const requestData = {
            partnerCode: momoPartnerCode,
            accessKey: momoAccessKey,
            requestId: requestId,
            amount: totalAmount.toString(),
            orderId: orderId,
            orderInfo: `Payment for Order ${orderId}`,
            returnUrl: momoReturnUrl,
            notifyUrl: momoNotifyUrl,
            extraData: "", // Optional field for additional information
            requestType: "captureWallet",
        };

        // Generate MoMo signature
        const crypto = require("crypto");
        const rawSignature = `accessKey=${momoAccessKey}&amount=${totalAmount}&extraData=&notifyUrl=${momoNotifyUrl}&orderId=${orderId}&orderInfo=Payment for Order ${orderId}&partnerCode=${momoPartnerCode}&requestId=${requestId}&returnUrl=${momoReturnUrl}&requestType=captureWallet`;
        requestData.signature = crypto
            .createHmac("sha256", momoSecretKey)
            .update(rawSignature)
            .digest("hex");

        //Create the HTTPS objects
        const options = {
            hostname: "test-payment.momo.vn",
            port: 443,
            path: "/v2/gateway/api/create",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestData),
            },
        };
        //Send the request and get the response
        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding("utf8");
            res.on("data", (body) => {
                console.log("Body: ");
                console.log(body);
                console.log("payUrl: ");
                console.log(JSON.parse(body).payUrl);
            });
            res.on("end", () => {
                console.log("No more data in response.");
            });
        });

        req.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        // write data to request body
        console.log("Sending....");
        req.write(requestData);
        req.end();
    } catch (err) {
        res.status(500).send(err.message);
    }
};
