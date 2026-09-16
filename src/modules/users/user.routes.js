import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { verifyTokenMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

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
  uploadFile,
  searchUsersPagination,
  searchSortUsersPagination,
  filterUsersPagination,
} from "./user.controller.js";

const router = Router();

router.use(verifyTokenMiddleware);

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", authorizeRoles("admin"), getUsers);

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post(
  "/",
  authorizeRoles("admin"),
  validate(createUserSchema),
  createUser,
);

/**
 * @openapi
 * /api/users/pagination:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get paginated users (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Paginated users list
 */
router.get(
  "/pagination",
  authorizeRoles("admin"),
  validate(userPaginationSchema, "query"),
  getUsersPagination,
);

/**
 * @openapi
 * /api/users/search:
 *   get:
 *     tags:
 *       - Users
 *     summary: Search users with pagination (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Search results
 */
router.get(
  "/search",
  authorizeRoles("admin"),
  validate(userPaginationSchema, "query"),
  searchUsersPagination,
);

/**
 * @openapi
 * /api/users/search-sort:
 *   get:
 *     tags:
 *       - Users
 *     summary: Search and sort users with pagination (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: full_name
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *     responses:
 *       200:
 *         description: Sorted search results
 */
router.get(
  "/search-sort",
  authorizeRoles("admin"),
  validate(userPaginationSchema, "query"),
  searchSortUsersPagination,
);

/**
 * @openapi
 * /api/users/filter:
 *   get:
 *     tags:
 *       - Users
 *     summary: Filter users with pagination (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           example: user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: full_name
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *     responses:
 *       200:
 *         description: Filtered users list
 */
router.get(
  "/filter",
  authorizeRoles("admin"),
  validate(userPaginationSchema, "query"),
  filterUsersPagination,
);

/**
 * @openapi
 * /api/users/upload:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload a file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post(
  "/upload",
  verifyTokenMiddleware,
  upload.single("file"),
  uploadFile,
);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User data
 *       404:
 *         description: User not found
 */
router.get(
  "/:id",
  authorizeRoles("admin"),
  validate(userIdSchema, "params"),
  getUserById,
);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Updated Name
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put(
  "/:id",
  authorizeRoles("admin"),
  validate(userIdSchema, "params"),
  validate(updateUserSchema, "body"),
  updateUser,
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate(userIdSchema, "params"),
  deleteUser,
);

export default router;

