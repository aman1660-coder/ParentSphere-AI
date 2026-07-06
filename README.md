# Parentsphere

Parentsphere is a full-stack parenting and child-development platform with React, Vite, Tailwind CSS, Express, MongoDB, JWT auth, AI guidance, counsellor booking, Razorpay payments, resource libraries, forum, dashboards, email notifications, analytics, and seed data.

## Quick Start

```bash
npm install
cp .env.example server/.env
cp .env.example frontend/.env
npm run seed
npm run dev
```

Open `http://localhost:5173`.

Default seeded accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@parentsphere.com | Admin@12345 |
| Parent | parent@parentsphere.com | Parent@12345 |
| Counsellor | counsellor@parentsphere.com | Counsellor@12345 |

## MongoDB Compass

Use this local connection string in MongoDB Compass:

```text
mongodb://127.0.0.1:27017/parentsphere
```

For MongoDB Atlas, replace `MONGODB_URI` in `server/.env` with your Atlas connection string and run `npm run seed` again.

## Scripts

```bash
npm run dev      # starts Express and Vite together
npm run build    # builds the React frontend
npm run start    # starts the Express API
npm run seed     # seeds users, counsellors, resources, appointments, analytics data
```

## Features

- JWT authentication with access and refresh tokens
- Register, login, email verification, forgot/reset password
- Parent, Counsellor, and Admin role-based dashboards
- AI parenting assistant with OpenAI integration and a built-in fallback engine
- Child growth tracking with charts and AI recommendations
- Counsellor directory, availability, booking, and payment flow
- Razorpay integration with secure signature verification and demo-payment mode
- E-book library with bookmarks, search, read, and download links
- Blog/articles with categories, likes, comments, and admin publishing
- Video resource center for courses, child development videos, and webinars
- Community forum with posts, comments, and likes
- Admin analytics for revenue, bookings, users, books, counsellors, and resources
- Nodemailer notifications for registration, password reset, booking, and payments
- Helmet, rate limiting, XSS sanitization, MongoDB sanitization, and input validation

## Environment Notes

If `OPENAI_API_KEY` is empty, Parentsphere uses a deterministic parenting assistant that produces practical guidance from the message and child profile.

If Razorpay keys are empty, the booking flow uses demo payment verification so the project can be demonstrated offline. Add real Razorpay test keys for the hosted checkout.

## Documentation

- [API documentation](docs/API.md)
- [Architecture and ER diagram](docs/ARCHITECTURE.md)
