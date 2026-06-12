import express from 'express';
import cors from 'cors';
import db, { initDB } from './db.js';
import { handleChatMessage } from './chatEngine.js';

// Initialize the Database and Seed it if necessary
initDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 1. Get Focus Services
app.get('/api/services', (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services').all();
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get Available Slots
app.get('/api/slots', (req, res) => {
  try {
    const { date } = req.query;
    let query = 'SELECT * FROM slots WHERE is_booked = 0';
    let params = [];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    query += ' ORDER BY date ASC, time ASC';

    const slots = db.prepare(query).all(...params);
    res.json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Chat Assistant Bot Endpoint
app.post('/api/chat', (req, res) => {
  try {
    const { sessionId, message } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required' });
    }

    const reply = handleChatMessage(sessionId, message || '');
    res.json({ success: true, ...reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Direct/Manual Booking Endpoint (for integration)
app.post('/api/book', (req, res) => {
  try {
    const { patientName, patientPhone, painPoint, serviceId, slotId } = req.body;

    if (!patientName || !patientPhone || !painPoint || !serviceId || !slotId) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check slot availability
    const slot = db.prepare('SELECT is_booked FROM slots WHERE id = ?').get(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, error: 'Slot not found' });
    }
    if (slot.is_booked === 1) {
      return res.status(400).json({ success: false, error: 'Slot is already booked' });
    }

    const appointmentId = `appt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    // Create Appointment transaction
    const createTx = db.transaction(() => {
      db.prepare(`
        INSERT INTO appointments (id, patient_name, patient_phone, pain_point, service_id, slot_id, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?)
      `).run(appointmentId, patientName, patientPhone, painPoint, serviceId, slotId, new Date().toISOString());

      db.prepare('UPDATE slots SET is_booked = 1 WHERE id = ?').run(slotId);
    });

    createTx();

    res.json({
      success: true,
      message: 'Booking successful',
      data: {
        appointmentId,
        patientName,
        slotId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Get Confirmed Appointments (admin/testing)
app.get('/api/appointments', (req, res) => {
  try {
    const appointments = db.prepare(`
      SELECT a.*, s.name as service_name, sl.date as slot_date, sl.time as slot_time
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN slots sl ON a.slot_id = sl.id
      ORDER BY sl.date DESC, sl.time DESC
    `).all();

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Get Chat Sessions (admin/testing)
app.get('/api/sessions', (req, res) => {
  try {
    const sessions = db.prepare('SELECT * FROM chat_sessions ORDER BY updated_at DESC').all();
    const formatted = sessions.map(s => ({
      id: s.id,
      current_step: s.current_step,
      collected_data: JSON.parse(s.collected_data || '{}'),
      updated_at: s.updated_at
    }));
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Reset and Seed Database (wipe all transactions for testing)
app.post('/api/reset', (req, res) => {
  try {
    db.prepare('DELETE FROM appointments').run();
    db.prepare('DELETE FROM chat_sessions').run();
    db.prepare('DELETE FROM slots').run();
    db.prepare('DELETE FROM services').run();
    
    // Run seed again
    initDB();

    res.json({ success: true, message: 'Database wiped and fresh seeding completed.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the Server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Clinic Backend API listening privately on http://127.0.0.1:${PORT}`);
  console.log(`Vite development proxy will redirect /api requests here.`);
});
