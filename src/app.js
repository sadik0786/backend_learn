import express from "express";
import helmet from "helmet";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";

import { query } from "./config/db.js";
import corsOptions from "./config/cors.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Rate limiting
app.use(apiLimiter);

// Request logger
app.use(requestLogger);

// Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
);

// Request body limit
app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", async (req, res) => {
    try {
        await query("SELECT 1");

        res.status(200).json({
            success: true,
            message: "API and database are healthy",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Database unavailable",
            database: "disconnected",
        });
    }
});

// Error handler must be LAST
app.use(errorHandler);

export default app;
