# Universal URL Shortener & Universal Linking Platform

A scalable, privacy-compliant URL shortener and universal linking system with advanced analytics and seamless web-to-app transitions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Key Algorithms](#key-algorithms)
- [Project Structure](#project-structure)
- [Setting Up Project Locally](#setting-up-project-locally)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project provides a modern, robust platform for:
- Creating short, shareable URLs
- Supporting universal and deep links for iOS and Android apps
- Privacy-compliant, server-side analytics
- High scalability and sub-100ms redirection latency

---

## Features

- **Short URL Generation**: Custom and random codes, collision-free, path/parameter preservation
- **Universal Linking**: Seamless web-to-app routing for iOS (Universal Links) and Android (App Links)
- **Post-Install Redirection**: Smart IP-based mapping for deep linking after app install
- **Privacy-First Analytics**: Hashed PII, GDPR/CCPA compliant, campaign/source tracking
- **Auto-Expiring Links**: Optional TTL for temporary URLs
- **Horizontal Scalability**: Sharding, partitioning, and cache-first lookups

---

## Tech Stack

- **Frontend**: React / Next.js (web), Expo (mobile)
- **Backend**: Node.js + Express, Go (for high-performance microservices)
- **Database**: DynamoDB (NoSQL), PostgreSQL (SQL), Redis (cache)
- **Infrastructure**: Kubernetes, AWS/GCP/Azure, CDN (Cloudflare)
- **Security & Compliance**: HTTPS, Vault for secrets, Usercentrics Consent Management

---

## Database Schema

**Short URLs Table**
- `short_code` (PK): String
- `original_url`: String
- `user_id`: String
- `created_at`: Timestamp
- `expires_at`: Timestamp
- `metadata`: JSON
- `custom_alias`: String

**Analytics Table**
- `click_id` (PK): String
- `short_code`: String
- `timestamp`: Timestamp
- `hashed_ip`: String
- `user_agent`: String
- `referrer`: String
- `campaign_id`: String
- `redirected_to`: String

**App Link Metadata Table**
- `app_id` (PK): String
- `platform`: String
- `domain`: String
- `uri_template`: String
- `validation`: String

*See `/docs/architecture.md` for diagrams and details.*

---

## Key Algorithms

- **Short Code Generation**: Base62 encoding, cryptographically secure random generation, collision checks
- **Cache-First Redirection**: Redis lookup before DB query for sub-100ms latency
- **Privacy-Compliant Analytics**: SHA-256 hashed IPs with salt, server-side event logging
- **Post-Install Mapping**: Hashed IP to URL mapping with TTL and last-URL-wins logic

---

## Project Structure

*(Structure details omitted for now. Can be added here if needed.)*

---

## Setting Up Project Locally

To run the project on your local machine, follow the steps below:

### Prerequisites

Install the following tools:

1. **Node.js** (v18 or later):  
   [https://nodejs.org/en/download](https://nodejs.org/en/download)

    ```bash
     # Using Node Version Manager (Recommended)
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
     nvm install --lts

     #Verify
     node -v
     npm -v
     ```



2. **MongoDB Community Edition (6.0)**:

   - **macOS**:
     ```bash
     brew tap mongodb/brew
     brew install mongodb-community@6.0
     brew services start mongodb-community@6.0

     #Verify
     mongosh --eval 'db.runCommand({ connectionStatus: 1 })'
     ```

   - **Windows/Linux**:  
     Follow the official installation guide: [MongoDB Manual](https://www.mongodb.com/docs/manual/installation/)

3. **Redis**:

   - **macOS**:
     ```bash
     brew install redis
     brew services start redis
     ```

   - **Windows**:
     Use Redis for Windows from Microsoft Archive or WSL: [Redis Windows Guide](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis-on-windows/)

   - **Linux**:
     ```bash
     sudo apt update
     sudo apt install redis-server
     sudo systemctl enable redis
     sudo systemctl start redis
     ```

---

### Project Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Godssidekick1/Docquity.git
   cd Docquity
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:  
   Create a `.env` file in the root directory with the following values:

   ```env
   PORT=8080
   MONGO_URI=mongodb://localhost:27017/urlshortener
   REDIS_URL=redis://localhost:6379
   ```

---

### Running the App

Before starting the server, ensure MongoDB and Redis are running:

- **macOS**:
```bash
brew services start mongodb-community@6.0
brew services start redis
```
```bash
# macOS/Linux (if not using brew services)
mongod --config /usr/local/etc/mongod.conf
redis-server
```

- **Windows**:
Start MongoDB and Redis using their respective terminals or services:
```powershell
net start MongoDB
redis-server
```

Then start the development server:
```bash
node index.js
```

---

### Health Check

To confirm your server is running:
```bash
curl http://localhost:8080/health/healthcheck
```

---

### Initialization & Testing

#### Initialize the DB (if required):
```bash
npm run init
```

#### Fetch existing short URLs:
```bash
curl http://localhost:8080/shorten
```

---

###  Test Examples with `curl`

** Create a new short URL**:
```bash
curl -X POST http://localhost:8080/shorten \
  -H "Content-Type: application/json" \
  -d '{"short_code":"xyz123","original_url":"https://openai.com"}'
```

** Get all shortened URLs**:
```bash
curl http://localhost:8080/shorten
```

** Update a shortened URL**:
```bash
curl -X PUT http://localhost:8080/shorten/<id> \
  -H "Content-Type: application/json" \
  -d '{"original_url": "https://newsite.com"}'
```

** Delete a shortened URL**:
```bash
curl -X DELETE http://localhost:8080/shorten/<id>
```

** Redirect using short code**:
```bash
curl -i http://localhost:8080/xyz123
```

---


