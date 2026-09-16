import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
    test("register validation should reject invalid email", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                full_name: "Test User",
                email: "wrong-email",
                password: "123456",
            });

        expect(response.statusCode).toBe(400);
    });

    test("login validation should reject short password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin@gmail.com",
                password: "123",
            });

        expect(response.statusCode).toBe(400);
    });
});