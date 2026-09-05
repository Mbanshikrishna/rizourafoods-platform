# B2B API contracts

All paths below are prefixed with `/api/v1`. Administrative `/auth` endpoints remain separate from customer endpoints.

| Endpoint | Purpose | Access |
| --- | --- | --- |
| `POST /customer-auth/register` | Create pending customer and business profile | Public |
| `POST /customer-auth/login`, `/refresh`, `/logout` | Customer session lifecycle | Public / cookie |
| `GET/PATCH /me`, `GET/PATCH /me/business` | Customer and business profile | Customer |
| `GET/POST /me/addresses`, `PATCH/DELETE /me/addresses/:id` | Customer-owned addresses | Customer |
| `GET /products/slug/:slug` | Published public product | Public |
| `GET /products/:id/prices` | Current tier prices; B2B tier only for active customer | Public/customer |
| `POST /quotes`, `GET /quotes`, `GET /quotes/:id` | Guest/customer quote flow | Public/customer |
| `POST /samples`, `GET /samples`, `GET /samples/:id` | Guest/customer sample flow | Public/customer |
| `POST /orders`, `GET /orders`, `GET /orders/:id`, `POST /orders/:id/reorder` | Server-priced orders and reorders | Customer |
| `POST /distributors/apply`, `POST /export-inquiries` | Structured partner leads | Public |

Quote and sample line quantities must be positive and use one of `kg`, `g`, `bags`, `boxes`, `cartons`, or `units`. Order totals are calculated from accepted quoted prices on the server; clients never submit prices or totals.
