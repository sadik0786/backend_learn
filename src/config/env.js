import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "JWT_SECRET",
];

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(
            `Missing required environment variable: ${variable}`,
        );
    }
}

if (process.env.JWT_SECRET.length < 32) {
    throw new Error(
        "JWT_SECRET must be at least 32 characters long",
    );
}

export const env = {
    nodeEnv: process.env.NODE_ENV || "development",

    port: Number(process.env.PORT || 5000),

    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        accessTokenExpiresIn: "15m",
    },

    corsOrigins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS
            .split(",")
            .map((origin) => origin.trim())
            .filter(Boolean)
        : [],
};