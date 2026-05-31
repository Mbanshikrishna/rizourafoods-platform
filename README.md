# Rizoura Foods

Rizoura Foods is a premium FMCG rice brand platform with a polished frontend, a production-ready TypeScript backend, and Terraform-managed AWS infrastructure for growth into export workflows, distributor operations, and e-commerce.

## Repository Layout

```text
frontend/        React + Vite + Tailwind marketing experience
backend/         Express + TypeScript + Prisma API
infrastructure/  Terraform environments and reusable AWS modules
docs/            Project notes and deployment guidance
```

## Backend Capabilities

- JWT authentication with refresh token rotation
- Role-based admin access
- Product catalog CRUD with pagination, search, and filters
- Blog CRUD with SEO slug support
- Inquiry intake, listing, and CSV export
- `/health`, `/ready`, and Swagger UI at `/docs`
- Pino JSON logging with request IDs
- Prisma ORM targeting PostgreSQL

## Infrastructure Capabilities

- VPC with public, app, and database subnet tiers
- ALB + Auto Scaling Group + EC2 for the API
- Private RDS PostgreSQL
- S3 + CloudFront for the frontend
- Route53 for root and API DNS
- CloudWatch log group and dashboard scaffolding
- Secrets Manager-ready EC2 runtime bootstrapping
- ECR-backed API deployments

## Local Development

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Docker Compose

```powershell
cd backend
docker compose up --build
```

## Deployment

- Backend CI/CD workflow: [.github/workflows/backend.yml](C:\Users\mbans\Documents\Rizourafoods\.github\workflows\backend.yml)
- Infrastructure workflow: [.github/workflows/infrastructure.yml](C:\Users\mbans\Documents\Rizourafoods\.github\workflows\infrastructure.yml)
- Production guide: [production-deployment-guide.md](C:\Users\mbans\Documents\Rizourafoods\docs\production-deployment-guide.md)

## Notes

- The backend seeds a default admin on startup using environment or secret values.
- Terraform environments expect remote state in S3 with DynamoDB locking.
- CloudFront requires an ACM certificate in `us-east-1`, while the ALB certificate must exist in the workload region.
