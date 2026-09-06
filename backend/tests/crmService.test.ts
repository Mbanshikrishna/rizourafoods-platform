import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/repositories/customerRepository", () => ({
  customerRepository: {
    updateAddress: vi.fn(),
    deleteAddress: vi.fn(),
    updateContact: vi.fn(),
    deleteContact: vi.fn(),
    findContactForCustomer: vi.fn(),
    createActivity: vi.fn(),
    getCrmCustomer: vi.fn(),
    getSelf: vi.fn(),
    getBusinessForCustomer: vi.fn(),
    updateCustomerStatus: vi.fn(),
    reviewBusiness: vi.fn(),
    updateCrmBusiness: vi.fn(),
    listActivities: vi.fn(),
    listCrmCustomers: vi.fn(),
  },
}));

import { customerRepository } from "../src/repositories/customerRepository";
import { customerService } from "../src/services/customerService";

const crmCustomer = {
  id: "customer-a",
  name: "Customer A",
  email: "a@example.com",
  phone: null,
  status: "ACTIVE",
  createdAt: new Date(),
  updatedAt: new Date(),
  contacts: [],
  addresses: [],
  crmActivities: [{ id: "activity-1", subject: "Internal note" }],
  businessProfile: {
    id: "business-a",
    currentSupplier: "Supplier A",
    monthlyRiceConsumption: "500 kg",
    monthlyFoodProcurement: null,
    preferredPackSize: null,
    paymentTerms: null,
    deliveryRequirements: null,
    deliveryFrequency: null,
    categoriesOfInterest: ["RICE"],
    businessName: "Customer A Foods",
  },
};

describe("CRM customer isolation and visibility", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rejects a customer-owned contact update when the contact belongs to another customer", async () => {
    vi.mocked(customerRepository.updateContact).mockResolvedValue(null);

    await expect(customerService.updateContact("customer-a", "contact-b", { name: "Changed" })).rejects.toMatchObject({ statusCode: 404, code: "CONTACT_NOT_FOUND" });
  });

  it("rejects an activity linked to another customer's contact", async () => {
    vi.mocked(customerRepository.findContactForCustomer).mockResolvedValue(null);

    await expect(customerService.createActivity("customer-a", "contact-b", "NOTE", "Follow up", undefined, "sales-1")).rejects.toMatchObject({ statusCode: 422, code: "CRM_CONTACT_MISMATCH" });
  });

  it("does not expose internal activities or commercial observations to VIEWER", async () => {
    vi.mocked(customerRepository.getCrmCustomer).mockResolvedValue(crmCustomer as never);

    const result = await customerService.crmCustomer("customer-a", "VIEWER");

    expect(result).not.toHaveProperty("crmActivities");
    expect(result.businessProfile).not.toHaveProperty("currentSupplier");
    expect(result.businessProfile).not.toHaveProperty("categoriesOfInterest");
  });

  it("keeps internal CRM detail available to SALES", async () => {
    vi.mocked(customerRepository.getCrmCustomer).mockResolvedValue(crmCustomer as never);

    const result = await customerService.crmCustomer("customer-a", "SALES");

    expect(result).toHaveProperty("crmActivities");
    expect(result.businessProfile).toHaveProperty("currentSupplier", "Supplier A");
  });

  it("records the authenticated CRM user as activity creator, not a request-supplied value", async () => {
    vi.mocked(customerRepository.findContactForCustomer).mockResolvedValue({ id: "contact-a" } as never);
    vi.mocked(customerRepository.createActivity).mockResolvedValue({ id: "activity-a" } as never);

    await customerService.createActivity("customer-a", "contact-a", "NOTE", "Follow up", "Call back", "sales-authenticated");

    expect(customerRepository.createActivity).toHaveBeenCalledWith(expect.objectContaining({ createdById: "sales-authenticated" }));
  });

  it("only permits pending customers to be approved and active customers to be suspended", async () => {
    vi.mocked(customerRepository.getSelf).mockResolvedValue({ id: "customer-a", status: "PENDING" } as never);
    vi.mocked(customerRepository.updateCustomerStatus).mockResolvedValue({ id: "customer-a", status: "ACTIVE" } as never);
    await customerService.approveCustomer("customer-a", "admin-a");
    expect(customerRepository.updateCustomerStatus).toHaveBeenCalledWith("customer-a", "ACTIVE");

    vi.mocked(customerRepository.getSelf).mockResolvedValue({ id: "customer-a", status: "PENDING" } as never);
    await expect(customerService.suspendCustomer("customer-a", "admin-a")).rejects.toMatchObject({ code: "CUSTOMER_STATUS_TRANSITION_INVALID" });
  });

  it("only reviews pending business profiles", async () => {
    vi.mocked(customerRepository.getBusinessForCustomer).mockResolvedValue({ customerId: "customer-a", status: "APPROVED" } as never);

    await expect(customerService.reviewBusiness("customer-a", "REJECTED", "admin-a")).rejects.toMatchObject({ code: "BUSINESS_STATUS_TRANSITION_INVALID" });
  });
});
