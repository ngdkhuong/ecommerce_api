const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.createProduct = async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).send("Access Denied");

    const product = new Product(req.body);
    try {
        const savedProduct = await product.save();
        res.status(201).send(savedProduct);
    } catch (err) {
        res.status(400).send(err);
    }
};
