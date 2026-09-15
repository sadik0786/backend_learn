import { z } from "zod";

export const createUserSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"], { message: "Role must be admin or user" }),
});

export const updateUserSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  role: z.enum(["admin", "user"], {
    message: "Role must be admin or user",
  }),
});

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const userPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  search: z.string().default(""),

  role: z.enum(["admin", "user"]).optional(),

  sortBy: z.enum(["full_name", "email", "created_at"]).default("created_at"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
