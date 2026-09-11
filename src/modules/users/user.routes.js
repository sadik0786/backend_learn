import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { createUserSchema } from "./user.validation.js";

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
router.get("/search-sort", searchSortUsersPagination);
router.get("/filter", filterUsersPagination);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
