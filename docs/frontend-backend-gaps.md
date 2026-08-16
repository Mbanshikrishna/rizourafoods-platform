# Frontend–backend gaps

The frontend uses the existing published product, inquiry and team-authentication APIs. The following capabilities are required before the platform can provide a customer procurement account rather than an enquiry-led workflow.

| Priority | Feature | Required endpoint | Method | Request / response | Auth | Current backend status | Frontend status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Product detail by slug | `/products/slug/:slug` | GET | Published product with pack sizes, MOQ, origin, ingredients, specifications, quality attributes, images and availability | No | Missing; current API uses internal ID and has basic fields only | Uses ID route; hides unavailable fields |
| P0 | Product commercial data | `/products/:id` | GET | `packSizes`, `moq`, `unit`, `badges`, `availability`, optional quality/report links | No | Missing from schema/API | UI identifies these as quote-confirmed |
| P0 | Business registration | `/customers/register` | POST | Business profile fields; customer ID and pending/active state | No | Missing; `AdminUser` is not a customer model | Registration-interest form creates a real GENERAL inquiry |
| P0 | Customer authentication | `/customer-auth/register`, `/customer-auth/login`, `/customer-auth/refresh` | POST | Customer session and role | No | Missing; existing `/auth/*` only authenticates `AdminUser` | Team login only; customer login is explicitly unavailable |
| P0 | Commercial quote request | `/quotes` | POST | Customer/contact, line items, quantities, pack sizes, delivery location, notes; quote ID/status | Optional | Missing | Cart submits a real BULK_ORDER inquiry with the line items in its message |
| P0 | Sample request | `/samples` | POST | Contact, products, quantity, volume, intended use, delivery location; sample ID/status | Optional | Missing | Sample form submits a real GENERAL inquiry |
| P1 | B2B pricing | `/products/:id/prices` | GET | Customer-tier and quantity tiers, currency, validity | Customer | Missing | No prices are fabricated or displayed |
| P1 | Customer account | `/me`, `/me/business`, `/me/addresses` | GET/PATCH | Customer profile, business, addresses | Customer | Missing | Account page states the limitation |
| P1 | Orders and reorder | `/orders`, `/orders/:id`, `/orders/:id/reorder` | GET/POST | Order items, totals, fulfilment status, invoice links | Customer | Missing | Not exposed as functional UI |
| P1 | Quote and sample tracking | `/quotes`, `/samples` | GET | Real statuses and records | Customer | Missing | Not exposed as functional UI |

## Recommended data-model additions

Add `Customer`, `BusinessProfile`, `Address`, `Quote`, `QuoteLine`, `Order`, `OrderLine`, `SampleRequest`, and an expanded `Product` model. Keep B2B prices and quality metrics optional and dated; never use a frontend fallback value for measured, regulated or contractual data.

## Integration note

The current public inquiry API accepts only name, email, optional company/country/phone, inquiry type and a message. The frontend serializes additional business requirement fields into the message until a structured endpoint is available.
