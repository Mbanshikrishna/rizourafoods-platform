# B2B platform architecture

## Customer lifecycle

1. A business registers at `POST /customer-auth/register`.
2. The `Customer` and `BusinessProfile` are created with `PENDING` status.
3. The customer can authenticate and submit requests, but does not receive B2B price tiers until an authorized internal workflow marks the customer `ACTIVE`.
4. Suspended and rejected customers cannot authenticate.

Customer refresh tokens are hashed in the database, rotated on refresh, and sent only in an HttpOnly cookie. Access tokens are short-lived bearer tokens held in memory/session storage; the frontend refreshes once on a 401 and then clears the session if refresh fails.

## Commercial lifecycle

- A quote has submitted and reviewed states. Quote lines store requested quantity, unit and pack preference.
- A sample request is separate from a quote and starts as `REQUESTED`.
- An order is only created from an accepted quote whose lines have server-side quoted prices. Totals are calculated in a database transaction; browser-submitted prices and totals are never accepted.
- A reorder creates a new quote request. It never changes the original order.

## Database access

PostgreSQL has no public Docker port. Docker API traffic uses the private service network. Native development tooling may use only `127.0.0.1:5432`.
