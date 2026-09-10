import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// register
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});
// login
export async function login(req, res) {
  try {
    const result = await authService.login(req.body);

    res.json(result);
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}
// profile
export async function profile(req, res) {
  try {
    const result = await authService.profile(req.user.id);

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
