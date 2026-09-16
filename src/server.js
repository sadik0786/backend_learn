import dotenv from "dotenv";

import app from "./app.js";
import { query } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

async function start() {
  try {
    await query("SELECT NOW()");

    console.log("Database Connected");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error(
      "Database connection failed:",
      error.message,
    );

    process.exit(1);
  }
}

start();
