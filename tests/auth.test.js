import {
    describe,
    test,
    expect,
} from "vitest";
import request from "supertest";
import app from "../src/app.js";
//  AUTH API TESTS 
describe("Auth API", () => {
    // 1. REGISTER VALIDATION
    test("register validation should reject invalid email", async () => {
        const response = await request(app).post("/api/auth/register").send({
            full_name: "Test User",
            email: "wrong-email",
            password: "123456",
        });
        expect(response.statusCode,).toBe(400);
        expect(response.body.success,).toBe(false);
        expect(response.body.errors,).toBeDefined();
    },);
    // 2. LOGIN VALIDATION
    test("login validation should reject short password", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "admin@gmail.com",
            password: "123",
        });
        expect(response.statusCode,).toBe(400);
        expect(response.body.success,).toBe(false);
        expect(response.body.errors,).toBeDefined();
    },);
    // 3. REGISTER SUCCESS
    test("register should create a new user", async () => {
        const uniqueEmail = `test_${Date.now()}@gmail.com`;
        const response = await request(app).post("/api/auth/register").send({
            full_name: "Test User",
            email: uniqueEmail,
            password: "Test@123456",
        });
        expect(response.statusCode,).toBe(201);
        expect(response.body.success,).toBe(true);
        expect(response.body.message,).toBe("User Registered");
    },);
    // 4. DUPLICATE EMAIL
    test("register should reject duplicate email", async () => {
        const response = await request(app).post("/api/auth/register").send({
            full_name: "Another Sadik",
            email: "sadik@gmail.com",
            password: "Test@123456",
        });
        expect(response.statusCode,).toBe(409);
        expect(response.body.success,).toBe(false);
        expect(response.body.message,).toBe("Email already exists",);
    },);
    // 5. LOGIN SUCCESS
    test("login should return access token", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "sadik@gmail.com",
            password: "admin$123",
        });
        expect(response.statusCode,).toBe(200);
        expect(response.body.success,).toBe(true);
        expect(response.body.token,).toBeDefined();
        expect(response.body.user,).toBeDefined();
        expect(response.body.user.email,).toBe("sadik@gmail.com");
    },);
    // 6. WRONG PASSWORD
    test("login should reject wrong password", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "sadik@gmail.com",
            password: "WrongPassword@123",
        });
        expect(response.statusCode,).toBe(401);
        expect(response.body.success,).toBe(false);
        expect(response.body.message,).toBe("Invalid email or password",);
    },);
    // 7. UNKNOWN EMAIL
    test("login should reject unknown email", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "does-not-exist@gmail.com",
            password: "Test@123456",
        });
        expect(response.statusCode,).toBe(401);
        expect(response.body.success,).toBe(false);
        expect(response.body.message,).toBe("Invalid email or password",);
    },);
    // 8. REFRESH TOKEN SUCCESS
    test("refresh should return a new access token", async () => {
        const agent = request.agent(app);
        const loginResponse = await agent.post("/api/auth/login").send({
            email: "sadik@gmail.com",
            password: "admin$123",
        });
        expect(loginResponse.statusCode,).toBe(200);
        expect(loginResponse.body.success,).toBe(true);
        const refreshResponse = await agent.post("/api/auth/refresh");
        expect(refreshResponse.statusCode,).toBe(200);
        expect(refreshResponse.body.success,).toBe(true);
        expect(refreshResponse.body.token,).toBeDefined();
        expect(refreshResponse.body.user,).toBeDefined();
    },);
    // 9. REFRESH WITHOUT COOKIE
    test("refresh should reject missing refresh token", async () => {
        const response = await request(app).post("/api/auth/refresh",);
        expect(response.statusCode,).toBe(401);
        expect(response.body.success,).toBe(false);
    },);
    // 10. LOGOUT
    test("logout should revoke refresh token", async () => {
        const agent = request.agent(app);
        const loginResponse = await agent.post("/api/auth/login").send({
            email: "sadik@gmail.com",
            password: "admin$123",
        });
        expect(loginResponse.statusCode,).toBe(200);
        const logoutResponse = await agent.post("/api/auth/logout",);
        expect(logoutResponse.statusCode,).toBe(200);
        expect(logoutResponse.body.success,).toBe(true);
        expect(logoutResponse.body.message,).toBe("Logged out successfully",);
    },);
    // 11. PROFILE WITHOUT TOKEN
    test("profile should reject missing access token", async () => {
        const response = await request(app).get("/api/auth/profile",);
        expect(response.statusCode,).toBe(401);
        expect(response.body.success,).toBe(false);
        expect(response.body.message,).toBe("Authorization header is required",);
    },);
    // 12. PROFILE WITH INVALID TOKEN
    test("profile should reject invalid access token", async () => {
        const response = await request(app).get("/api/auth/profile").set("Authorization", "Bearer invalid-token",);
        expect(response.statusCode,).toBe(401);
        expect(response.body.success,).toBe(false);
        expect(response.body.message,).toBe("Invalid or expired token",);
    },);
});