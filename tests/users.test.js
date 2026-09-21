import {
    beforeAll,
    describe,
    test,
    expect,
} from "vitest";

import request from "supertest";

import app from "../src/app.js";


// ======================================================
// USERS API TESTS
// ======================================================

describe("Users API", () => {

    // ----------------------------------------------------
    // TEST DATA
    // ----------------------------------------------------

    const adminEmail = "sadik@gmail.com";

    // IMPORTANT:
    // Replace with your actual password.
    const adminPassword = "admin$123";

    let adminToken;
    // ====================================================
    // HELPER: GET ADMIN TOKEN
    // ====================================================

    beforeAll(async () => {

        const response =
            await request(app)
                .post("/api/auth/login")
                .send({
                    email: adminEmail,
                    password: adminPassword,
                });

        expect(
            response.statusCode,
        ).toBe(200);

        expect(
            response.body.token,
        ).toBeDefined();

        adminToken =
            response.body.token;
    });


    // ====================================================
    // 1. GET USERS WITHOUT TOKEN
    // ====================================================

    test(
        "get users should reject missing token",
        async () => {

            const response =
                await request(app)
                    .get("/api/users");

            expect(
                response.statusCode,
            ).toBe(401);

            expect(
                response.body.success,
            ).toBe(false);
        },
    );


    // ====================================================
    // 2. GET USERS
    // ====================================================

    test(
        "get users should return users",
        async () => {


            const response =
                await request(app)
                    .get("/api/users")
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(200);

            expect(
                response.body,
            ).toBeDefined();
        },
    );


    // ====================================================
    // 3. GET USER BY ID
    // ====================================================

    test(
        "get user by id should return user",
        async () => {



            const response =
                await request(app)
                    .get("/api/users/1")
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(200);

            expect(
                response.body,
            ).toBeDefined();
        },
    );


    // ====================================================
    // 4. GET USER BY INVALID ID
    // ====================================================

    test(
        "get user by invalid id should reject request",
        async () => {



            const response =
                await request(app)
                    .get(
                        "/api/users/invalid-id",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(400);
        },
    );


    // ====================================================
    // 5. GET NON-EXISTING USER
    // ====================================================

    test(
        "get non-existing user should return 404",
        async () => {



            const response =
                await request(app)
                    .get(
                        "/api/users/999999",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(404);

            expect(
                response.body.success,
            ).toBe(false);
        },
    );


    // ====================================================
    // 6. CREATE USER VALIDATION
    // ====================================================

    test(
        "create user should reject invalid email",
        async () => {



            const response =
                await request(app)
                    .post("/api/users")
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    )
                    .send({
                        full_name: "Test User",
                        email: "wrong-email",
                        password: "Test@123456",
                        role: "user",
                    });

            expect(
                response.statusCode,
            ).toBe(400);

            expect(
                response.body.success,
            ).toBe(false);

            expect(
                response.body.errors,
            ).toBeDefined();
        },
    );


    // ====================================================
    // 7. CREATE USER
    // ====================================================

    test(
        "create user should create a new user",
        async () => {



            const uniqueEmail =
                `users_test_${Date.now()}@gmail.com`;

            const response =
                await request(app)
                    .post("/api/users")
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    )
                    .send({
                        full_name: "Users Test",
                        email: uniqueEmail,
                        password: "Test@123456",
                        role: "user",
                    });

            expect(
                response.statusCode,
            ).toBe(201);

            expect(
                response.body.success,
            ).toBe(true);

            expect(
                response.body.message,
            ).toBe("User Created");
        },
    );


    // ====================================================
    // 8. CREATE DUPLICATE USER
    // ====================================================

    test(
        "create user should reject duplicate email",
        async () => {



            const response =
                await request(app)
                    .post("/api/users")
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    )
                    .send({
                        full_name: "Duplicate User",
                        email: adminEmail,
                        password: "Test@123456",
                        role: "user",
                    });

            expect(
                response.statusCode,
            ).toBe(409);

            expect(
                response.body.success,
            ).toBe(false);

            expect(
                response.body.message,
            ).toBe(
                "Email already exists",
            );
        },
    );


    // ====================================================
    // 9. UPDATE USER VALIDATION
    // ====================================================

    test(
        "update user should reject invalid id",
        async () => {



            const response =
                await request(app)
                    .put(
                        "/api/users/invalid-id",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    )
                    .send({
                        full_name: "Updated User",
                        role: "user",
                    });

            expect(
                response.statusCode,
            ).toBe(400);
        },
    );


    // ====================================================
    // 10. UPDATE USER
    // ====================================================

    test(
        "update user should update user",
        async () => {


            const response =
                await request(app)
                    .put("/api/users/1")
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    )
                    .send({
                        full_name: "Sadik Updated",
                        role: "admin",
                    });

            expect(
                response.statusCode,
            ).toBe(200);

            expect(
                response.body.success,
            ).toBe(true);

            expect(
                response.body.message,
            ).toBe("User Updated");
        },
    );


    // ====================================================
    // 11. PAGINATION
    // ====================================================

    test(
        "users pagination should return paginated data",
        async () => {



            const response =
                await request(app)
                    .get(
                        "/api/users/pagination?page=1&limit=5",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(200);

            expect(
                response.body,
            ).toBeDefined();

            expect(
                response.body.data,
            ).toBeDefined();
        },
    );


    // ====================================================
    // 12. PAGINATION VALIDATION
    // ====================================================

    test(
        "pagination should reject invalid page",
        async () => {



            const response =
                await request(app)
                    .get(
                        "/api/users/pagination?page=0&limit=5",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(400);
        },
    );


    // ====================================================
    // 13. SEARCH
    // ====================================================

    test(
        "user search should return matching users",
        async () => {


            const response =
                await request(app)
                    .get(
                        "/api/users/search?search=Sadik&page=1&limit=5",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(200);

            expect(
                response.body,
            ).toBeDefined();

            expect(
                response.body.data,
            ).toBeDefined();
        },
    );


    // ====================================================
    // 14. SEARCH + SORT
    // ====================================================

    test(
        "user search sort should return sorted users",
        async () => {



            const response =
                await request(app)
                    .get(
                        "/api/users/search-sort?search=&page=1&limit=5&sortBy=full_name&sortOrder=desc",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(200);

            expect(
                response.body,
            ).toBeDefined();

            expect(
                response.body.data,
            ).toBeDefined();
        },
    );


    // ====================================================
    // 15. FILTER
    // ====================================================

    test(
        "user filter should return filtered users",
        async () => {



            const response =
                await request(app)
                    .get(
                        "/api/users/filter?search=&role=user&page=1&limit=5&sortBy=full_name&sortOrder=asc",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(200);

            expect(
                response.body,
            ).toBeDefined();

            expect(
                response.body.data,
            ).toBeDefined();
        },
    );


    // ====================================================
    // 16. DELETE USER VALIDATION
    // ====================================================

    test(
        "delete user should reject invalid id",
        async () => {



            const response =
                await request(app)
                    .delete(
                        "/api/users/invalid-id",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                response.statusCode,
            ).toBe(400);
        },
    );


    // ====================================================
    // 17. DELETE NON-EXISTING USER
    // ====================================================

    test(
        "delete non-existing user should return 200 or 404",
        async () => {



            const response =
                await request(app)
                    .delete(
                        "/api/users/999999",
                    )
                    .set(
                        "Authorization",
                        `Bearer ${adminToken}`,
                    );

            expect(
                [200, 404],
            ).toContain(
                response.statusCode,
            );
        },
    );

});