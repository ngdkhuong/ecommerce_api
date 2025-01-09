const supertest = require("supertest");
const app = require("../app");
const Product = require("../src/models/Product");
const User = require("../src/models/User");
const jwt = require("jsonwebtoken");

const request = supertest(app);

let adminToken;

beforeAll(async () => {
    const admin = await User.create({
        name: "Admin",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
    });
    adminToken = jwt.sign(
        { _id: admin._id, role: admin.role },
        process.env.JWT_SECRET
    );
});

// Cleanup database after tests
afterAll(async () => {
    await Product.deleteMany({});
});

describe("Product Management", () => {
    let adminToken;

    // beforeAll(async () => {
    //     // Create an admin user and log in to get a token
    //     const admin = await request.post("/api/auth/signup").send({
    //         name: "Admin User",
    //         email: "admin@example.com",
    //         password: "admin123",
    //     });
    //     adminToken = admin.body.token; // Assuming the response includes a token
    // });

    it("should create a product", async () => {
        const productData = {
            name: "Test Product",
            description: "A sample product",
            price: 29.99,
            stock: 50,
            category: "Test Category",
            imageURL: "http://example.com/product.jpg",
        };

        const res = await request
            .post("/api/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(productData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toMatchObject({
            name: "Test Product",
            description: "A sample product",
            price: 29.99,
            stock: 50,
            category: "Test Category",
            imageURL: "http://example.com/product.jpg",
        });
        expect(res.body).toHaveProperty("_id");
    });
});
