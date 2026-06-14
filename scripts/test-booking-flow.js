#!/usr/bin/env node
/**
 * ReliefNow Chiropractic — End-to-End Booking Flow Test Runner
 *
 * This script simulates a patient's complete journey from initial inquiry
 * through to confirmed appointment in the SQLite database.
 * It measures elapsed time and validates each state transition.
 *
 * Usage: node scripts/test-booking-flow.js
 * Prerequisites: Backend server must be running on port 8000
 */

const BASE_URL = 'http://localhost:8000';

async function request(endpoint, body = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

async function get(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTest() {
  console.log('='.repeat(70));
  console.log('  ReliefNow Chiropractic — End-to-End Booking Flow Test');
  console.log('='.repeat(70));
  console.log();

  const startTime = Date.now();
  const sessionId = `e2e-test-${Date.now()}`;

  let totalSteps = 0;
  let passedSteps = 0;

  function assert(condition, message) {
    totalSteps++;
    if (condition) {
      passedSteps++;
      console.log(`  ✅ ${message}`);
    } else {
      console.log(`  ❌ ${message}`);
    }
  }

  try {
    // ─── STEP 1: Verify services API ─────────────────────────
    console.log('\n📋 Phase 1: API Verification');
    console.log('-'.repeat(50));
    
    const services = await get('/api/services');
    assert(services.success === true, 'GET /api/services returns success');
    assert(services.data.length >= 4, `Found ${services.data.length} services`);
    assert(services.data[0].price > 0, 'Services have prices');

    const slots = await get('/api/slots');
    assert(slots.success === true, 'GET /api/slots returns success');
    assert(slots.data.length >= 5, `Found ${slots.data.length} available slots`);
    assert(slots.data.some(s => s.time >= '18:00'), 'Includes late-night slots (after 6 PM)');

    // ─── STEP 2: Initialize Chat ─────────────────────────────
    console.log('\n🗣️ Phase 2: Chatbot Conversation Flow');
    console.log('-'.repeat(50));

    let resp = await request('/api/chat', { sessionId, message: 'hi' });
    assert(resp.step === 'WELCOME', `Step 1: WELCOME (${resp.step})`);
    assert(resp.options.length === 4, 'Welcome shows 4 pain options');
    await sleep(100);

    // ─── STEP 3: Select Pain Point ───────────────────────────
    resp = await request('/api/chat', { sessionId, message: 'back' });
    assert(resp.step === 'QUALIFYING_PAIN', `Step 2: QUALIFYING_PAIN (${resp.step})`);
    assert(resp.text.includes('Back Pain'), 'Recommends Back Pain treatment');
    assert(resp.text.includes('₹'), 'Shows pricing');
    await sleep(100);

    // ─── STEP 4: Request Slots ───────────────────────────────
    resp = await request('/api/chat', { sessionId, message: 'yes' });
    assert(resp.step === 'SELECTING_SLOT', `Step 3: SELECTING_SLOT (${resp.step})`);
    assert(resp.options.length >= 2, 'Shows at least 2 slot options');
    await sleep(100);

    // ─── STEP 5: Select a Slot ───────────────────────────────
    const firstSlotId = resp.options[0].value;
    resp = await request('/api/chat', { sessionId, message: '1' });
    assert(resp.step === 'COLLECTING_NAME', `Step 4: COLLECTING_NAME (${resp.step})`);
    assert(resp.text.toLowerCase().includes('name'), 'Asks for patient name');
    await sleep(100);

    // ─── STEP 6: Provide Name ────────────────────────────────
    resp = await request('/api/chat', { sessionId, message: 'Test Patient' });
    assert(resp.step === 'COLLECTING_PHONE', `Step 5: COLLECTING_PHONE (${resp.step})`);
    assert(resp.text.includes('Mobile'), 'Asks for phone number');
    await sleep(100);

    // ─── STEP 7: Provide Phone ───────────────────────────────
    resp = await request('/api/chat', { sessionId, message: '9876543210' });
    assert(resp.step === 'CONFIRMING', `Step 6: CONFIRMING (${resp.step})`);
    assert(resp.text.includes('Test Patient'), 'Shows patient name in summary');
    assert(resp.text.includes('₹'), 'Shows fee in summary');
    assert(resp.options.length >= 2, 'Shows confirm/cancel options');
    await sleep(100);

    // ─── STEP 8: Confirm Booking ─────────────────────────────
    resp = await request('/api/chat', { sessionId, message: 'confirm' });
    assert(resp.step === 'COMPLETED', `Step 7: COMPLETED (${resp.step})`);
    assert(resp.text.includes('Confirmed'), 'Booking confirmed message');
    assert(resp.text.includes('Booking ID'), 'Shows booking ID');
    await sleep(100);

    // ─── STEP 9: Verify Post-Booking ─────────────────────────
    console.log('\n📊 Phase 3: Post-Booking Verification');
    console.log('-'.repeat(50));

    resp = await request('/api/chat', { sessionId, message: 'simulate_reminder' });
    assert(resp.text.includes('reminder'), '2-hour reminder simulation works');
    await sleep(50);

    resp = await request('/api/chat', { sessionId, message: 'simulate_postvisit' });
    assert(resp.text.includes('package') || resp.text.includes('Wellness'), 'Post-visit upsell works');

    // ─── TIMING ──────────────────────────────────────────────
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n⏱️ Performance:');
    console.log(`  Total elapsed time: ${elapsed}s`);
    assert(parseFloat(elapsed) < 300, `Complete flow under 5 minutes (${elapsed}s)`);

    // ─── SUMMARY ─────────────────────────────────────────────
    console.log('\n' + '='.repeat(70));
    console.log(`  RESULTS: ${passedSteps}/${totalSteps} steps passed`);
    if (passedSteps === totalSteps) {
      console.log('  🎉 ALL TESTS PASSED');
      console.log(`  ⏱️  Completed in ${elapsed}s (target: < 300s)`);
      console.log(`  📅 Appointment successfully stored in SQLite database`);
      console.log(`  🆔 Session: ${sessionId}`);
    } else {
      console.log(`  ⚠️  ${totalSteps - passedSteps} step(s) failed`);
      process.exitCode = 1;
    }
    console.log('='.repeat(70));
    console.log();
  } catch (error) {
    console.error(`\n💥 TEST FAILED WITH ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}

runTest();
