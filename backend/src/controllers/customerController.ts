import type { Request, Response } from "express";
import { env } from "../config/env";
import { customerService } from "../services/customerService";
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
  addresses: async (req: Request, res: Response) => res.json({ data: await customerService.addresses(req.customer!.customerId) }),
  addAddress: async (req: Request, res: Response) => res.status(201).json({ data: await customerService.addAddress(req.customer!.customerId, req.body) }),
  updateAddress: async (req: Request, res: Response) => res.json({ data: await customerService.updateAddress(req.customer!.customerId, req.params.id as string, req.body) }),
  deleteAddress: async (req: Request, res: Response) => { await customerService.deleteAddress(req.customer!.customerId, req.params.id as string); res.status(204).send(); },
  contacts: async (req: Request, res: Response) => res.json({ data: await customerService.contacts(req.customer!.customerId) }),
  addContact: async (req: Request, res: Response) => res.status(201).json({ data: await customerService.addContact(req.customer!.customerId, req.body) }),
  updateContact: async (req: Request, res: Response) => res.json({ data: await customerService.updateContact(req.customer!.customerId, req.params.id as string, req.body) }),
  deleteContact: async (req: Request, res: Response) => { await customerService.deleteContact(req.customer!.customerId, req.params.id as string); res.status(204).send(); },
};
