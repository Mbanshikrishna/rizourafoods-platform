import { beforeEach, describe, expect, it, vi } from "vitest";

const { address, customerContact, prisma } = vi.hoisted(() => {
  const address = { count: vi.fn(), create: vi.fn(), updateMany: vi.fn(), findUnique: vi.fn(), deleteMany: vi.fn(), findMany: vi.fn() };
  const customerContact = { count: vi.fn(), create: vi.fn(), updateMany: vi.fn(), findUnique: vi.fn(), deleteMany: vi.fn(), findMany: vi.fn(), findFirst: vi.fn() };
  const prisma = {
    address,
    customerContact,
    customer: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), findUniqueOrThrow: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    customerRefreshToken: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
    businessProfile: { findUniqueOrThrow: vi.fn(), update: vi.fn() },
    crmActivity: { create: vi.fn(), findMany: vi.fn(), count: vi.fn() },
    $transaction: vi.fn(async (callback) => callback({ address, customerContact })),
  };
  return { address, customerContact, prisma };
});

vi.mock("../src/prisma/client", () => ({ prisma }));

import { customerRepository } from "../src/repositories/customerRepository";

describe("customerRepository primary/default invariants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    address.count.mockResolvedValue(0);
    address.create.mockImplementation(async ({ data }) => data);
    address.updateMany.mockResolvedValue({ count: 1 });
    address.findUnique.mockResolvedValue({ id: "address-a" });
    customerContact.count.mockResolvedValue(0);
    customerContact.create.mockImplementation(async ({ data }) => data);
    customerContact.updateMany.mockResolvedValue({ count: 1 });
    customerContact.findUnique.mockResolvedValue({ id: "contact-a" });
  });

  it("makes a customer's first address default and scopes writes to that customer", async () => {
    const result = await customerRepository.createAddress("customer-a", { type: "DELIVERY", line1: "1 Road", city: "Kolkata", state: "West Bengal", pincode: "700001", country: "India" });

    expect(result).toMatchObject({ customerId: "customer-a", isDefault: true });
    expect(address.updateMany).not.toHaveBeenCalled();
  });

  it("clears only the same customer's prior default address on create and update", async () => {
    address.count.mockResolvedValue(1);
    await customerRepository.createAddress("customer-a", { type: "DELIVERY", line1: "2 Road", city: "Kolkata", state: "West Bengal", pincode: "700001", country: "India", isDefault: true });
    await customerRepository.updateAddress("customer-a", "address-a", { isDefault: true });

    expect(address.updateMany).toHaveBeenCalledWith({ where: { customerId: "customer-a" }, data: { isDefault: false } });
    expect(address.updateMany).toHaveBeenCalledWith({ where: { id: "address-a", customerId: "customer-a" }, data: { isDefault: true } });
  });

  it("makes a customer's first contact primary and clears only that customer's previous primary", async () => {
    const first = await customerRepository.createContact("customer-a", { name: "A Owner", role: "OWNER" });
    customerContact.count.mockResolvedValue(1);
    await customerRepository.createContact("customer-a", { name: "A Buyer", role: "PROCUREMENT", isPrimary: true });
    await customerRepository.updateContact("customer-a", "contact-a", { isPrimary: true });

    expect(first).toMatchObject({ customerId: "customer-a", isPrimary: true });
    expect(customerContact.updateMany).toHaveBeenCalledWith({ where: { customerId: "customer-a" }, data: { isPrimary: false } });
    expect(customerContact.updateMany).toHaveBeenCalledWith({ where: { id: "contact-a", customerId: "customer-a" }, data: { isPrimary: true } });
  });
});
