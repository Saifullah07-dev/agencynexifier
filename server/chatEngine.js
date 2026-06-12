import db from './db.js';

// Helper to get session from database
function getSession(sessionId) {
  const row = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(sessionId);
  if (row) {
    return {
      id: row.id,
      current_step: row.current_step,
      collected_data: JSON.parse(row.collected_data || '{}')
    };
  }
  return null;
}

// Helper to save session to database
function saveSession(sessionId, current_step, collected_data) {
  const now = new Date().toISOString();
  const dataStr = JSON.stringify(collected_data);
  
  db.prepare(`
    INSERT INTO chat_sessions (id, current_step, collected_data, updated_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      current_step = excluded.current_step,
      collected_data = excluded.collected_data,
      updated_at = excluded.updated_at
  `).run(sessionId, current_step, dataStr, now);
}

// Format date into human readable format (e.g., "Today, 12th Jun" or "Tomorrow, 13th Jun")
function formatSlotDate(dateStr) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const slotDate = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const slotDateStr = slotDate.toDateString();
  
  let prefix = '';
  if (slotDateStr === today.toDateString()) {
    prefix = 'Today';
  } else if (slotDateStr === tomorrow.toDateString()) {
    prefix = 'Tomorrow';
  } else {
    prefix = days[slotDate.getDay()];
  }

  const dayOfMonth = slotDate.getDate();
  // Ordinal suffix
  let suffix = 'th';
  if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) suffix = 'st';
  else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) suffix = 'nd';
  else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) suffix = 'rd';

  return `${prefix} (${dayOfMonth}${suffix} ${months[slotDate.getMonth()]})`;
}

