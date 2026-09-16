import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// register
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});
// login
export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

// profile
  
export const profile = asyncHandler(async (req, res) => {
  const result = await authService.profile(req.user.id);
  res.json(result);
});


