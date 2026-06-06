import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().default("/api/v1"),
  APP_NAME: z.string().default("Rizoura Foods API"),
  LOG_LEVEL: z.string().default("info"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  JWT_REFRESH_COOKIE_NAME: z.string().default("rizoura_refresh_token"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(15).default(12),
  DEFAULT_ADMIN_NAME: z.string().default("Rizoura Admin"),
  DEFAULT_ADMIN_EMAIL: z.string().email().default("admin@rizourafoods.com"),
  DEFAULT_ADMIN_PASSWORD: z
    .string()
    .min(16, "DEFAULT_ADMIN_PASSWORD must be at least 16 characters")
    .regex(/[A-Z]/, "DEFAULT_ADMIN_PASSWORD must contain an uppercase letter")
    .regex(/[a-z]/, "DEFAULT_ADMIN_PASSWORD must contain a lowercase letter")
    .regex(/[0-9]/, "DEFAULT_ADMIN_PASSWORD must contain a digit")
    .regex(/[^A-Za-z0-9]/, "DEFAULT_ADMIN_PASSWORD must contain a special character"),
  AWS_REGION: z.string().default("ap-south-1"),
  SES_FROM_EMAIL: z.string().email().default("no-reply@rizourafoods.com"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment configuration: ${JSON.stringify(formatted)}`);
}

export const env = parsed.data;
