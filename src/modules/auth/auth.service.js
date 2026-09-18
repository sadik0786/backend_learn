import bcrypt, { hash } from "bcrypt";
import { generateToken } from "../../utils/jwt.js";
import { AppError } from "../../utils/AppError.js";
import {
  registerUser,
  checkEmailExists,
  getUserByEmail,
  getUserById,
  createRefreshToken,
  getRefreshToken,
  revokeRefreshToken,
} from "./auth.repository.js";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/refreshToken.js";

// register
export async function register(data) {
  const existingUser = await checkEmailExists(data.email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }
  const passwordHash = await hash(data.password, 10);
  await registerUser(data.full_name, data.email, passwordHash);
  return {
    success: true,
    message: "User Registered",
  };
}

// login
export async function login(data) {
  const user = await getUserByEmail(data.email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isMatch = await bcrypt.compare(data.password, user.password_hash);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  // Access token
  const accessToken = generateToken(user);

  // Refresh token
  const refreshToken = generateRefreshToken();

  // Store only hash in DB
  const refreshTokenHash =
    hashRefreshToken(refreshToken);

  // 7 days
  const expiresAt = new Date(
    Date.now() +
    7 * 24 * 60 * 60 * 1000,
  );

  await createRefreshToken(
    user.id,
    refreshTokenHash,
    expiresAt,
  );
  return {
    success: true,
    token: accessToken,
    refreshToken,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
}

// refresh access token
export async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token is required",
      401,
    );
  }

  const tokenHash =
    hashRefreshToken(refreshToken);

  const storedToken =
    await getRefreshToken(tokenHash);

  if (!storedToken) {
    throw new AppError(
      "Invalid refresh token",
      401,
    );
  }

  if (storedToken.revoked_at) {
    throw new AppError(
      "Refresh token has been revoked",
      401,
    );
  }

  if (
    new Date(storedToken.expires_at) <=
    new Date()
  ) {
    throw new AppError(
      "Refresh token has expired",
      401,
    );
  }

  const user = await getUserById(
    storedToken.user_id,
  );

  if (!user) {
    throw new AppError(
      "User not found",
      404,
    );
  }

  // New access token
  const accessToken =
    generateToken(user);

  // Token rotation
  const newRefreshToken =
    generateRefreshToken();

  const newRefreshTokenHash =
    hashRefreshToken(
      newRefreshToken,
    );

  const newExpiresAt = new Date(
    Date.now() +
    7 * 24 * 60 * 60 * 1000,
  );

  await createRefreshToken(
    user.id,
    newRefreshTokenHash,
    newExpiresAt,
  );

  await revokeRefreshToken(
    tokenHash,
    newRefreshTokenHash,
  );

  return {
    accessToken,
    refreshToken:
      newRefreshToken,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    },
  };
}

// profile
export async function profile(id) {
  return await getUserById(id);
}

// logout
export async function logout(refreshToken) {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    hashRefreshToken(refreshToken);

  await revokeRefreshToken(
    tokenHash,
  );
}
