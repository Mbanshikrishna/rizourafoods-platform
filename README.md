# Rizoura Foods

Rizoura Foods is a premium FMCG rice brand platform with a polished frontend and a production-ready TypeScript backend for growth into export workflows, distributor operations, and e-commerce.

## Repository Layout

```text
frontend/  React + Vite + Tailwind marketing experience
backend/   Express + TypeScript + Prisma API
docs/      Project notes
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

## Local Development

### Frontend

```sh
cd frontend
npm install
npm run dev
```

The backend development seed creates a small, clearly marked development catalogue without prices, inventory, certification or quality claims. Run `npm run prisma:seed` after migrating when catalogue records are needed locally.

### B2B platform

Customer accounts begin in `PENDING` status and require manual business approval before customer-tier pricing can be served. Quotes and sample requests support authenticated customers and guest contacts; orders can only be created from accepted, server-priced quotes. See [B2B architecture](docs/b2b-architecture.md).

For Docker deployments PostgreSQL is not publicly exposed. The compose definition binds it only to loopback for local tooling; the API container connects over the internal `db` service network.

### Backend

```sh
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Docker Compose

```sh
cd backend
docker compose up --build
```

## CI

The `quality` job in [.github/workflows/backend.yml](.github/workflows/backend.yml) runs lint, test, and build on every PR and push to `main`.

---

## AWS Deployment (Manual)

Minimal setup for testing and early-stage traffic. Estimated cost: **~$0/month** (free tier) or **~$8/month** after.

### AWS Resources

| Resource | Spec | Purpose | Cost |
|---|---|---|---|
| EC2 | `t3.micro`, 20 GB EBS, Amazon Linux 2023 | Backend API + PostgreSQL (Docker) | Free tier / ~$7.50 |
| Elastic IP | 1 static IP | Fixed address for the server | Free while attached |
| S3 bucket | Standard | Frontend static files | ~$0.02 |
| Security Group | Ports 22, 80, 3000 | Network access control | Free |

### Prerequisites

- AWS account with CLI configured (`aws configure`)
- A key pair in `ap-south-1` (Mumbai)
- Node.js 22+ installed locally (to build the frontend)

---

### 1. Create key pair

```sh
aws ec2 create-key-pair \
  --key-name rizoura-key \
  --query 'KeyMaterial' \
  --output text \
  --region ap-south-1 > rizoura-key.pem

chmod 400 rizoura-key.pem
```

### 2. Create security group

```sh
SG_ID=$(aws ec2 create-security-group \
  --group-name rizoura-sg \
  --description "Rizoura Foods server" \
  --region ap-south-1 \
  --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22   --cidr 0.0.0.0/0 --region ap-south-1
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80   --cidr 0.0.0.0/0 --region ap-south-1
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 3000 --cidr 0.0.0.0/0 --region ap-south-1
```

### 3. Launch EC2 instance

```sh
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0f58b397bc5c1f2e8 \
  --instance-type t3.micro \
  --key-name rizoura-key \
  --security-group-ids $SG_ID \
  --region ap-south-1 \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":20}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=rizoura-server}]' \
  --query 'Instances[0].InstanceId' --output text)

echo "Instance: $INSTANCE_ID"
```

### 4. Attach Elastic IP

```sh
ALLOC_ID=$(aws ec2 allocate-address --domain vpc --region ap-south-1 --query 'AllocationId' --output text)

# Wait for instance to be running
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region ap-south-1

aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOC_ID --region ap-south-1

EIP=$(aws ec2 describe-addresses --allocation-ids $ALLOC_ID --region ap-south-1 --query 'Addresses[0].PublicIp' --output text)
echo "Server IP: $EIP"
```

### 5. Set up the server

```sh
ssh -i rizoura-key.pem ec2-user@$EIP
```

Run on the server:

```sh
# Install Docker
sudo dnf update -y
sudo dnf install -y docker git
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for docker group
exit
```

### 6. Deploy the backend

SSH back in:

```sh
ssh -i rizoura-key.pem ec2-user@$EIP

git clone https://github.com/Mbanshikrishna/rizourafoods-platform.git
cd rizourafoods-platform/backend
```

Create the `.env` file (replace secrets with your own values):

