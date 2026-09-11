import { asyncHandler } from "../../utils/asyncHandler.js";
import * as userService from "./user.service.js";

// get all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers();
  res.status(200).json({
    success: true,
    data: users,
  });
});

// create a new user
export const createUser = asyncHandler(async (req, res) => {
  const result = await userService.createUser(req.body);
  res.status(201).json(result);
});

// get user by id
export const getUserById = asyncHandler(async (req, res) => {
  const result = await userService.getUserById(req.params.id);
  res.json(result);
});

// update user by id
export const updateUser = asyncHandler(async (req, res) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.json(result);
});

// delete user by id
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);
  res.json(result);
});

// pagination
export const getUsersPagination = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await userService.getUsersPagination(page, limit);
  res.json({
    success: true,
    ...result,
  });
});

// search users pagination
export const searchUsersPagination = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await userService.searchUsersPagination(search, page, limit);

  res.json({
    success: true,
    ...result,
  });
});

// search and sort users pagination
export const searchSortUsersPagination = asyncHandler(async (req, res) => {
  const search = req.query.search || "";

  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const sortBy = req.query.sortBy || "created_at";

  const sortOrder = req.query.sortOrder || "desc";

  const result = await userService.searchSortUsersPagination(
    search,
    page,
    limit,
    sortBy,
    sortOrder,
  );

  res.json({
    success: true,
    ...result,
  });
});

// filter users pagination
export const filterUsersPagination = asyncHandler(async (req, res) => {
  const search = req.query.search || "";

  const role = req.query.role || "";

  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const sortBy = req.query.sortBy || "created_at";

  const sortOrder = req.query.sortOrder || "desc";

  const result = await userService.filterUsersPagination(
    search,
    role,
    page,
    limit,
    sortBy,
    sortOrder,
  );

  res.json({
    success: true,
    ...result,
  });
});
