# FixItNow: API Integration

How the Next.js frontend talks to the Express backend.

- **Base URL:** `BACKEND_API_URL` (server-side only; every call is made from a server action or server component).
- **Auth:** `accessToken` and `refreshToken` are stored as httpOnly cookies at login. Protected calls go through `authedRequest` (`@/service/authedRequest`), which gets the token from `isAccessTokenExist` (refreshes it via `POST /api/auth/refresh-token` when expired) and forwards it as a `cookie` header.
- **Caching:** public reads use `next.revalidate` with tags (`services`, `technicians`, `categories`, `my-profile`). Mutations call `revalidatePath` / `revalidateTag` / `updateTag`.

## Public

| Endpoint                               | Frontend function | Used by                                                                  |
| -------------------------------------- | ----------------- | ------------------------------------------------------------------------ |
| `GET /api/categories`                  | `getCategories`   | Home hero chips, categories section, services filter                     |
| `GET /api/services`                    | `getServices`     | Services listing, home featured services                                 |
| `GET /api/services/:id`                | `getService`      | Single service page                                                      |
| `GET /api/technician`                  | `getTechnicians`  | Technicians listing, home featured technicians                           |
| `GET /api/technician/:id`              | `getTechnician`   | Technician detail page (profile, services, reviews, availability)        |
| `GET /api/technician/:id/availability` | not used          | Availability already arrives inside the technician and service responses |

## Auth and user

| Endpoint                       | Frontend function                        | Used by                                |
| ------------------------------ | ---------------------------------------- | -------------------------------------- |
| `POST /api/auth/login`         | `loginAction`                            | Login page                             |
| `POST /api/auth/refresh-token` | `getNewRefreshToken`                     | `isAccessTokenExist`, `proxy.ts`       |
| `GET /api/users/check-phone`   | `isPhoneTaken` (inside `registerAction`) | Register form                          |
| `POST /api/users/register`     | `registerAction`                         | Register page                          |
| `GET /api/users/me`            | `getMe`                                  | Dashboard layout, profile page, navbar |
| `PUT /api/users/my-profile`    | `updateProfileAction`                    | Profile page (all roles)               |

Logout is handled on the frontend only: `logOut` deletes both cookies and revalidates `my-profile`.

## Customer (`/dashboard/*`)

| Endpoint                                  | Frontend function                               | Used by                                                   |
| ----------------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| `POST /api/customer/bookings`             | `createBooking`                                 | Booking form on the service page                          |
| `GET /api/customer/bookings`              | `getCustomerBookings`, `getMyReviews`           | My bookings, overview, My reviews                         |
| `GET /api/customer/bookings/:id`          | `getCustomerBooking`                            | Booking detail                                            |
| `PATCH /api/customer/bookings/:id/cancel` | `cancelBookingAction`                           | My bookings (Cancel)                                      |
| `POST /api/payment/checkout`              | `startCheckoutAction`                           | My bookings (Pay now, shown once a booking is `ACCEPTED`) |
| `GET /api/payment/history`                | `getPayments`                                   | Payments page                                             |
| `POST /api/reviews`                       | `createReviewAction` (`customerBookingActions`) | My bookings (Leave a review, once `COMPLETED`)            |
| `PATCH /api/customer/profile`             | not used                                        | The profile page uses `PUT /api/users/my-profile` instead |
| `GET /api/payment/:id`                    | not used                                        | Payments page lists from `/history` only                  |
| `POST /api/payment/webhook`               | none                                            | Called by Stripe, never by the frontend                   |

## Technician (`/technician-dashboard/*`)

| Endpoint                                     | Frontend function                                  | Used by                             |
| -------------------------------------------- | -------------------------------------------------- | ----------------------------------- |
| `GET /api/technician/profile`                | `getTechnicianProfile`, `getMyServices`            | Overview, My services, Profile      |
| `POST /api/technician/profile`               | `updateProfileAction` (mode `create`)              | Profile page, first-time setup      |
| `PATCH /api/technician/profile`              | `updateProfileAction` (mode `update`)              | Profile page                        |
| `DELETE /api/technician/profile`             | not used                                           |                                     |
| `GET /api/technician/bookings`               | `getTechnicianBookings`                            | Bookings, Overview                  |
| `PATCH /api/technician/bookings/:id/status`  | `updateBookingStatusAction`                        | Bookings (Accept, Complete, Cancel) |
| `POST /api/technician/services`              | `createServiceAction`                              | My services (Add service)           |
| `PATCH /api/technician/services/:serviceId`  | `updateServiceAction`, `toggleServiceActiveAction` | My services (Edit, Show/Hide)       |
| `DELETE /api/technician/services/:serviceId` | `deleteServiceAction`                              | My services (Delete)                |
| `GET /api/technician/availability`           | `getMyAvailability`                                | Availability page                   |
| `POST /api/technician/availability`          | `addAvailabilityAction`                            | Availability page (Add slot)        |
| `DELETE /api/technician/availability/:id`    | `deleteAvailabilityAction`                         | Availability page (Remove slot)     |

## Admin (`/admin-dashboard/*`)

| Endpoint                            | Frontend function        | Used by                                       |
| ----------------------------------- | ------------------------ | --------------------------------------------- |
| `POST /api/admin/categories`        | `createCategoryAction`   | Categories page                               |
| `PATCH /api/admin/categories/:id`   | `updateCategoryAction`   | Categories page                               |
| `DELETE /api/admin/categories/:id`  | `deleteCategoryAction`   | Categories page                               |
| `PATCH /api/admin/users/:id/status` | `updateUserStatusAction` | Users and Technicians pages (Block / Unblock) |
| `GET /api/admin/categories`         | needs a fetcher          | Categories page                               |
| `GET /api/admin/users`              | needs a fetcher          | Users and Technicians pages                   |
| `GET /api/admin/bookings`           | needs a fetcher          | Bookings page, Overview                       |

## Known gaps

- `DELETE /api/technician/profile`, `PATCH /api/customer/profile`, `GET /api/payment/:id` and `GET /api/technician/:id/availability` have no frontend caller. Either wire them up or leave them out on purpose.
- Admin list endpoints (`GET` users, categories, bookings) were not in the code reviewed. Confirm each page has a fetcher.
- `authedRequest.ts` contains a second `createReviewAction` that posts to `/api/customer/bookings/:id/review`, which the backend does not have. Remove it and use the one in `customerBookingActions`.
- `createBooking`, `getMyReviews` and `getPayments` build their own auth headers. Moving them onto `authedRequest` keeps auth in one place.
