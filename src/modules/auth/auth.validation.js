import { z } from "zod";

// validation schema for register
export const registerSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

// validation schema for login
export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
