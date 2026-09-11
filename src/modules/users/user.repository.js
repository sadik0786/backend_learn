import { query } from "../../config/db.js";

// get all users
export async function getUsers() {
  const result = await query("SELECT * FROM auth.fn_get_users()");
  return result.rows;
}

// create a new user
export async function createUser(full_name, email, passwordHash, role) {
  await query("CALL auth.sp_create_user($1,$2,$3,$4)", [
    full_name,
    email,
    passwordHash,
    role,
  ]);
}

// get user by email
export async function getUserByEmail(email) {
  const result = await query("SELECT * FROM auth.fn_login($1)", [email]);
  return result.rows[0];
}

// get user by id
export async function getUserById(id) {
  const result = await query("SELECT * FROM auth.fn_get_user_by_id($1)", [id]);
  return result.rows[0];
}

// update user by id
export async function updateUser(id, full_name, role) {
  await query("CALL auth.sp_update_user($1,$2,$3)", [id, full_name, role]);
}

// delete user by id
export async function deleteUser(id) {
  await query("CALL auth.sp_delete_user($1)", [id]);
}

// pagination
export async function getUsersPagination(page, limit) {
  const result = await query(
    "SELECT * FROM auth.fn_get_users_pagination($1,$2)",
    [page, limit],
  );
  return result.rows;
}
// get users count
export async function getUsersCount() {
  const result = await query(
    "SELECT auth.fn_get_users_pagination_count() AS total",
  );

  return Number(result.rows[0].total);
}
// search users pagination
export async function searchUsersPagination(search, page, limit) {
  const result = await query(
    "SELECT * FROM auth.fn_search_users_pagination($1,$2,$3)",
    [search, page, limit],
  );

  return result.rows;
}

// search users count
export async function searchUsersCount(search) {
  const result = await query("SELECT auth.fn_search_users_count($1) AS total", [
    search,
  ]);

  return Number(result.rows[0].total);
}

// search sort users pagination
export async function searchSortUsersPagination(
  search,
  page,
  limit,
  sortBy,
  sortOrder,
) {
  const result = await query(
    "SELECT * FROM auth.fn_search_sort_users_pagination($1,$2,$3,$4,$5)",
    [search, page, limit, sortBy, sortOrder],
  );

  return result.rows;
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
  const result = await query(
    `SELECT * FROM auth.fn_filter_users_pagination($1,$2,$3,$4,$5,$6)`,
    [search, role, page, limit, sortBy, sortOrder],
  );

  return result.rows;
}

// filter users count
export async function filterUsersCount(search, role) {
  const result = await query(
    `SELECT auth.fn_filter_users_count($1,$2) AS total`,
    [search, role],
  );

  return Number(result.rows[0].total);
}

