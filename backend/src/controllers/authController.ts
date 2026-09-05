import type { Request, Response } from "express";
import { env } from "../config/env";
import { authService } from "../services/authService";
import { ApiError } from "../utils/apiError";

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie(env.JWT_REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: env.NODE_ENV === "production",
    path: `${env.API_PREFIX}/auth`,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie(env.JWT_REFRESH_COOKIE_NAME, {
    path: `${env.API_PREFIX}/auth`,
  });
};

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const tokens = await authService.login(email, password);

    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({
      message: "Login successful",
      data: {
        accessToken: tokens.accessToken,
      },
    });
  },

  refresh: async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.[env.JWT_REFRESH_COOKIE_NAME] ?? req.body.refreshToken ?? null;

    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required", "REFRESH_TOKEN_REQUIRED");
    }

    const tokens = await authService.refresh(refreshToken);
    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({
      message: "Token refreshed successfully",
      data: {
        accessToken: tokens.accessToken,
      },
    });
  },

  logout: async (req: Request, res: Response) => {
    const refreshToken =
      req.cookies?.[env.JWT_REFRESH_COOKIE_NAME] ?? req.body?.refreshToken ?? null;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    clearRefreshCookie(res);

    res.status(200).json({
      message: "Logged out successfully",
    });
  },
};
