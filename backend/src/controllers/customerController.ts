import type { Request, Response } from "express";
import { env } from "../config/env";
import { customerService } from "../services/customerService";
import { prisma } from "../prisma/client";
import { ApiError } from "../utils/apiError";
const cookie = (res: Response, token: string) => res.cookie(env.CUSTOMER_REFRESH_COOKIE_NAME, token, { httpOnly: true, sameSite: "strict", secure: env.NODE_ENV === "production", path: `${env.API_PREFIX}/customer-auth`, maxAge: 7 * 24 * 60 * 60 * 1000 });
const result = (res: Response, data: { customer: unknown; tokens: { accessToken: string; refreshToken: string } }, status = 200) => { cookie(res, data.tokens.refreshToken); res.status(status).json({ data: { customer: data.customer, accessToken: data.tokens.accessToken } }); };
export const customerController = {
  register: async (req: Request, res: Response) => result(res, await customerService.register(req.body), 201),
  login: async (req: Request, res: Response) => result(res, await customerService.login(req.body.email, req.body.password)),
  refresh: async (req: Request, res: Response) => { const token = req.cookies?.[env.CUSTOMER_REFRESH_COOKIE_NAME] ?? req.body.refreshToken; if (!token) throw new ApiError(401, "Refresh token is required", "REFRESH_TOKEN_REQUIRED"); result(res, await customerService.refresh(token)); },
  logout: async (req: Request, res: Response) => { const token = req.cookies?.[env.CUSTOMER_REFRESH_COOKIE_NAME] ?? req.body?.refreshToken; if (token) await customerService.logout(token); res.clearCookie(env.CUSTOMER_REFRESH_COOKIE_NAME, { path: `${env.API_PREFIX}/customer-auth` }); res.status(200).json({ message: "Logged out" }); },
  me: async (req: Request, res: Response) => res.json({ data: await customerService.get(req.customer!.customerId) }),
  updateMe: async (req: Request, res: Response) => res.json({ data: await customerService.update(req.customer!.customerId, req.body) }),
  business: async (req: Request, res: Response) => res.json({ data: await customerService.business(req.customer!.customerId) }),
  updateBusiness: async (req: Request, res: Response) => res.json({ data: await customerService.updateBusiness(req.customer!.customerId, req.body) }),
  addresses: async (req: Request, res: Response) => res.json({ data: await prisma.address.findMany({ where: { customerId: req.customer!.customerId }, orderBy: { createdAt: "desc" } }) }),
  addAddress: async (req: Request, res: Response) => res.status(201).json({ data: await prisma.address.create({ data: { ...req.body, customerId: req.customer!.customerId } }) }),
  updateAddress: async (req: Request, res: Response) => { const id = req.params.id as string; const address = await prisma.address.updateMany({ where: { id, customerId: req.customer!.customerId }, data: req.body }); if (!address.count) throw new ApiError(404, "Address not found", "ADDRESS_NOT_FOUND"); res.json({ data: await prisma.address.findUnique({ where: { id } }) }); },
  deleteAddress: async (req: Request, res: Response) => { const address = await prisma.address.deleteMany({ where: { id: req.params.id as string, customerId: req.customer!.customerId } }); if (!address.count) throw new ApiError(404, "Address not found", "ADDRESS_NOT_FOUND"); res.status(204).send(); },
};
