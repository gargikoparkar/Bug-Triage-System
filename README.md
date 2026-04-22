# 🐛 AI Bug Triage System

A REST API that accepts bug reports and uses **Claude Sonnet (Gen AI)** to automatically classify severity, identify root cause, suggest fixes, and generate test cases. Built with **Node.js + Express**, **Prisma ORM**, **Supabase (PostgreSQL)**, deployed on **AWS EC2**.

---

## Tech Stack
- **Runtime:** Node.js + Express.js
- **AI:** Anthropic Claude Sonnet API
- **ORM:** Prisma
- **Database:** Supabase (PostgreSQL)
- **Deployment:** AWS EC2 (t2.micro - Free Tier)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/api/bugs` | Submit a bug → triggers AI triage |
| GET | `/api/bugs` | Fetch all bugs with triage results |
| GET | `/api/bugs/:id` | Fetch a single bug by ID |

### POST /api/bugs — Request Body
```json
{
  "title": "Login button not working on Safari",
  "description": "When users click the login button on Safari 16, nothing happens. No error in console. Works fine on Chrome and Firefox.",
  "submittedBy": "gargi@example.com"
}
```

### Sample Response
```json
{
  "message": "Bug submitted and triaged successfully",
  "bug": {
    "id": "uuid-here",
    "title": "Login button not working on Safari",
    "severity": "HIGH",
    "category": "UI",
    "rootCause": "Likely a browser compatibility issue with an event listener or CSS property not supported in Safari 16.",
    "suggestedFix": "Check for Safari-specific CSS or JS issues. Test with webkit prefixes and verify event listeners are attached correctly.",
    "testCases": [
      "Verify login button click triggers form submission on Safari 16",
      "Test login flow on Safari 15, 16, and 17",
      "Check browser console for silent errors on Safari during login"
    ],
    "triaged": true,
    "createdAt": "2025-04-22T10:00:00.000Z"
  }
}
```

---

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/yourusername/bug-triage-api
cd bug-triage-api
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Fill in your `.env`:
```
PORT=3000
DATABASE_URL=postgresql://your-supabase-url
ANTHROPIC_API_KEY=your-key-here
```

### 3. Set up Supabase
- Go to [supabase.com](https://supabase.com) → New Project
- Copy the **Connection String** (URI format) into `DATABASE_URL`

### 4. Push DB schema
```bash
npm run db:generate
npm run db:push
```

### 5. Run locally
```bash
npm run dev
```

---

## AWS EC2 Deployment (Free Tier)

### 1. Launch EC2 instance
- Go to AWS Console → EC2 → Launch Instance
- Choose **Amazon Linux 2023**
- Instance type: **t2.micro** (free tier)
- Create or select a key pair (.pem file)
- Security Group: allow **SSH (22)** and **HTTP (3000)** inbound

### 2. SSH into your instance
```bash
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

### 3. Install Node.js on EC2
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
node -v
```

### 4. Clone your repo and install
```bash
git clone https://github.com/yourusername/bug-triage-api
cd bug-triage-api
npm install
```

### 5. Set up .env on EC2
```bash
nano .env
# paste your env variables, save with Ctrl+X
```

### 6. Push DB schema
```bash
npm run db:generate
npm run db:push
```

### 7. Run with PM2 (keeps app alive after SSH disconnect)
```bash
sudo npm install -g pm2
pm2 start index.js --name bug-triage-api
pm2 startup
pm2 save
```

### 8. Access your API
```
http://your-ec2-public-ip:3000
```

---

## Project Structure
```
bug-triage-api/
├── src/
│   ├── routes/
│   │   └── bugRoutes.js
│   ├── controllers/
│   │   └── bugController.js
│   ├── services/
│   │   └── claudeService.js
│   └── db/
│       └── prisma.js
├── prisma/
│   └── schema.prisma
├── .env.example
├── index.js
└── package.json
```