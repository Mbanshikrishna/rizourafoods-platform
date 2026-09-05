import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface UserContext {
      userId: string;
      email: string;
      role: UserRole;
    }

    interface Request {
      id?: string;
      user?: UserContext;
      requestId?: string;
      customer?: { customerId: string; email: string; status: import("@prisma/client").CustomerStatus };
    }
  }
}

export {};
