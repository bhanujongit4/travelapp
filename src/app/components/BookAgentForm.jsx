'use client';

import { useState } from 'react';

const STYLE = `
  .agent-form-wrap {
    background: linear-gradient(180deg, rgba(34,26,18,0.98) 0%, rgba(26,22,18,1) 100%);
    border: 1px solid rgba(196,165,116,0.18);
    padding: 34px 30px;
    box-shadow: 0 24px 60px rgba(26,22,18,0.16);
  }
  .agent-form-title {
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
    letter-spacing: 0.08em;
    color: white;
    margin-bottom: 8px;
  }
  .agent-form-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.02rem;
    color: rgba(255,255,255,0.66);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  .agent-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .agent-label {
    display: block;
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.28em;
    color: rgba(242,196,160,0.82);
    margin-bottom: 6px;
  }
  .agent-field {
    width: 100%;
    display: block;
    box-sizing: border-box;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(196,165,116,0.24);
    padding: 14px 16px;
    color: white;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 16px;
  }
  .agent-field:focus {
    border-color: #D4956A;
    background: rgba(255,255,255,0.08);
  }
  .agent-field::placeholder {
    color: rgba(255,255,255,0.34);
  }
  .agent-btn {
    width: 100%;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #D4956A, #B87333);
    color: white;
    padding: 16px 20px;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.28em;
    margin-top: 8px;
  }
  .agent-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .agent-note, .agent-error {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.98rem;
    margin-bottom: 14px;
  }
  .agent-note {
    color: #f4d3b8;
  }
  .agent-error {
    color: #fda4af;
  }
  @media (max-width: 640px) {
    .agent-form-wrap {
      padding: 28px 22px;
    }
    .agent-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const initialForm = {
  name: '',
  phone: '',
  email: '',
  destination: '',
  travel_date: '',
  travellers: '',
  budget: '',
  notes: '',
};

export default function BookAgentForm({ embedded = false }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/book-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Unable to submit booking request.');
      }

      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  return (
    <>
      <style>{STYLE}</style>
      <div
        className="agent-form-wrap"
        style={embedded ? { background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 } : undefined}
      >
        <h2 className="agent-form-title">Book A Guide</h2>
        <p className="agent-form-sub">
          Share your preferred route and dates. A dedicated travel guide will contact you to finalize your itinerary.
        </p>

        <form onSubmit={handleSubmit}>
          {status === 'success' && <p className="agent-note">Request received. Our travel guide will contact you shortly.</p>}
          {status === 'error' && <p className="agent-error">{error}</p>}

          <div className="agent-grid">
            <div>
              <label className="agent-label">YOUR NAME</label>
              <input className="agent-field" value={form.name} onChange={set('name')} placeholder="Arjun Mehta" required />
            </div>
            <div>
              <label className="agent-label">PHONE</label>
              <input className="agent-field" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" required />
            </div>
          </div>

          <label className="agent-label">EMAIL</label>
          <input className="agent-field" type="email" value={form.email} onChange={set('email')} placeholder="arjun@email.com" required />

          <div className="agent-grid">
            <div>
              <label className="agent-label">DESTINATION</label>
              <input className="agent-field" value={form.destination} onChange={set('destination')} placeholder="Delhi - Jaipur - Agra" required />
            </div>
            <div>
              <label className="agent-label">TRAVEL DATE</label>
              <input className="agent-field" type="date" value={form.travel_date} onChange={set('travel_date')} required />
            </div>
          </div>

          <div className="agent-grid">
            <div>
              <label className="agent-label">NO. OF TRAVELLERS</label>
              <input className="agent-field" value={form.travellers} onChange={set('travellers')} placeholder="2 Adults, 1 Child" required />
            </div>
            <div>
              <label className="agent-label">BUDGET (OPTIONAL)</label>
              <input className="agent-field" value={form.budget} onChange={set('budget')} placeholder="INR 1,50,000 - 2,00,000" />
            </div>
          </div>

          <label className="agent-label">NOTES</label>
          <textarea
            className="agent-field"
            rows={4}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Hotel preference, pickup city, flight details, special requests..."
            style={{ resize: 'vertical' }}
          />

          <button className="agent-btn" disabled={status === 'loading'}>
            {status === 'loading' ? 'SENDING REQUEST' : 'SEND GUIDE REQUEST'}
          </button>
        </form>
      </div>
    </>
  );
}
