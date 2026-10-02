# FixItNow

**Expert fixes, right at your door.**

FixItNow is a service booking platform that connects customers with trusted technicians. Customers browse services, request a time and pay securely online once the technician accepts. Technicians manage their services, availability and bookings, and admins oversee users and categories.

This repository is the **Next.js frontend**.

## Links

|                     |                                                         |
| ------------------- | ------------------------------------------------------- |
| Frontend repository | https://github.com/FahimFaysalNirjhar/FixItNow-Frontend |
| Backend repository  | https://github.com/FahimFaysalNirjhar/FixIT-Now         |
| API base URL        | https://fix-it-now-assignment-4.vercel.app              |
| Live site           | https://fixitnow-app-nine.vercel.app                    |

## Demo accounts

Use these on the login page (they are also available as quick-fill buttons).

| Role       | Email                    | Password       |
| ---------- | ------------------------ | -------------- |
| Admin      | `admin@example.com`      | `Password@123` |
| Customer   | `customer@example.com`   | `123456@Qa`    |
| Technician | `technician@example.com` | `123456@Qa`    |

## Features

**Public**

- Browse services with search, category, location and price filters, sorting and pagination
- Browse technicians with search, location, availability and rating filters
- Service and technician detail pages with availability and reviews
- Register as a customer or a technician, with profile photo upload

**Customer** (`/dashboard`)

- Request a booking for a time slot
- Track bookings and cancel them
- Pay with Stripe Checkout once a technician accepts
- View payment history
- Review completed bookings

**Technician** (`/technician-dashboard`)

- Create and edit a technician profile
- Add, edit, hide and delete services
- Manage weekly availability slots
- Accept, complete or cancel booking requests

**Admin** (`/admin-dashboard`)

- Block and unblock users and technicians
- Create, rename and delete categories
- View all bookings

## Booking flow

1. The customer sends a booking request (`REQUESTED`).
2. The technician accepts it (`ACCEPTED`) or cancels it (`CANCELLED`).
3. The customer pays through Stripe Checkout.
4. The technician marks the job as done (`COMPLETED`).
5. The customer can leave a review.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions)
- TypeScript
- Tailwind CSS with shadcn/ui components
- lucide-react icons
- jsonwebtoken for reading and verifying tokens
- imgbb for profile photo hosting
- Backend: Express, Prisma and Stripe (see the backend repository)

## Getting started

### Prerequisites

- Node.js 20 or later
- The backend running locally, or the hosted API above

### Install

```bash
git clone https://github.com/FahimFaysalNirjhar/FixItNow-Frontend.git
cd FixItNow-Frontend
npm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
# Backend base URL (no trailing slash)
BACKEND_API_URL=https://fix-it-now-assignment-4.vercel.app

# imgbb API key, used for profile photo uploads
IMAGE_HOST_KEY=your_imgbb_key

# Must match the secrets used by the backend
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

### Run

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Authentication

- Login stores `accessToken` (1 day) and `refreshToken` (7 days) as httpOnly cookies.
- When the access token expires, the refresh token is used to get a new one automatically.
- After login, users are redirected by role: `/admin-dashboard`, `/technician-dashboard` or `/dashboard`.
- All backend calls are made on the server, so tokens never reach browser JavaScript.

## Project structure

```
app/
  (publicGroup)/       Home, services, technicians, about, contact, auth pages
  (dashboardGroup)/    Customer, technician and admin dashboards
  about/ contact/      Static pages
service/               authedRequest, token and session helpers
lib/                   Shared helpers (image upload)
utils/                 JWT utilities
```

## Documentation

See [API_INTEGRATION.md](./API_INTEGRATION.md) for the mapping between frontend functions and backend endpoints.

## Author

**Fahim Faysal Nirjhar**

- GitHub: [FahimFaysalNirjhar](https://github.com/FahimFaysalNirjhar)
- Email: fahimfaysal1995@gmail.com
