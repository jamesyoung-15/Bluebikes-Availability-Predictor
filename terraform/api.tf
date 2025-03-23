# sg for ssh and http
resource "aws_security_group" "ec2_sg" {
  name_prefix = "bluebikes-predictor-sg-"
  description = "Allow ssh, flask api, and http traffic"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ssh key
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# save key
resource "local_file" "ssh_pub_key" {
  content  = tls_private_key.ssh_key.public_key_openssh
  filename = "id_rsa.pub"
}

# ec2 key pair
resource "aws_key_pair" "ec2_key_pair" {
  key_name   = "ec2_ssh_key"
  public_key = tls_private_key.ssh_key.public_key_openssh
}

# ec2 instance
resource "aws_instance" "ec2_instance" {
  ami             = "ami-08b5b3a93ed654d19"
  instance_type   = "t2.micro"
  key_name        = aws_key_pair.ec2_key_pair.key_name
  security_groups = [aws_security_group.ec2_sg.name]
  tags = {
    Name = "bluebikespredictor"
  }
  user_data = <<-EOF
            #!/bin/bash
            sudo yum update -y
            sudo yum install git docker nginx -y
            sudo service docker start
            sudo usermod -a -G docker ec2-user
            sudo service nginx start

            sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
            
            cd /home/ec2-user/
            git clone https://github.com/jamesyoung-15/Bluebikes-Availability-Predictor/
            cd Bluebikes-Availability-Predictor


            sudo mkdir -p /etc/nginx/sites-available/
            sudo mkdir -p /etc/nginx/sites-enabled/
            sudo cp ./api/nginx/nginx.conf /etc/nginx/sites-available/apibluebikespredictor.jyylab.com
            sudo ln -s /etc/nginx/sites-available/apibluebikespredictor.jyylab.com /etc/nginx/sites-enabled/
            sudo sed -i '/http {/a \    include /etc/nginx/sites-enabled/*;' /etc/nginx/nginx.conf
            sudo service nginx restart

            sudo docker-compose up -d
            EOF
}

# point domain to ec2 instance
resource "cloudflare_record" "api_domain" {
  zone_id = data.cloudflare_zones.domain.zones.0.id
  name    = var.api_subdomain
  #   content   = aws_instance.ec2_instance.public_ip
  value   = aws_instance.ec2_instance.public_ip
  type    = "A"
  ttl     = 1
  comment = "DNS record for bluebikes predictor api domain"
  proxied = true
}