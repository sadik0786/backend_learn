import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const refreshCookieOptions = {
  httpOnly: true,
  secure:
    process.env.NODE_ENV ===
    "production",
  sameSite:
    process.env.NODE_ENV ===
      "production"
      ? "none"
      : "lax",
  maxAge:
    7 * 24 * 60 * 60 * 1000,
};

// register
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});
// login
export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.cookie(
    "refreshToken",
    result.refreshToken,
    refreshCookieOptions,
  );
  const {
    refreshToken,
    ...response
  } = result;

  res.json(response);

});

// refresh token
export const refresh = asyncHandler(
  async (req, res) => {
    const refreshToken =
      req.cookies.refreshToken;

    const result =
      await authService.refreshAccessToken(
        refreshToken,
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions,
    );

    res.json({
      success: true,
      token: result.accessToken,
      user: result.user,
    });
  },
);

// logout
export const logout = asyncHandler(
  async (req, res) => {
    const refreshToken =
      req.cookies.refreshToken;

    await authService.logout(
      refreshToken,
    );

    res.clearCookie(
      "refreshToken",
      refreshCookieOptions,
    );

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  },
);

// profile
export const profile = asyncHandler(async (req, res) => {
  const result = await authService.profile(req.user.id);
  res.json(result);
});


