# Concert Ticketing — Frontend (Next.js)
> Copilot instruction file. Read this before generating any code.

## Project overview
A concert ticketing platform for music events in Indonesia. Users browse tickets, register, pay via DOKU payment gateway, receive an e-ticket by email, and scan QR at the venue gate on event day.

This is the **frontend-only repo**. It talks to a separate Go backend via REST API.

---

## Tech stack
| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Data fetching | React Query (TanStack Query v5) |
| Forms | React Hook Form + Zod validation |
| HTTP client | Axios (with base instance) |
| QR scanner (check-in page) | `@zxing/browser` |
| State | React context (auth/session only), no Redux |

---

## Folder structure
```
src/
├── app/                        # Next.js App Router pages
│   ├── (public)/
│   │   ├── page.tsx            # Landing page — ticket selection
│   │   ├── register/page.tsx   # Registration form
│   │   └── checkout/page.tsx   # Payment redirect / status
│   ├── (admin)/
│   │   └── checkin/page.tsx    # QR scanner — protected, admin only
│   └── layout.tsx
├── components/
│   ├── ui/                     # Reusable UI primitives (Button, Input, Badge, etc.)
│   ├── ticket/                 # TicketCard, TicketSelector
│   ├── checkout/               # PaymentMethodBadge, OrderSummary
│   └── checkin/                # QRScanner, ScanResult
├── lib/
│   ├── api.ts                  # Axios instance with base URL + interceptors
│   └── validations.ts          # Zod schemas (registration, order)
├── hooks/
│   ├── useTickets.ts           # React Query: GET /tickets
│   ├── useCreateOrder.ts       # React Query mutation: POST /orders
│   └── useCheckin.ts           # React Query mutation: POST /checkin
├── types/
│   └── index.ts                # Shared TypeScript interfaces
└── styles/
    └── globals.css
```

---

## API contract (calls to Go backend)
Base URL comes from `NEXT_PUBLIC_API_URL` env variable.

```ts
// GET /tickets
// Returns available ticket types and stock
type Ticket = {
  id: string
  name: string         // e.g. "VVIP", "Regular"
  price: number        // in IDR
  stock: number
  description: string
}

// POST /orders
// Body: { ticket_id, quantity, name, email, whatsapp }
// Returns: { order_id, payment_url, total_amount }

// POST /payments/webhook  ← called by DOKU, not by FE
// GET /payments/status/:order_id
// Returns: { status: "pending" | "paid" | "failed" }

// POST /checkin
// Body: { qr_code: string }
// Returns: { valid: boolean, ticket_holder: string, ticket_type: string, message: string }
```

---

## Pages & behaviour

### Landing page `/`
- Fetch ticket list via `useTickets()` hook
- Show ticket cards with name, price, stock count
- Stock = 0 → show "Sold out" badge, disable button
- On select → navigate to `/register?ticket_id=X&qty=Y`

### Registration `/register`
- Form fields: Full name, Email, WhatsApp number (Indonesian format `08xx`)
- Zod validation: all required, email format, WA must start with `08` and be 10–13 digits
- On submit → call `POST /orders`, redirect to `/checkout?order_id=X`

### Checkout `/checkout`
- Show order summary (ticket type, qty, total)
- Show payment method info (QRIS, Virtual Account, E-Wallet — chosen by user on this page)
- Poll `GET /payments/status/:order_id` every 3 seconds using React Query `refetchInterval`
- On `paid` → show success screen with "Check your email for your e-ticket"
- On `failed` → show retry option

### Check-in `/checkin` (admin only)
- Protected route — require a simple hardcoded admin PIN stored in env var `ADMIN_PIN`
- Use `@zxing/browser` to access device camera and scan QR codes
- On scan → call `POST /checkin` with the QR value
- Show green screen + ticket holder name on success
- Show red screen + error message on failure
- Auto-reset after 3 seconds to scan next ticket

---

## Environment variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080   # Go backend URL
ADMIN_PIN=1234                              # Check-in page protection
```

---

## Key conventions
- All currency display: format as `Rp XX.XXX` using `Intl.NumberFormat('id-ID')`
- All API errors should be caught and shown as toast notifications (use a simple custom toast, no heavy lib)
- Mobile-first design — the primary user is on a phone
- Dark background theme (deep navy, similar to concert poster aesthetic)
- No SSR for checkout and checkin pages — use `'use client'` and client-side fetch only
- Landing page CAN use SSR (`fetch` in server component) for initial ticket list

---

## Do NOT do
- Do not use Redux or Zustand — context is enough
- Do not use `pages/` router — App Router only
- Do not hardcode API URLs — always use `process.env.NEXT_PUBLIC_API_URL`
- Do not use `any` type in TypeScript
- Do not install `moment.js` — use `date-fns` if date formatting is needed
