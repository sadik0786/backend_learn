import bcrypt from "bcrypt";
import { AppError } from "../../utils/AppError.js";
import * as userRepository from "./user.repository.js";

// get all users
export async function getUsers() {
  return await userRepository.getUsers();
}
// create a new user
export async function createUser(data) {
  const exists = await userRepository.getUserByEmail(data.email);
  if (exists) {
    throw new AppError("Email already exists", 409);
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  await userRepository.createUser(
    data.full_name,
    data.email,
    passwordHash,
    data.role,
  );
  return {
    success: true,
    message: "User Created",
  };
}

// get user by id
export async function getUserById(id) {
  const user = await userRepository.getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
}

// update user by id
export async function updateUser(id, data) {
  await userRepository.updateUser(id, data.full_name, data.role);
  return {
    success: true,
    message: "User Updated",
  };
}

// delete user by id
export async function deleteUser(id) {
  await userRepository.deleteUser(id);
  return {
    success: true,
    message: "User Deleted",
  };
}
// pagination
export async function getUsersPagination(page, limit) {
  const users = await userRepository.getUsersPagination(page, limit);
  const total = await userRepository.getUsersCount();
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    data: users,
  };
}

// search users pagination
export async function searchUsersPagination(search, page, limit) {
  const users = await userRepository.searchUsersPagination(search, page, limit);

  const total = await userRepository.searchUsersCount(search);

  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    search,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    data: users,
  };
}

// search and sort users pagination
export async function searchSortUsersPagination(
  search,
  page,
  limit,
  sortBy,
  sortOrder,
) {
  const users = await userRepository.searchSortUsersPagination(
    search,
    page,
    limit,
    sortBy,
    sortOrder,
  );

  const total = await userRepository.searchUsersCount(search);

  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    data: users,
  };
}

// filter users pagination
export async function filterUsersPagination(
  search,
  role,
  page,
  limit,
  sortBy,
  sortOrder,
) {
  const users = await userRepository.filterUsersPagination(
    search,
    role,
    page,
    limit,
    sortBy,
    sortOrder,
  );

  const total = await userRepository.filterUsersCount(search, role);

  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    search,
    role,
    sortBy,
    sortOrder,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
    data: users,
  };
}
