import rateLimit from "express-rate-limit";

/** Strict limiter for authentication endpoints to prevent brute-force attacks. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many authentication attempts, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
  },
});

/** Moderate limiter for public form submissions to prevent spam. */
export const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many submissions, please try again later",
    code: "RATE_LIMIT_EXCEEDED",
  },
});
