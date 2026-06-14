# Sentinel AI AWS EC2 Deployment Guide

This guide details the deployment of the integrated Sentinel AI stack onto an AWS EC2 instance.

## Architecture

The stack is deployed in a single EC2 instance inside a secure VPC, managed via Docker Compose:
- **FastAPI Backend**: Port `8000` (internal and external access)
- **React Frontend**: Port `3000`
- **OWASP ZAP Scanner**: Port `8080` (internal loopback only)
- **Nginx Target Site**: Port `8081`

```
  Internet ──> [Security Group / ALB]
                     │
         ┌───────────┴───────────┐
         │        AWS EC2        │
         │  ┌─────────────────┐  │
         │  │    Frontend     │  │
         │  │   (Port 3000)   │  │
         │  └─────────────────┘  │
         │  ┌─────────────────┐  │
         │  │     Backend     │  │
         │  │   (Port 8000)   │  │
         │  └─────────────────┘  │
         │  ┌─────────────────┐  │
         │  │  Sample Target  │  │
         │  │   (Port 8081)   │  │
         │  └─────────────────┘  │
         └───────────────────────┘
```

## Security Group Configuration

Configure your EC2 Security Group with the following inbound rules:

| Protocol | Port Range | Source | Purpose |
| --- | --- | --- | --- |
| TCP | 22 | Your IP / Bastion | SSH management |
| TCP | 3000 | 0.0.0.0/0 (or ALB) | React UI Dashboard |
| TCP | 8000 | 0.0.0.0/0 (or internal) | Backend REST API endpoints |
| TCP | 8081 | 0.0.0.0/0 | Nginx vulnerable sample target |

*Note: Port 8080 (ZAP) must NOT be exposed to the public internet.*

## Deployment Steps

1. **Launch EC2 Instance**:
   - Ubuntu Server 22.04 LTS (t3.medium recommended to run scanners and python concurrently).
   - Configure VPC, Subnet, and Security Group as shown above.

2. **Connect via SSH**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Deploy the Stack**:
   - Copy or clone the repository to `/home/ubuntu/sential-ai`.
   - Run the deployment setup helper:
     ```bash
     cd /home/ubuntu/sential-ai
     chmod +x deployment/deploy_ec2.sh
     ./deployment/deploy_ec2.sh
     ```

4. **Verify Container Execution**:
   ```bash
   docker compose ps
   ```
