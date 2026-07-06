# Parentsphere API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require:

```http
Authorization: Bearer <accessToken>
```

## Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Create a Parent, Counsellor, or Admin account |
| POST | `/auth/login` | Public | Login and receive access and refresh tokens |
| POST | `/auth/refresh` | Public | Rotate refresh token and issue a new access token |
| POST | `/auth/forgot-password` | Public | Email a password reset link |
| POST | `/auth/reset-password/:token` | Public | Reset password |
| GET | `/auth/verify-email/:token` | Public | Verify user email |
| GET | `/auth/me` | User | Current profile |
| POST | `/auth/logout` | User | Revoke refresh token |

## AI

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/ai/history` | Parent | Chat history |
| POST | `/ai/chat` | Parent | Send a parenting message and save assistant reply |
| POST | `/ai/recommendations` | Parent | Generate books, activities, courses, and counsellor suggestions |

## Children

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/children` | Parent | List children |
| POST | `/children` | Parent | Add child and growth record |
| PUT | `/children/:id` | Parent | Update child profile |
| POST | `/children/:id/growth` | Parent | Add height/weight entry |
| GET | `/children/:id/recommendations` | Parent | Growth guidance |
| DELETE | `/children/:id` | Parent | Delete child profile |

## Counsellors and Appointments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/counsellors` | Public | Search/filter counsellors |
| GET | `/counsellors/:id` | Public | Counsellor details |
| POST | `/counsellors` | Admin | Create counsellor |
| PUT | `/counsellors/:id` | Admin/Counsellor owner | Update counsellor |
| DELETE | `/counsellors/:id` | Admin | Delete counsellor |
| GET | `/appointments` | User | Role-aware appointment list |
| POST | `/appointments` | Parent | Create pending booking |
| PATCH | `/appointments/:id/status` | Admin/Counsellor | Update status |

## Payments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/payments/create-order` | Parent | Create Razorpay/demo order for an appointment |
| POST | `/payments/verify` | Parent | Verify payment and confirm booking |
| GET | `/payments` | User | Role-aware payments |

## Resources

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/books` | Public | Search books |
| POST | `/books` | Admin | Create book |
| POST | `/books/:id/bookmark` | Parent | Toggle bookmark |
| GET | `/articles` | Public | Search articles |
| GET | `/articles/:id` | Public | Article details |
| POST | `/articles` | Admin | Create article |
| POST | `/articles/:id/like` | User | Toggle like |
| POST | `/articles/:id/comments` | User | Add comment |
| GET | `/videos` | Public | List videos |
| POST | `/videos` | Admin | Create video |

## Community, Contact, Admin

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/forum` | User | List forum posts |
| POST | `/forum` | User | Create forum post |
| POST | `/forum/:id/like` | User | Toggle post like |
| POST | `/forum/:id/comments` | User | Add comment |
| POST | `/contact` | Public | Store contact message |
| POST | `/newsletter` | Public | Subscribe email |
| GET | `/admin/analytics` | Admin | Revenue, bookings, users, resource analytics |
| GET | `/admin/users` | Admin | Manage users |
| PATCH | `/admin/users/:id/role` | Admin | Change role |
| DELETE | `/admin/users/:id` | Admin | Delete user |
