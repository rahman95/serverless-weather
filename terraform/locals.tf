locals {
  name          = "serverless_weather"
  author        = "Rahman Younus"
  email         = "rahman_95@live.co.uk"
  lambda_memory = 128

  tags = {
    Name      = "Serverless Weather Lambda POC"
    GitRepo   = "https://github.com/rahman95/serverless_weather"
    ManagedBy = "Terraform"
    Owner     = "${local.email}"
  }
}
