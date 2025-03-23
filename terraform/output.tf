output "ec2_public_ip" {
  value = aws_instance.ec2_instance.public_ip
}

output "api_url" {
  value = "https://${var.api_subdomain}.${var.api_domain}"
}

output "website_url" {
  value = "https://${var.site_subdomain}.${var.site_domain}"
}