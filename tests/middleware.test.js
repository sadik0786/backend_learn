import {
    describe,
    test,
    expect,
} from "vitest";

import request from "supertest";

import app from "../src/app.js";

describe(
    "Middleware and Error Handling",
    () => {

        // =========================================
        // 1. AUTH MIDDLEWARE
        // =========================================

        test(
            "should reject request when Authorization header is missing",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/users",
                        );

                expect(
                    response.statusCode,
                ).toBe(401);

                expect(
                    response.body.success,
                ).toBe(false);

                expect(
                    response.body.message,
                ).toBe(
                    "Authorization header is required",
                );
            },
        );


        // =========================================
        // 2. INVALID JWT
        // =========================================

        test(
            "should reject request with invalid JWT",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/users",
                        )
                        .set(
                            "Authorization",
                            "Bearer invalid-token",
                        );

                expect(
                    response.statusCode,
                ).toBe(401);

                expect(
                    response.body.success,
                ).toBe(false);

                expect(
                    response.body.message,
                ).toBe(
                    "Invalid or expired token",
                );
            },
        );


        // =========================================
        // 3. INVALID BEARER FORMAT
        // =========================================

        test(
            "should reject invalid Authorization format",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/users",
                        )
                        .set(
                            "Authorization",
                            "InvalidToken",
                        );

                expect(
                    response.statusCode,
                ).toBe(401);

                expect(
                    response.body.success,
                ).toBe(false);
            },
        );


        // =========================================
        // 4. VALID BEARER BUT INVALID TOKEN
        // =========================================

        test(
            "should reject malformed Bearer token",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/users",
                        )
                        .set(
                            "Authorization",
                            "Bearer abc.def.xyz",
                        );

                expect(
                    response.statusCode,
                ).toBe(401);

                expect(
                    response.body.success,
                ).toBe(false);
            },
        );


        // =========================================
        // 5. VALIDATION ERROR
        // =========================================

        test(
            "should return 400 for invalid request body",
            async () => {

                const response =
                    await request(app)
                        .post(
                            "/api/auth/login",
                        )
                        .send({
                            email:
                                "invalid-email",
                            password:
                                "123",
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

                expect(
                    Array.isArray(
                        response.body.errors,
                    ),
                ).toBe(true);
            },
        );


        // =========================================
        // 6. INVALID USER ID
        // =========================================

        test(
            "should return 400 for invalid user id",
            async () => {

                const login =
                    await request(app)
                        .post(
                            "/api/auth/login",
                        )
                        .send({
                            email:
                                "sadik@gmail.com",
                            password:
                                "admin$123",
                        });

                expect(
                    login.statusCode,
                ).toBe(200);

                const token =
                    login.body.token;

                const response =
                    await request(app)
                        .get(
                            "/api/users/abc",
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`,
                        );

                expect(
                    response.statusCode,
                ).toBe(400);

                expect(
                    response.body.success,
                ).toBe(false);
            },
        );


        // =========================================
        // 7. NON EXISTING ROUTE
        // =========================================

        test(
            "should return 404 for unknown route",
            async () => {

                const response =
                    await request(app)
                        .get(
                            "/api/this-route-does-not-exist",
                        );

                expect(
                    response.statusCode,
                ).toBe(404);
            },
        );


        // =========================================
        // 8. HTTP METHOD ERROR
        // =========================================

        test(
            "should return 404 for unsupported HTTP method",
            async () => {

                const response =
                    await request(app)
                        .patch(
                            "/api/auth/login",
                        )
                        .send({
                            email:
                                "sadik@gmail.com",
                            password:
                                "admin$123",
                        });

                expect(
                    response.statusCode,
                ).toBe(404);
            },
        );

    },
);