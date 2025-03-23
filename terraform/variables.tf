variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
}

variable "aws_region" {
  description = "AWS Region"
  default     = "us-east-1"
}

variable "aws_profile" {
  description = "AWS Profile"
  default     = "default"
}

variable "site_domain" {
  description = "Site Domain"
  default     = "jyylab.com"
}

variable "site_subdomain" {
  description = "Site Subdomain"
  default     = "bluebikespredictor"
}

variable "api_subdomain" {
  description = "API Subdomain"
  default     = "apibluebikespredictor"
}

variable "api_domain" {
  description = "API Domain"
  default     = "jyylab.com"
}