'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STYLE = `
  .car-form-wrap {
    background: linear-gradient(180deg, rgba(34,26,18,0.98) 0%, rgba(26,22,18,1) 100%);
    border: 1px solid rgba(196,165,116,0.18);
    padding: 34px 30px;
    box-shadow: 0 24px 60px rgba(26,22,18,0.16);
  }
  .car-form-title {
    font-family: 'Cinzel', serif;
    font-size: 1.2rem;
    letter-spacing: 0.08em;
    color: white;
    margin-bottom: 8px;
  }
  .car-form-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.02rem;
    color: rgba(255,255,255,0.66);
    line-height: 1.7;
    margin-bottom: 28px;
  }
  .car-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .car-label {
    display: block;
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.28em;
    color: rgba(242,196,160,0.82);
    margin-bottom: 6px;
  }
  .car-field {
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
  .car-field:focus {
    border-color: #D4956A;
    background: rgba(255,255,255,0.08);
  }
  .car-field::placeholder {
    color: rgba(255,255,255,0.34);
  }
  .car-btn {
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
  .car-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .car-note, .car-error {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.98rem;
    margin-bottom: 14px;
  }
  .car-note {
    color: #f4d3b8;
  }
  .car-error {
    color: #fda4af;
  }
  @media (max-width: 640px) {
    .car-form-wrap {
      padding: 28px 22px;
    }
    .car-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const initialForm = {
  name: '',
  phone: '',
  email: '',
  pickup_city: '',
  pickup_date: '',
  dropoff_date: '',
  car_type: '',
  notes: '',
};

export default function CarRentalForm({ embedded = false }) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const response = await fetch('/api/car-rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Unable to submit car rental request.');
      }

      setStatus('success');
      setForm(initialForm);
      window.setTimeout(() => router.push('/'), 1200);
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  }

  return (
    <>
      <style>{STYLE}</style>
      <div className="car-form-wrap" style={embedded ? { background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 } : undefined}>
        <h2 className="car-form-title">Request A Car</h2>
        <p className="car-form-sub">
          Tell us your city, dates, and car preference. We&apos;ll confirm availability and pricing,
          then bring you back home once your request is sent.
        </p>

        <form onSubmit={handleSubmit}>
          {status === 'success' && <p className="car-note">Request received. Taking you back home.</p>}
          {status === 'error' && <p className="car-error">{error}</p>}

          <div className="car-grid">
            <div>
              <label className="car-label">YOUR NAME</label>
              <input className="car-field" value={form.name} onChange={set('name')} placeholder="Arjun Mehta" required />
            </div>
            <div>
              <label className="car-label">PHONE</label>
              <input className="car-field" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" required />
            </div>
          </div>

          <label className="car-label">EMAIL</label>
          <input className="car-field" type="email" value={form.email} onChange={set('email')} placeholder="arjun@email.com" required />

          <div className="car-grid">
            <div>
              <label className="car-label">PICKUP CITY</label>
              <input className="car-field" value={form.pickup_city} onChange={set('pickup_city')} placeholder="Jaipur" required />
            </div>
            <div>
              <label className="car-label">CAR TYPE</label>
              <select className="car-field" value={form.car_type} onChange={set('car_type')} required>
                <option value="" className='text-black' >Select vehicle</option>
                <option value="sedan" className='text-black' >Sedan</option>
                <option value="suv" className='text-black' >SUV</option>
                <option value="tempo-traveller" className='text-black' >Tempo Traveller</option>
                <option value="luxury" className='text-black' >Luxury Car</option>
              </select>
            </div>
          </div>

          <div className="car-grid">
            <div>
              <label className="car-label">PICKUP DATE</label>
              <input className="car-field" type="date" value={form.pickup_date} onChange={set('pickup_date')} required />
            </div>
            <div>
              <label className="car-label">DROPOFF DATE</label>
              <input className="car-field" type="date" value={form.dropoff_date} onChange={set('dropoff_date')} required />
            </div>
          </div>

          <label className="car-label">NOTES</label>
          <textarea
            className="car-field"
            rows={4}
            value={form.notes}
            onChange={set('notes')}
            placeholder="Airport pickup, outstation route, hotel transfer, number of travellers..."
            style={{ resize: 'vertical' }}
          />

          <button className="car-btn" disabled={status === 'loading'}>
            {status === 'loading' ? 'SENDING REQUEST' : 'SEND CAR RENTAL REQUEST'}
          </button>
        </form>
      </div>
    </>
  );
}
