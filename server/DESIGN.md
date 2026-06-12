# ReliefNow Chiropractic — AI Booking Agent Engine DESIGN

This document outlines the SQLite Database Schema, Conversational State Machine, and AI Prompt Flow built to deliver a 5-minute appointment booking experience on WhatsApp and the Web for our Jubilee Hills, Hyderabad clinic.

---

## 1. SQLite Database Schema Design
We use a high-performance local SQLite database via `better-sqlite3` to store clinic configurations, live slot availabilities, appointment bookings, and conversational state persistence.

### Entity Relationship Model

```
 ┌──────────────┐           ┌──────────────┐
 │   services   │──────────<│ appointments │
 └──────────────┘           └──────┬───────┘
                                   │
 ┌──────────────┐                  │
 │    slots     │──────────────────┘
 └──────────────┘
 
 ┌────────────────┐
 │ chat_sessions  │ (Persistent Session States)
 └────────────────┘
```

### Table Schemas

#### A. `services`
Holds the specialized chiropractic services mapped directly to the patient's pain points.
*   `id` (TEXT, PRIMARY KEY): e.g., `'spinal-decompression'`, `'cervical-mobilization'`.
*   `name` (TEXT): The service title displayed to the patient.
*   `description` (TEXT): Core benefits of the alignment therapy.
*   `duration_mins` (INTEGER): Consultation and adjustment session duration.
*   `price` (INTEGER): Service price in INR (₹).

#### B. `slots`
Holds dynamic daily slots. Dates are generated relative to the current system time so slots are always fresh and real.
*   `id` (TEXT, PRIMARY KEY): Format: `slot_[date]_[time]` (e.g. `slot_2026-06-12_1830`).
*   `date` (TEXT): Format: `YYYY-MM-DD`.
*   `time` (TEXT): Format: `HH:MM` (24-hour, e.g. `'21:30'`).
*   `is_booked` (INTEGER): `0` = Free, `1` = Booked.
*   *Late-night hours (open until 11 PM) are fully seeded (up to 10:30 PM slots).*

#### C. `appointments`
Tracks confirmed appointments.
*   `id` (TEXT, PRIMARY KEY): Unique booking ID.
*   `patient_name` (TEXT): Full name of the patient.
*   `patient_phone` (TEXT): Mobile number (WhatsApp).
*   `pain_point` (TEXT): Mapped pain category (Back, Neck, Headache, Posture).
*   `service_id` (TEXT): FK referencing `services(id)`.
*   `slot_id` (TEXT): FK referencing `slots(id)`.
*   `status` (TEXT): `'confirmed'` or `'cancelled'`.
*   `created_at` (TEXT): ISO 8601 Timestamp.

#### D. `chat_sessions`
Maintains the conversational state of each patient across interactions to ensure stateful resumption.
*   `id` (TEXT, PRIMARY KEY): The user's Session ID (e.g., telephone number or browser session UUID).
*   `current_step` (TEXT): The current state machine step (e.g., `'WELCOME'`, `'QUALIFYING_PAIN'`).
*   `collected_data` (TEXT): JSON payload string caching collected details (name, phone, pain point, service, slot).
*   `updated_at` (TEXT): ISO 8601 Timestamp.

---

## 2. Conversational State Machine & Chatbot Flows
Designed to be mobile-first and high-conversion, completing the booking in **under 3 minutes** (averaging 5-6 short exchanges).

```
         ┌──────────────┐
         │   WELCOME    │  ◄─────────────────────────┐
         └──────┬───────┘                            │
                │ (Selects pain / input text)        │
         ┌──────▼───────────┐                        │
         │ QUALIFYING_PAIN  │                        │
         └──────┬───────────┘                        │
                │ (Confirms slot selection)          │ (Restart Command)
         ┌──────▼───────────┐                        │
         │  SELECTING_SLOT  │                        │
         └──────┬───────────┘                        │
                │ (Selects slot number)              │
         ┌──────▼───────────┐                        │
         │ COLLECTING_NAME  │                        │
         └──────┬───────────┘                        │
                │ (Inputs Name)                      │
         ┌──────▼───────────┐                        │
         │ COLLECTING_PHONE │                        │
         └──────┬───────────┘                        │
                │ (Inputs Phone)                     │
         ┌──────▼───────────┐                        │
         │    CONFIRMING    │                        │
         └──────┬───────────┘                        │
                │ (Confirm/Yes)                      │
         ┌──────▼───────────┐                        │
         │    COMPLETED     ├────────────────────────┘
         └──────────────────┘
```

