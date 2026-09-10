import { query } from "../../config/db.js";

// register user
export async function registerUser(full_name, email, passwordHash) {
  await query("CALL auth.sp_register_user($1,$2,$3)", [
    full_name,
    email,
    passwordHash,
  ]);
}

// Check if email exists
export async function checkEmailExists(email) {
  const result = await query("SELECT * FROM auth.fn_login($1)", [email]);
  return result.rows[0];
}

// login user
export async function getUserByEmail(email) {
  const result = await query("SELECT * FROM auth.fn_login($1)", [email]);

  return result.rows[0];
}

// get user by id
export async function getUserById(id) {
  const result = await query("SELECT * FROM auth.fn_get_user($1)", [id]);

  return result.rows[0];
}
