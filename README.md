# 🐛 AI Bug Triage System

A REST API that accepts bug reports and uses **Claude Sonnet (Gen AI)** to automatically classify severity, identify root cause, suggest fixes, and generate test cases. Built with **Node.js + Express**, **Prisma ORM**, **Supabase (PostgreSQL)**, deployed on **AWS EC2**.

---

## Tech Stack
- **Runtime:** Node.js + Express.js
- **AI:** Anthropic Claude Sonnet API
- **ORM:** Prisma
- **Database:** Supabase (PostgreSQL)
- **Deployment:** AWS EC2 (t2.micro)

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
  "submittedBy": "abc@example.com"
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