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
- [Getting Started](#getting-started)
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

