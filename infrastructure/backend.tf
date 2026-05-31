# Configure remote state for each environment with:
# terraform init ^
#   -backend-config="bucket=rizourafoods-terraform-state" ^
#   -backend-config="key=dev/terraform.tfstate" ^
#   -backend-config="region=ap-south-1" ^
#   -backend-config="dynamodb_table=rizourafoods-terraform-locks"
#
# HashiCorp recommends S3-backed remote state with locking configured separately.
# See: https://developer.hashicorp.com/terraform/language/backend/s3

terraform {
  backend "s3" {}
}
