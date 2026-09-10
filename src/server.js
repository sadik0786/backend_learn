import dotenv from "dotenv";

import app from "./app.js";
import { query } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

async function start() {
  try {
    await query("SELECT NOW()");
    console.log("Database Connected");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }

  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

start();