### Conversational States

1.  **WELCOME**: Introduces ReliefNow (elite late-night Hyderabad clinic, open until 11 PM). Presents focus areas (Back Pain, Neck Stiffness, Tension Headaches, Posture Alignment).
2.  **QUALIFYING_PAIN**: Empathizes with the patient's pain point and recommends the matching chiropractic treatment. Displays price and duration transparently.
3.  **SELECTING_SLOT**: Displays the next **4 available slots** from the database (real-time filtering out of pre-booked times). Highlights our **convenient evening/late-night slots** (up to 11 PM) for professionals.
4.  **COLLECTING_NAME**: Captures the user's name and tentatively reserves the slot.
5.  **COLLECTING_PHONE**: Captures the WhatsApp/mobile number.
6.  **CONFIRMING**: Displays a comprehensive digital receipt (Service, Date, Time, Location, Consult Fee, Patient info). Offers a one-click confirmation button.
7.  **COMPLETED**: Finalizes booking in SQLite, marks the slot as booked, and displays exact Jubilee Hills location details (metro pillars, free valet parking). Offers triggers to simulate reminders & post-visit upsell.

---

## 3. Mock Simulations (Pre-Visit Reminders & Post-Visit Upsell)
To support the clinic's core KPIs (reducing no-show rates and driving long-term customer retention):

### A. 2-Hour Pre-Visit WhatsApp Reminder
*   **KPI Addressed**: Show-up Rate.
*   **Simulated Message**:
    > "Hey Rahul! This is your 2-hour friendly reminder for your Spinal Decompression adjustment today at 21:30 at ReliefNow Jubilee Hills. ⏰
    > 📍 Directions: Jubilee Hills Road No. 36 (Metro Pillar 1635)
    > 🚗 Free valet parking is waiting. If you need to reschedule, reply here. See you soon!"

### B. 3-Hour Post-Visit Wellness Subscription Upsell
*   **KPI Addressed**: Retention & Rebooking Rate.
*   **Goal**: Drive conversion into our high-margin multi-visit subscription packages.
*   **Simulated Message**:
    > "Hi Rahul! We hope your spine is feeling incredibly relieved after your treatment! 😊
    > Our Chiropractor recommends 6 sessions to fully correct posture and prevent chronic recurrence.
    > 🎁 **Active Patient Special**: Get our **Spinal Wellness Package** of 5 sessions for only **₹5,000** (normally ₹7,500, saves 33%!).
    > Would you like to lock in this package or book your second session?"

---

## 4. API Endpoints
All API endpoints prefix with `/api` and are served on port `8000` privately, with built-in CORS and proxy mapping inside the Vite development server on port `3000`.

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/services` | Retrieve list of focus services | None |
| **GET** | `/api/slots` | Retrieve available slots | `?date=YYYY-MM-DD` (optional) |
| **POST**| `/api/chat` | Main conversational state machine | `{ sessionId: "123", message: "back" }` |
| **POST**| `/api/book` | Direct manual slot booking | `{ patientName, patientPhone, serviceId, slotId, painPoint }` |
| **GET** | `/api/appointments` | Admin list of all confirmed bookings | None |
| **GET** | `/api/sessions` | View active conversational cache states | None |
| **POST**| `/api/reset` | Clear DB and execute fresh seeding | None |

---

## 5. Integration Guide for Frontend (`agent-engineer`)
Our Vite dev server on port `3000` contains a native reverse-proxy mapping inside `vite.config.js`. This allows the front-end React code to fetch endpoints relative to the main domain:
```javascript
// Fetch available slots from React
const res = await fetch('/api/slots');
const data = await res.json();

// Send chat message to bot
const chatRes = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sessionId, message })
});
```
This ensures zero CORS issues and maps perfectly to our unified port `3000` production surface!
