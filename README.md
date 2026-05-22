# StudyNook 📚

**Live Site:** [study-nook](https://study-nook-083.vercel.app)

A full-stack web application where students and library users can discover, book, and manage study rooms — and list their own spaces to earn.

---

## ✨ Features

- 🔐 **Secure JWT Authentication** — Email/password and Google OAuth login powered by Better Auth, with JWKS verification and HTTP‑only cookies for token storage.
- 🏠 **Room Listings** — Browse, search, and filter study rooms by name, amenities, and hourly rate with real-time results.
- 📅 **Smart Booking System** — Book rooms by date and time slot with automatic conflict detection and real-time total cost calculation.
- 🛠️ **Full Room Management** — Authenticated users can add, edit, and delete their own room listings with image preview support.
- 📋 **Personal Dashboard** — Track all your bookings and listings with status badges, cancellation support, and booking history.
- 🔍 **Search & Filter** — Filter rooms by amenities and max hourly rate with animated results and empty state handling.
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop with a consistent and polished UI across all screen sizes.

---

## 🛠️ Tech Stack

### Frontend
- Next.js 14 — App Router, Server & Client Components
- Tailwind CSS — Utility-first styling
- Framer Motion — Animations and transitions
- Better Auth (JWT client) — Authentication with Google OAuth
- Toast — Notification system
- React Icons — Icon library

### Backend
- Node.js + Express.js — REST API server
- MongoDB — NoSQL database
- Better Auth — Session & JWT management
- **JWT** — JSON Web Tokens for stateless authentication
- **JWKS** — JSON Web Key Set for token verification

### Security
- **HTTP‑Only Cookies** — JWT stored securely, inaccessible to client‑side JavaScript
- **Auth Middleware** — Protects all private routes (Add Room, Book Room, My Bookings, Edit/Delete, Cancel)
- **Owner Verification** — Users can only edit or delete their own room listings

