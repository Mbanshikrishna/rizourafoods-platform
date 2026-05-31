# Rizoura Foods Production Deployment Guide

## 1. Bootstrap Shared Terraform State

Create these shared resources once before deploying any environment:

- S3 bucket for Terraform state
- DynamoDB table for state locking
- IAM role assumed by GitHub Actions

Suggested names:

- `rizourafoods-terraform-state`
- `rizourafoods-terraform-locks`

Enable S3 versioning on the state bucket as recommended by HashiCorp.

## 2. Provision Certificates

- Provision or import an ACM certificate in `ap-south-1` for `api.rizourafoods.com`
- Provision or import an ACM certificate in `us-east-1` for `rizourafoods.com` and `www.rizourafoods.com`

## 3. Prepare Terraform Variables

For each environment:

1. Copy `terraform.tfvars.example` to `terraform.tfvars`
2. Set domain values, certificate ARNs, SSH key pair name, admin email, admin password, and SES sender
3. Keep `terraform.tfvars` out of source control

## 4. Deploy Infrastructure

Example for `dev`:

```powershell
cd C:\Users\mbans\Documents\Rizourafoods\infrastructure\environments\dev
terraform init `
  -backend-config="bucket=rizourafoods-terraform-state" `
  -backend-config="key=dev/terraform.tfstate" `
  -backend-config="region=ap-south-1" `
  -backend-config="dynamodb_table=rizourafoods-terraform-locks"
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

## 5. Build and Push the API Image

The backend workflow builds the API image and pushes it to ECR. Manual deployments use the workflow input to choose `dev`, `stage`, or `prod`.

GitHub secrets to configure:

- `AWS_REGION`
- `AWS_ACCOUNT_ID`
- `AWS_GITHUB_ROLE_ARN`
- `TF_STATE_BUCKET`
- `TF_LOCK_TABLE`

## 6. Runtime Configuration

Terraform stores the runtime application configuration in Secrets Manager as:

- `rizourafoods/dev/app-config`
- `rizourafoods/stage/app-config`
- `rizourafoods/prod/app-config`

EC2 bootstrap logic fetches this secret and writes `/opt/rizourafoods/.env` before starting the Docker container.

## 7. Frontend Deployment

Sync the frontend build output to the environment S3 bucket, then invalidate the CloudFront distribution:

```powershell
cd C:\Users\mbans\Documents\Rizourafoods\frontend
npm install
npm run build
aws s3 sync dist s3://<frontend-bucket-name> --delete
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

## 8. Post-Deployment Checklist

- Confirm `https://api.rizourafoods.com/health` returns `200`
- Confirm `https://api.rizourafoods.com/ready` returns `200`
- Log into `/docs` and verify protected endpoints with a seeded admin user
- Confirm CloudWatch logs are flowing from the EC2 instances
- Verify Route53 aliases resolve correctly
- Verify RDS is private-only and not publicly accessible