// Main Chat Process Engine
export function handleChatMessage(sessionId, userMessage) {
  const message = (userMessage || '').trim();
  const lowercaseMsg = message.toLowerCase();
  
  // 1. Retrieve or Initialize Session
  let session = getSession(sessionId);
  if (!session) {
    session = {
      id: sessionId,
      current_step: 'WELCOME',
      collected_data: {}
    };
    saveSession(sessionId, session.current_step, session.collected_data);
  }

  const state = session.current_step;
  const data = session.collected_data;

  // 2. Global "reset" or "restart" command to start over
  if (lowercaseMsg === 'restart' || lowercaseMsg === 'reset' || lowercaseMsg === 'hi' || lowercaseMsg === 'hello') {
    const refreshedData = {};
    saveSession(sessionId, 'WELCOME', refreshedData);
    
    return {
      text: "Welcome to ReliefNow Chiropractic, Hyderabad's premium late-night pain relief clinic! 🌟 We are open daily until 11 PM to help you live pain-free.\n\nI'm your AI care assistant. Are you seeking immediate relief for any specific pain today? Please select your main pain point below so I can recommend the right treatment:",
      options: [
        { label: '💥 Back Pain', value: 'back' },
        { label: ' stiff Neck Pain', value: 'neck' },
        { label: '💆 Tension Headaches', value: 'headache' },
        { label: '🧍 Posture Correction', value: 'posture' }
      ],
      step: 'WELCOME'
    };
  }

  // 3. State Machine Transitions
  switch (state) {
    case 'WELCOME': {
      let painPoint = '';
      let serviceId = '';
      let serviceName = '';
      let price = 0;

      // Classify input based on selection or natural language keyword matching
      if (lowercaseMsg.includes('back') || lowercaseMsg.includes('spinal') || lowercaseMsg.includes('lumbar') || lowercaseMsg === '1') {
        painPoint = 'Back Pain';
        serviceId = 'spinal-decompression';
      } else if (lowercaseMsg.includes('neck') || lowercaseMsg.includes('cervical') || lowercaseMsg.includes('stiff') || lowercaseMsg === '2') {
        painPoint = 'Neck Pain';
        serviceId = 'cervical-mobilization';
      } else if (lowercaseMsg.includes('head') || lowercaseMsg.includes('migraine') || lowercaseMsg.includes('tension') || lowercaseMsg === '3') {
        painPoint = 'Headaches';
        serviceId = 'headache-therapy';
      } else if (lowercaseMsg.includes('posture') || lowercaseMsg.includes('slouch') || lowercaseMsg.includes('shoulder') || lowercaseMsg === '4') {
        painPoint = 'Posture Correction';
        serviceId = 'posture-correction';
      } else {
        // Did not match
        return {
          text: "I want to make sure I recommend the exact therapy for you. Please choose from one of our key focus areas:\n\n1. Back Pain (Spinal Alignment)\n2. Neck Stiffness / Pain\n3. Tension Headaches\n4. Posture Correction & Ergonomics",
          options: [
            { label: 'Back Pain', value: 'back' },
            { label: 'Neck Pain', value: 'neck' },
            { label: 'Headaches', value: 'headache' },
            { label: 'Posture Correction', value: 'posture' }
          ],
          step: 'WELCOME'
        };
      }

      // Fetch service details
      const service = db.prepare('SELECT * FROM services WHERE id = ?').get(serviceId);
      
      data.pain_point = painPoint;
      data.service_id = serviceId;
      data.service_name = service.name;
      data.service_price = service.price;
      data.service_duration = service.duration_mins;

      saveSession(sessionId, 'QUALIFYING_PAIN', data);

      return {
        text: `I understand you are dealing with **${painPoint}**. That can be incredibly disruptive to your work and sleep! 😟\n\nFor this, our Chiropractors recommend our specialized treatment: **${service.name}**.\n\n⏱️ **Duration**: ${service.duration_mins} mins\n💰 **Price**: ₹${service.price} (Pay at clinic)\n📝 **What it does**: ${service.description}\n\nWould you like to check our next available slots to book your session today?`,
        options: [
          { label: '👉 Yes, show available slots', value: 'show_slots' },
          { label: '🔄 Start over / Select different pain', value: 'restart' }
        ],
        step: 'QUALIFYING_PAIN'
      };
    }

    case 'QUALIFYING_PAIN': {
      if (lowercaseMsg.includes('yes') || lowercaseMsg.includes('show') || lowercaseMsg.includes('slot') || lowercaseMsg.includes('book')) {
        // Fetch next available slots (max 4 slots, sorted by date and time)
        // Only show slots that are NOT booked (is_booked = 0)
        const availableSlots = db.prepare(`
          SELECT * FROM slots 
          WHERE is_booked = 0 
          ORDER BY date ASC, time ASC 
          LIMIT 4
        `).all();

        if (availableSlots.length === 0) {
          return {
            text: "We are currently fully booked for the next 3 days! 😳 Please contact our front desk at +91 98765 43210 for emergency walk-ins (open late until 11 PM).",
            options: [{ label: '🔄 Start over', value: 'restart' }],
            step: 'QUALIFYING_PAIN'
          };
        }

        // Format slot display options
        const options = availableSlots.map((slot, index) => {
          const formattedDate = formatSlotDate(slot.date);
          return {
            label: `${index + 1}. ${formattedDate} at ${slot.time}`,
            value: slot.id
          };
        });

        saveSession(sessionId, 'SELECTING_SLOT', data);

        return {
          text: "Excellent! Here are our next 4 available appointment slots. Since we are open late until **11 PM**, we have convenient evening and night options for busy professionals in Hyderabad:\n\n" + 
            availableSlots.map((slot, idx) => `🟢 **Slot ${idx + 1}**: ${formatSlotDate(slot.date)} at **${slot.time}**`).join('\n') + 
            "\n\nPlease select your preferred slot from the choices below:",
          options: options,
          step: 'SELECTING_SLOT'
        };
      } else {
        // Restart or change
        const refreshedData = {};
        saveSession(sessionId, 'WELCOME', refreshedData);
        return handleChatMessage(sessionId, 'restart'); // Trigger welcome again
      }
    }

    case 'SELECTING_SLOT': {
      // Find which slot was selected. Could be slot ID (direct button value) or a index input like "1", "2"
      let selectedSlot = null;

      // Retrieve the current top slots for matching index inputs
      const availableSlots = db.prepare(`
        SELECT * FROM slots 
        WHERE is_booked = 0 
        ORDER BY date ASC, time ASC 
        LIMIT 4
      `).all();

      const indexInput = parseInt(message, 10);
      if (!isNaN(indexInput) && indexInput >= 1 && indexInput <= availableSlots.length) {
        selectedSlot = availableSlots[indexInput - 1];
      } else {
        // Check if message matches any slot_id directly (button value)
        const matchedSlot = db.prepare('SELECT * FROM slots WHERE id = ? AND is_booked = 0').get(message);
        if (matchedSlot) {
          selectedSlot = matchedSlot;
        }
      }

      if (!selectedSlot) {
        // Ask again with list
        const options = availableSlots.map((slot, index) => {
          const formattedDate = formatSlotDate(slot.date);
          return {
            label: `${index + 1}. ${formattedDate} at ${slot.time}`,
            value: slot.id
          };
        });

        return {
          text: "I didn't quite catch that slot. Please select one of the available options below:",
          options: options,
          step: 'SELECTING_SLOT'
        };
      }

      // Save selected slot details
      data.selected_slot_id = selectedSlot.id;
      data.selected_slot_date = selectedSlot.date;
      data.selected_slot_time = selectedSlot.time;

      saveSession(sessionId, 'COLLECTING_NAME', data);

      return {
        text: `Great choice! I have tentatively held **${formatSlotDate(selectedSlot.date)} at ${selectedSlot.time}** for you.\n\nTo lock this in, could you please tell me your **Full Name**?`,
        options: [],
        step: 'COLLECTING_NAME'
      };
    }

    case 'COLLECTING_NAME': {
      if (message.length < 2) {
        return {
          text: "Please enter a valid full name (at least 2 letters):",
          options: [],
          step: 'COLLECTING_NAME'
        };
      }

      data.patient_name = message;
      saveSession(sessionId, 'COLLECTING_PHONE', data);

      return {
        text: `Thanks, **${message}**! 😊\n\nLastly, what is your **WhatsApp or Mobile Number**? We'll use this to send your instant confirmation details and automated pre-visit reminders.`,
        options: [],
        step: 'COLLECTING_PHONE'
      };
    }

    case 'COLLECTING_PHONE': {
      // Basic phone validation (at least 10 digits/characters)
      const cleanedPhone = message.replace(/[^0-9+]/g, '');
      if (cleanedPhone.length < 10) {
        return {
          text: "That phone number looks a bit short. Please enter a valid 10-digit mobile number:",
          options: [],
          step: 'COLLECTING_PHONE'
        };
      }

      data.patient_phone = message;
      saveSession(sessionId, 'CONFIRMING', data);

      const formattedDate = formatSlotDate(data.selected_slot_date);

      return {
        text: `Awesome, thank you! Let's double-check your appointment details before we finalize:\n\n` +
          `🏥 **Clinic**: ReliefNow Chiropractic, Hyderabad\n` +
          `👨‍⚕️ **Therapy**: ${data.service_name}\n` +
          `📅 **Date**: ${formattedDate}\n` +
          `⏰ **Time**: **${data.selected_slot_time}** (Open late!)\n` +
          `👤 **Patient**: ${data.patient_name}\n` +
          `📱 **Phone**: ${data.patient_phone}\n` +
          `💰 **Consultation Fee**: ₹${data.service_price} (Pay at clinic)\n\n` +
          `Should I confirm this booking for you?`,
        options: [
          { label: '✅ Yes, Confirm Booking!', value: 'confirm' },
          { label: '🔄 No, Start Over', value: 'restart' }
        ],
        step: 'CONFIRMING'
      };
    }

    case 'CONFIRMING': {
      if (lowercaseMsg.includes('confirm') || lowercaseMsg.includes('yes') || lowercaseMsg === '1') {
        const appointmentId = `appt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // 1. Double check slot is still available
        const slot = db.prepare('SELECT is_booked FROM slots WHERE id = ?').get(data.selected_slot_id);
        if (!slot || slot.is_booked === 1) {
          // Slot was taken in the last 2 minutes!
          saveSession(sessionId, 'QUALIFYING_PAIN', data); // send them back to select slot
          return {
            text: "Oh no! That specific slot was just booked by another patient a moment ago. Let's find another one for you! Click below to see next available slots:",
            options: [{ label: '👉 Show other slots', value: 'show_slots' }],
            step: 'QUALIFYING_PAIN'
          };
        }

        // 2. Insert Appointment
        db.prepare(`
          INSERT INTO appointments (id, patient_name, patient_phone, pain_point, service_id, slot_id, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?)
        `).run(
          appointmentId,
          data.patient_name,
          data.patient_phone,
          data.pain_point,
          data.service_id,
          data.selected_slot_id,
          new Date().toISOString()
        );

        // 3. Mark Slot as Booked
        db.prepare('UPDATE slots SET is_booked = 1 WHERE id = ?').run(data.selected_slot_id);

        // Save state as completed and keep appointment details
        data.last_appointment_id = appointmentId;
        saveSession(sessionId, 'COMPLETED', data);

        const formattedDate = formatSlotDate(data.selected_slot_date);

        return {
          text: `🎉 **Appointment Successfully Confirmed!** 🎉\n\n` +
            `Hi **${data.patient_name}**, you're all set! Here is your digital receipt:\n\n` +
            `🎟️ **Booking ID**: ${appointmentId}\n` +
            `💆 **Service**: ${data.service_name}\n` +
            `📅 **Date**: ${formattedDate}\n` +
            `⏰ **Time**: **${data.selected_slot_time}** (Please arrive 10 mins early)\n` +
            `📍 **Location**: ReliefNow Clinic, 2nd Floor, Road No. 36, Jubilee Hills, Hyderabad (Opposite Metro Pillar 1635)\n\n` +
            `🚗 Free valet parking is available. Since we are open late until **11 PM**, if you hit traffic or are running late, don't worry! We'll be here.\n\n` +
            `💡 *We have sent a confirmation message with directions to your WhatsApp number. See you soon!*`,
          options: [
            { label: '⏰ Simulate 2-Hr Pre-Visit Reminder', value: 'simulate_reminder' },
            { label: '😊 Simulate Post-Visit Care & Rebooking', value: 'simulate_postvisit' },
            { label: '📅 Book Another Appointment', value: 'restart' }
          ],
          step: 'COMPLETED'
        };
      } else {
        // Cancel / Start over
        const refreshedData = {};
        saveSession(sessionId, 'WELCOME', refreshedData);
        return handleChatMessage(sessionId, 'restart');
      }
    }

    case 'COMPLETED': {
      if (lowercaseMsg.includes('reminder')) {
        return {
          text: `🔔 **[SIMULATED WHATSAPP MESSAGE SENT - 2 HOURS BEFORE VISIT]** 🔔\n\n` +
            `*To: ${data.patient_phone} (${data.patient_name})*\n\n` +
            `"Hey **${data.patient_name}**! This is your 2-hour friendly reminder for your **${data.service_name}** today at **${data.selected_slot_time}** at ReliefNow Jubilee Hills. ⏰\n\n` +
            `📍 *Directions*: https://maps.google.com/reliefnow-jubileehills (Next to Metro Pillar 1635)\n` +
            `🚗 Free parking is waiting for you. If you need to reschedule or are running late, just reply to this chat. See you soon!"`,
          options: [
            { label: '😊 Simulate Post-Visit Care & Rebooking', value: 'simulate_postvisit' },
            { label: '📅 Book Another Appointment', value: 'restart' }
          ],
          step: 'COMPLETED'
        };
      } else if (lowercaseMsg.includes('post') || lowercaseMsg.includes('visit') || lowercaseMsg.includes('care')) {
        return {
          text: `📈 **[SIMULATED WHATSAPP MESSAGE SENT - 3 HOURS POST-VISIT UPSELL]** 📈\n\n` +
            `*To: ${data.patient_phone} (${data.patient_name})*\n\n` +
            `"Hi **${data.patient_name}**! We hope your spine is feeling incredibly relieved after your **${data.service_name}** adjustment today at ReliefNow! 😊\n\n` +
            `Our Chiropractor recommends **6 structural alignment sessions** to fully correct posture and prevent chronic pain recurrence. \n\n` +
            `🎁 **Active Patient Special**: Get our **Spinal Wellness Subscription Package** of 5 sessions for only **₹5,000** (normal price: ₹7,500, saves you 33%!).\n\n` +
            `Would you like to lock in this package discount or book your second session for next week?"`,
          options: [
            { label: '💳 Purchase 5-Session Wellness Package', value: 'buy_package' },
            { label: '📅 Book Next Session (₹1,200)', value: 'restart' },
            { label: '🙌 I\'m feeling completely pain-free!', value: 'pain_free' }
          ],
          step: 'COMPLETED'
        };
      } else if (lowercaseMsg.includes('package') || lowercaseMsg.includes('buy')) {
        return {
          text: `🎉 **Wellness Package Activated!** 🎉\n\n` +
            `Thank you, **${data.patient_name}**! Your **Spinal Wellness Subscription Package** (5 Sessions) has been added to your profile. \n\n` +
            `We have credited ₹5,000 to your account. You can use these sessions at any time at our Jubilee Hills clinic. \n\n` +
            `Thank you for prioritizing your spinal health! 🌟`,
          options: [
            { label: '📅 Book Session 2 of 5', value: 'restart' }
          ],
          step: 'COMPLETED'
        };
      } else if (lowercaseMsg.includes('pain_free') || lowercaseMsg.includes('completely')) {
        return {
          text: `That is amazing news! Chiropractic care is not just for acute pain relief, but also for ongoing maintenance and energy. We are thrilled to hear you are feeling great. \n\nRemember, we are open late until **11 PM** for any future alignment checkups. Have a wonderful pain-free week! 🌟`,
          options: [
            { label: '📅 Book Another Appointment', value: 'restart' }
          ],
          step: 'COMPLETED'
        };
      } else {
        // Normal restart
        const refreshedData = {};
        saveSession(sessionId, 'WELCOME', refreshedData);
        return handleChatMessage(sessionId, 'restart');
      }
    }

    default: {
      const refreshedData = {};
      saveSession(sessionId, 'WELCOME', refreshedData);
      return handleChatMessage(sessionId, 'restart');
    }
  }
}
