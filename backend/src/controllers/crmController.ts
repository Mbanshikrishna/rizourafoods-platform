import type { Request, Response } from "express";
import { customerService } from "../services/customerService";

export const crmController = {
  listCustomers: async (_req: Request, res: Response) => res.json(await customerService.listCrm(res.locals.validatedQuery)),
  getCustomer: async (req: Request, res: Response) => res.json({ data: await customerService.crmCustomer(req.params.id as string, req.user!.role) }),
  approveCustomer: async (req: Request, res: Response) => res.json({ data: await customerService.approveCustomer(req.params.id as string, req.user!.userId) }),
  suspendCustomer: async (req: Request, res: Response) => res.json({ data: await customerService.suspendCustomer(req.params.id as string, req.user!.userId) }),
  updateBusiness: async (req: Request, res: Response) => res.json({ data: await customerService.updateCrmBusiness(req.params.id as string, req.body, req.user!.userId) }),
  reviewBusiness: async (req: Request, res: Response) => res.json({ data: await customerService.reviewBusiness(req.params.id as string, req.body.status, req.user!.userId) }),
  listContacts: async (req: Request, res: Response) => res.json({ data: await customerService.listCrmContacts(req.params.id as string) }),
  addContact: async (req: Request, res: Response) => res.status(201).json({ data: await customerService.createCrmContact(req.params.id as string, req.body) }),
  updateContact: async (req: Request, res: Response) => res.json({ data: await customerService.updateCrmContact(req.params.id as string, req.params.contactId as string, req.body) }),
  deleteContact: async (req: Request, res: Response) => { await customerService.deleteCrmContact(req.params.id as string, req.params.contactId as string); res.status(204).send(); },
  listAddresses: async (req: Request, res: Response) => res.json({ data: await customerService.addresses(req.params.id as string) }),
  addAddress: async (req: Request, res: Response) => res.status(201).json({ data: await customerService.addAddress(req.params.id as string, req.body) }),
  updateAddress: async (req: Request, res: Response) => res.json({ data: await customerService.updateAddress(req.params.id as string, req.params.addressId as string, req.body) }),
  deleteAddress: async (req: Request, res: Response) => { await customerService.deleteAddress(req.params.id as string, req.params.addressId as string); res.status(204).send(); },
  createActivity: async (req: Request, res: Response) => res.status(201).json({ data: await customerService.createActivity(req.params.id as string, req.body.contactId, req.body.type, req.body.subject, req.body.details, req.user!.userId) }),
  listActivities: async (req: Request, res: Response) => { const { page, pageSize } = res.locals.validatedQuery; res.json(await customerService.listActivities(req.params.id as string, page, pageSize)); },
};
