variable "name_prefix" {
  type = string
}

variable "log_group_name" {
  type = string
}

variable "log_retention_days" {
  type    = number
  default = 30
}

variable "tags" {
  type    = map(string)
  default = {}
}

resource "aws_cloudwatch_log_group" "api" {
  name              = var.log_group_name
  retention_in_days = var.log_retention_days

  tags = merge(var.tags, {
    Name = "${var.name_prefix}-api-logs"
  })
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.api.name
}

output "log_group_arn" {
  value = aws_cloudwatch_log_group.api.arn
}