```sh
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1
APP_NAME=Rizoura Foods API
LOG_LEVEL=info
FRONTEND_ORIGIN=https://your-frontend-domain.example
DATABASE_URL=postgresql://rizoura:CHANGE_THIS_DB_PASSWORD@db:5432/rizourafoods
JWT_ACCESS_SECRET=CHANGE_THIS_TO_RANDOM_48_CHARS_access
JWT_REFRESH_SECRET=CHANGE_THIS_TO_RANDOM_48_CHARS_refresh
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
JWT_REFRESH_COOKIE_NAME=rizoura_refresh_token
CUSTOMER_REFRESH_COOKIE_NAME=rizoura_customer_refresh_token
BCRYPT_SALT_ROUNDS=12
DEFAULT_ADMIN_NAME=Rizoura Admin
DEFAULT_ADMIN_EMAIL=admin@rizourafoods.com
DEFAULT_ADMIN_PASSWORD=CHANGE_THIS_Admin@2025x
AWS_REGION=ap-south-1
SES_FROM_EMAIL=no-reply@rizourafoods.com
POSTGRES_DB=rizourafoods
POSTGRES_USER=rizoura
POSTGRES_PASSWORD=CHANGE_THIS_DB_PASSWORD
EOF
```

Start the services:

```sh
docker compose up -d --build
```

Wait ~60 seconds for the first build, then verify:

```sh
curl http://localhost:3000/health
# {"status":"ok","uptime":...,"timestamp":"..."}
```

### 7. Deploy the frontend to S3

On your local machine:

```sh
# Create bucket
aws s3 mb s3://rizourafoods-frontend --region ap-south-1

# Build frontend with your EC2 IP
cd frontend
VITE_API_URL=https://api.your-domain.example/api/v1 npm run build

# Upload
aws s3 sync dist/ s3://rizourafoods-frontend --delete

# Enable static website hosting
aws s3 website s3://rizourafoods-frontend \
  --index-document index.html \
  --error-document index.html

# Allow public access
aws s3api put-public-access-block \
  --bucket rizourafoods-frontend \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-policy --bucket rizourafoods-frontend --policy '{
  "Version":"2012-10-17",
  "Statement":[{
    "Effect":"Allow",
    "Principal":"*",
    "Action":"s3:GetObject",
    "Resource":"arn:aws:s3:::rizourafoods-frontend/*"
  }]
}'
```

### 8. Verify

| Endpoint | URL |
|---|---|
| Frontend | `http://rizourafoods-frontend.s3-website.ap-south-1.amazonaws.com` |
| API health | `http://<YOUR_EIP>:3000/health` |
| API docs | `http://<YOUR_EIP>:3000/docs` |
| API base | `http://<YOUR_EIP>:3000/api/v1` |

---

### Updating the backend

```sh
ssh -i rizoura-key.pem ec2-user@$EIP
cd rizourafoods-platform
git pull
cd backend
docker compose up -d --build
```

### Updating the frontend

```sh
cd frontend
VITE_API_URL=http://<YOUR_EIP>:3000/api/v1 npm run build
aws s3 sync dist/ s3://rizourafoods-frontend --delete
```

---

### Scaling up (when needed)

| Trigger | Action |
|---|---|
| Need HTTPS on API | Add Caddy reverse proxy on EC2 with free Let's Encrypt cert |
| Need managed database | Replace Docker PostgreSQL with RDS `db.t4g.micro` (+~$12/mo) |
| Need load balancing | Add ALB + Auto Scaling Group (+~$16/mo) |
| Need custom domain | Add Route53 hosted zone (+$0.50/mo) |
| Need CDN for frontend | Add CloudFront distribution (free tier: 1 TB/mo) |

### Cleanup

```sh
# Terminate EC2
aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region ap-south-1

# Release Elastic IP
aws ec2 release-address --allocation-id $ALLOC_ID --region ap-south-1

# Delete S3 bucket
aws s3 rb s3://rizourafoods-frontend --force --region ap-south-1

# Delete security group (wait for instance to terminate first)
aws ec2 delete-security-group --group-id $SG_ID --region ap-south-1
```

---

## Notes

- The backend seeds a default admin on startup using the `DEFAULT_ADMIN_*` environment variables.
- Replace all `CHANGE_THIS_*` values in `.env` before deploying. Use `openssl rand -hex 24` to generate secrets.
- The `.env` file contains sensitive credentials — never commit it to the repository.
