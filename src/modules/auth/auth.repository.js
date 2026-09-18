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

// create refresh token
export async function createRefreshToken(userId, tokenHash, expiresAt) {
  await query(
    `INSERT INTO auth.refresh_tokens(user_id,token_hash,expires_at)VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt],
  );
}

// get refresh token
export async function getRefreshToken(tokenHash) {
  const result = await query(
    `
      SELECT
        id,
        user_id,
        token_hash,
        expires_at,
        revoked_at,
        replaced_by_token_hash,
        created_at
      FROM auth.refresh_tokens
      WHERE token_hash = $1
      LIMIT 1
    `,
    [tokenHash],
  );

  return result.rows[0];
}

// revoke refresh token
export async function revokeRefreshToken(tokenHash, replacedByTokenHash = null) {
  await query(
    `
      UPDATE auth.refresh_tokens
      SET
        revoked_at = CURRENT_TIMESTAMP,
        replaced_by_token_hash = $2
      WHERE token_hash = $1
        AND revoked_at IS NULL
    `,
    [
      tokenHash,
      replacedByTokenHash,
    ],
  );
}

// delete expired refresh tokens
export async function deleteExpiredRefreshTokens() {
  await query(
    `
      DELETE FROM auth.refresh_tokens
      WHERE expires_at <= CURRENT_TIMESTAMP
    `,
  );
}
