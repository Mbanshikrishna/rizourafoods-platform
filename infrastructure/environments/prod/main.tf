terraform {
  required_version = ">= 1.8.0, < 2.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0.0, < 6.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.6.0, < 4.0.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_availability_zones" "available" {}
data "aws_caller_identity" "current" {}

locals {
  environment     = "prod"
  project         = "rizourafoods"
  name_prefix     = "${local.project}-${local.environment}"
  api_domain_name = "${var.api_subdomain}.${var.root_domain_name}"
  frontend_bucket = "${local.project}-${local.environment}-frontend-${data.aws_caller_identity.current.account_id}"
  api_image       = "${aws_ecr_repository.api.repository_url}:${var.api_image_tag}"
  log_group_name  = "/aws/rizourafoods/${local.environment}/api"
  common_tags = {
    Project     = local.project
    Environment = local.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_ecr_repository" "api" {
  name                 = "${local.project}/${local.environment}/backend"
  image_tag_mutability = "IMMUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.common_tags
}

resource "random_password" "db_password" {
  length  = 32
  special = false
}

resource "random_password" "jwt_access" {
  length  = 48
  special = false
}

resource "random_password" "jwt_refresh" {
  length  = 48
  special = false
}

module "vpc" {
  source = "../../modules/vpc"

  name_prefix         = local.name_prefix
  cidr_block          = var.vpc_cidr
  availability_zones  = slice(data.aws_availability_zones.available.names, 0, 2)
  public_subnet_cidrs = var.public_subnet_cidrs
  app_subnet_cidrs    = var.app_subnet_cidrs
  db_subnet_cidrs     = var.db_subnet_cidrs
  tags                = local.common_tags
}

module "alb" {
  source = "../../modules/alb"

  name_prefix       = local.name_prefix
  vpc_id            = module.vpc.vpc_id
  public_subnet_ids = module.vpc.public_subnet_ids
  certificate_arn   = var.api_certificate_arn
  tags              = local.common_tags
}

module "s3" {
  source = "../../modules/s3"

  bucket_name = local.frontend_bucket
  tags        = local.common_tags
}

module "cloudfront" {
  source = "../../modules/cloudfront"

  bucket_id                   = module.s3.bucket_id
  bucket_arn                  = module.s3.bucket_arn
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  aliases                     = [var.root_domain_name, "www.${var.root_domain_name}"]
  acm_certificate_arn         = var.frontend_certificate_arn
  tags                        = local.common_tags
}

module "iam" {
  source = "../../modules/iam"

  name_prefix        = local.name_prefix
  ecr_repository_arn = aws_ecr_repository.api.arn
  log_group_name     = local.log_group_name
  region             = var.aws_region
  account_id         = data.aws_caller_identity.current.account_id
  secrets_arns       = [aws_secretsmanager_secret.app_config.arn]
  ses_identity_arns  = ["*"]
  tags               = local.common_tags
}

module "ec2" {
  source = "../../modules/ec2"

  name_prefix               = local.name_prefix
  environment               = local.environment
  vpc_id                    = module.vpc.vpc_id
  app_subnet_ids            = module.vpc.app_subnet_ids
  alb_security_group_id     = module.alb.security_group_id
  target_group_arn          = module.alb.target_group_arn
  instance_profile_name     = module.iam.instance_profile_name
  instance_type             = var.instance_type
  key_name                  = var.key_name
  api_image                 = local.api_image
  ecr_registry              = aws_ecr_repository.api.repository_url
  app_config_secret_arn     = aws_secretsmanager_secret.app_config.arn
  aws_region                = var.aws_region
  cloudwatch_log_group_name = local.log_group_name
  desired_capacity          = var.asg_desired_capacity
  min_size                  = var.asg_min_size
  max_size                  = var.asg_max_size
  root_volume_size          = 50
  tags                      = local.common_tags

  depends_on = [module.monitoring]
}

module "rds" {
  source = "../../modules/rds"

  name_prefix                = local.name_prefix
  vpc_id                     = module.vpc.vpc_id
  db_subnet_ids              = module.vpc.db_subnet_ids
  allowed_security_group_ids = [module.ec2.app_security_group_id]
  db_name                    = var.db_name
  username                   = var.db_username
  password                   = random_password.db_password.result
  instance_class             = var.db_instance_class
  multi_az                   = true
  tags                       = local.common_tags
}

resource "aws_secretsmanager_secret" "app_config" {
  name = "${local.project}/${local.environment}/app-config"
  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "app_config" {
  secret_id = aws_secretsmanager_secret.app_config.id
  secret_string = jsonencode({
    NODE_ENV                = "production"
    PORT                    = "3000"
    API_PREFIX              = "/api/v1"
    APP_NAME                = "Rizoura Foods API"
    LOG_LEVEL               = "info"
    FRONTEND_ORIGIN         = "https://${var.root_domain_name}"
    DATABASE_URL            = "postgresql://${var.db_username}:${random_password.db_password.result}@${module.rds.address}:${module.rds.port}/${module.rds.db_name}"
    JWT_ACCESS_SECRET       = random_password.jwt_access.result
    JWT_REFRESH_SECRET      = random_password.jwt_refresh.result
    JWT_ACCESS_TTL          = "15m"
    JWT_REFRESH_TTL         = "7d"
    JWT_REFRESH_COOKIE_NAME = "rizoura_refresh_token"
    BCRYPT_SALT_ROUNDS      = "12"
    DEFAULT_ADMIN_NAME      = var.default_admin_name
    DEFAULT_ADMIN_EMAIL     = var.default_admin_email
    DEFAULT_ADMIN_PASSWORD  = var.default_admin_password
    AWS_REGION              = var.aws_region
    SES_FROM_EMAIL          = var.ses_from_email
  })
}

module "monitoring" {
  source = "../../modules/monitoring"

  name_prefix    = local.name_prefix
  log_group_name = local.log_group_name
  tags           = local.common_tags
}

module "route53" {
  source = "../../modules/route53"

  zone_name              = var.zone_name
  root_domain_name       = var.root_domain_name
  cloudfront_domain_name = module.cloudfront.distribution_domain_name
  cloudfront_zone_id     = module.cloudfront.distribution_hosted_zone_id
  api_record_name        = local.api_domain_name
  alb_dns_name           = module.alb.dns_name
  alb_zone_id            = module.alb.zone_id
}

resource "aws_cloudwatch_dashboard" "observability" {
  dashboard_name = "${local.name_prefix}-observability"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "ALB Response Time"
          region = var.aws_region
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", module.alb.arn_suffix, "TargetGroup", module.alb.target_group_arn_suffix]
          ]
          stat   = "Average"
          period = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "ALB 5XX Errors"
          region = var.aws_region
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", module.alb.arn_suffix]
          ]
          stat   = "Sum"
          period = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "Auto Scaling Group Instances"
          region = var.aws_region
          metrics = [
            ["AWS/AutoScaling", "GroupInServiceInstances", "AutoScalingGroupName", module.ec2.autoscaling_group_name]
          ]
          stat   = "Average"
          period = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title  = "RDS CPU Utilization"
          region = var.aws_region
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", module.rds.instance_id]
          ]
          stat   = "Average"
          period = 300
        }
      }
    ]
  })
}

output "frontend_bucket_name" {
  value = module.s3.bucket_id
}

output "api_url" {
  value = "https://${local.api_domain_name}"
}

output "ecr_repository_url" {
  value = aws_ecr_repository.api.repository_url
}
