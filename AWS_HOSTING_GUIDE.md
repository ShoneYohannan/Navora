# 🚀 Complete AWS Hosting Guide for Navora

This guide details three production-grade AWS deployment options for **Navora** (React Frontend + FastAPI Backend).

---

## 🌟 Recommended Architecture Overview

```
                          ┌──────────────────────────┐
                          │   AWS CloudFront (CDN)   │  <-- Global HTTPS SSL
                          └─────────────┬────────────┘
                                        │
                       ┌────────────────┴────────────────┐
                       │                                 │
           ┌───────────▼───────────┐         ┌───────────▼───────────┐
           │   AWS S3 Bucket       │         │    AWS App Runner /   │
           │  (Static React Frontend)        │    EC2 Backend API    │
           └───────────────────────┘         └───────────────────────┘
```

---

## Option 1: AWS S3 + CloudFront (Frontend) & AWS App Runner (Backend)
> **Best For**: Scalability, high availability, zero server maintenance, and fast CDN delivery.

### Step 1: Deploy Backend to AWS App Runner
1. Push your repository to **GitHub**.
2. Log into **AWS Console** and search for **App Runner**.
3. Click **Create Service**:
   - **Source**: Select *Source code repository* (Connect to your GitHub).
   - **Repository**: Choose your Navora repo.
   - **Branch**: Select `main`.
   - **Deployment trigger**: Select *Automatic*.
4. **Build Settings**:
   - **Build tool**: Select *Dockerfile*.
   - **Context directory**: `/backend`
   - **Port**: `8000`
5. Click **Create & Deploy**.
   - AWS will output your live backend API URL (e.g. `https://xyz.awsapprunner.com`).

---

### Step 2: Deploy Frontend to AWS S3 & CloudFront
1. Open `frontend/src/services/api.js` (or `.env`) and update the API base URL to your live AWS App Runner URL:
   ```env
   VITE_API_BASE_URL=https://xyz.awsapprunner.com
   ```
2. Build your production frontend bundle locally:
   ```bash
   cd frontend
   npm run build
   ```
   *This outputs static files into `frontend/dist`.*

3. **Create S3 Bucket**:
   - Open AWS S3 Console -> **Create Bucket** (Name: `navora-travel-app`).
   - Uncheck *Block all public access* (or set up CloudFront OAC).
   - Under **Static website hosting**, enable it and set **Index document** to `index.html`.

4. **Upload Static Build**:
   - Drag & drop all files inside `frontend/dist` into your S3 bucket.

5. **Create CloudFront Distribution**:
   - Open AWS CloudFront Console -> **Create Distribution**.
   - Set **Origin Domain** to your S3 bucket website endpoint.
   - Under **Viewer Protocol Policy**, select *Redirect HTTP to HTTPS*.
   - Under **Error pages**, add a custom error response:
     - **HTTP Error Code**: `404`
     - **Response Page Path**: `/index.html`
     - **HTTP Response Code**: `200` *(Enables client-side React Router navigation)*.
6. Done! Your website is live with HTTPS SSL.

---

## Option 2: AWS EC2 (Single Server Setup)
> **Best For**: Full control over a single virtual machine (Ubuntu instance with Nginx + Docker).

### Step 1: Launch EC2 Instance
1. Open AWS EC2 Console -> **Launch Instance**.
2. Choose **Ubuntu 22.04 LTS**.
3. Select Instance Type: `t3.micro` or `t3.small` (Free tier eligible).
4. Under **Security Group**, open ports:
   - `22` (SSH)
   - `80` (HTTP)
   - `443` (HTTPS)
5. Launch and download your SSH Key Pair (`navora-key.pem`).

---

### Step 2: SSH into EC2 & Install Docker
Run on your computer terminal:
```bash
chmod 400 navora-key.pem
ssh -i "navora-key.pem" ubuntu@YOUR_EC2_PUBLIC_IP
```

Once inside EC2, run:
```bash
# Update packages & install Docker
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git

# Enable Docker service
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu
```

---

### Step 3: Clone & Launch App
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Navora.git
cd Navora

# Launch using Docker Compose
docker-compose up -d --build
```

---

### Step 4: Configure SSL with Let's Encrypt (Certbot)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option 3: AWS Amplify (Fastest 1-Click Setup)

1. Open **AWS Amplify Console**.
2. Click **New App** -> **Host web app**.
3. Connect your **GitHub** account and pick the `Navora` repository.
4. Set build settings:
   - App Root: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Save and Deploy**. AWS Amplify will automatically build and publish your web app on every git commit!

---

## 🛠️ Summary of Files Created for AWS Deployment

| File Path | Purpose |
| :--- | :--- |
| `docker-compose.yml` | Multi-container configuration for backend and frontend |
| `backend/Dockerfile` | Production container definition for FastAPI backend |
| `frontend/Dockerfile` | Multi-stage build container using Nginx for React frontend |
| `frontend/nginx.conf` | Nginx reverse proxy configuration for SPA client routing |
