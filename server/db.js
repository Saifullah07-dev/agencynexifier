import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB file
const dbPath = path.join(__dirname, 'clinic.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');

// Define Schema
export function initDB() {
  // 1. Services Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      duration_mins INTEGER NOT NULL,
      price INTEGER NOT NULL
    )
  `).run();

  // 2. Slots Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS slots (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,       -- YYYY-MM-DD
      time TEXT NOT NULL,       -- HH:MM (e.g., "18:30")
      is_booked INTEGER NOT NULL DEFAULT 0 -- 0 = free, 1 = booked
    )
  `).run();

  // 3. Appointments Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_name TEXT NOT NULL,
      patient_phone TEXT NOT NULL,
      pain_point TEXT NOT NULL,
      service_id TEXT NOT NULL,
      slot_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, cancelled
      created_at TEXT NOT NULL,
      FOREIGN KEY (service_id) REFERENCES services(id),
      FOREIGN KEY (slot_id) REFERENCES slots(id)
    )
  `).run();

  // 4. Chat Sessions Table (Conversational State persistence)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY, -- e.g. Phone number or uuid
      current_step TEXT NOT NULL DEFAULT 'WELCOME', -- WELCOME, QUALIFYING_PAIN, SELECTING_SLOT, COLLECTING_NAME, COLLECTING_PHONE, CONFIRMING, COMPLETED
      collected_data TEXT, -- JSON string
      updated_at TEXT NOT NULL
    )
  `).run();

  // Seed Initial Services if empty
  const servicesCount = db.prepare('SELECT COUNT(*) as count FROM services').get();
  if (servicesCount.count === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (id, name, description, duration_mins, price)
      VALUES (?, ?, ?, ?, ?)
    `);

    const services = [
      {
        id: 'spinal-decompression',
        name: 'Spinal Decompression & Alignment',
        description: 'Elite treatment for acute back pain, herniated discs, and sciatic nerve pain using targeted mechanical adjustments.',
        duration_mins: 30,
        price: 1500
      },
      {
        id: 'cervical-mobilization',
        name: 'Cervical Mobilization & Relief',
        description: 'Focused alignment adjustments to target neck stiffness, whip injuries, and restore natural head-and-neck mobility.',
        duration_mins: 30,
        price: 1200
      },
      {
        id: 'headache-therapy',
        name: 'Tension Headache Therapy',
        description: 'Suboccipital spinal adjustment combined with soft tissue release to target stress and tension-induced chronic headaches.',
        duration_mins: 30,
        price: 1200
      },
      {
        id: 'posture-correction',
        name: 'Posture Correction & Ergonomics',
        description: 'Comprehensive structural alignment program with digital posture analysis and ergonomic habit counseling.',
        duration_mins: 45,
        price: 1800
      }
    ];

    for (const s of services) {
      insertService.run(s.id, s.name, s.description, s.duration_mins, s.price);
    }
    console.log('Seeded services table.');
  }

  // Seed Slots dynamically for the next 3 days if empty
  const slotsCount = db.prepare('SELECT COUNT(*) as count FROM slots').get();
  if (slotsCount.count === 0) {
    const insertSlot = db.prepare(`
      INSERT INTO slots (id, date, time, is_booked)
      VALUES (?, ?, ?, ?)
    `);

    const dates = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push(`${yyyy}-${mm}-${dd}`);
    }

    // Standard business hours slots including late nights up to 11 PM (last slot 10:30 PM)
    const times = [
      '10:00', '11:00', '12:00', 
      '14:00', '15:00', '16:00', 
      '17:30', '18:30', '19:30', 
      '20:30', '21:30', '22:00', '22:30' // Differentiated late night slots!
    ];

    let slotIdCount = 1;
    for (const date of dates) {
      for (const time of times) {
        // Mocking some slots as pre-booked randomly to make it realistic
        // Let's say 25% of slots are already booked, but keep late night slots mostly open for demo
        const isBookedRandom = Math.random() < 0.25 ? 1 : 0;
        const slotId = `slot_${date}_${time.replace(':', '')}`;
        insertSlot.run(slotId, date, time, isBookedRandom);
        slotIdCount++;
      }
    }
    console.log('Seeded slots table with 3 days of appointment slots (including late-night hours).');
  }
}

export default db;
