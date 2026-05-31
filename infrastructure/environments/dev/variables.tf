variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "zone_name" {
  type = string
}

variable "root_domain_name" {
  type = string
}

variable "api_subdomain" {
  type    = string
  default = "api"
}

variable "api_certificate_arn" {
  type = string
}

variable "frontend_certificate_arn" {
  type = string
}

variable "key_name" {
  type    = string
  default = null
}

variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "app_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "db_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.21.0/24", "10.0.22.0/24"]
}

variable "instance_type" {
  type    = string
  default = "t3.small"
}

variable "asg_min_size" {
  type    = number
  default = 1
}

variable "asg_desired_capacity" {
  type    = number
  default = 1
}

variable "asg_max_size" {
  type    = number
  default = 2
}

variable "db_name" {
  type    = string
  default = "rizourafoods"
}

variable "db_username" {
  type    = string
  default = "rizoura"
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "api_image_tag" {
  type    = string
  default = "latest"
}

variable "default_admin_name" {
  type    = string
  default = "Rizoura Admin"
}

variable "default_admin_email" {
  type = string
}

variable "default_admin_password" {
  type      = string
  sensitive = true
}

variable "ses_from_email" {
  type = string
}
