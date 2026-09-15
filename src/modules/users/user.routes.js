import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createUserSchema,
  userIdSchema,
  updateUserSchema,
  userPaginationSchema,
} from "./user.validation.js";

import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUsersPagination,
  searchUsersPagination,
  searchSortUsersPagination,
  filterUsersPagination,
} from "./user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", validate(createUserSchema), createUser);
router.get("/pagination", getUsersPagination);
router.get("/search", searchUsersPagination);
router.get(
  "/search-sort",
  validate(userPaginationSchema, "query"),
  searchSortUsersPagination,
);
router.get(
  "/filter",
  validate(userPaginationSchema, "query"),
  filterUsersPagination,
);
router.get("/:id", validate(userIdSchema, "params"), getUserById);
router.put(
  "/:id",
  validate(userIdSchema, "params"),
  validate(updateUserSchema, "body"),
  updateUser,
);
router.delete("/:id", validate(userIdSchema, "params"), deleteUser);

export default router;
