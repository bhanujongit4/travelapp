'use client';

import { useEffect, useState } from 'react';
import CarRentalForm from '@/app/components/CarRentalForm';

const QR_IMAGES = {
  explorer: '/images/qr/5k.jpeg',
  voyager: '/images/qr/10k.jpeg',
  royal: '/images/qr/15k.jpeg',
};

const TIERS = [
  {
    id: 'explorer',
    label: 'Explorer',
    amount: 5000,
    tagline: 'Begin the journey',
    perks: ['Priority itinerary planning', 'Dedicated travel consultant', 'Flexible rescheduling once'],
  },
  {
    id: 'voyager',
    label: 'Voyager',
    amount: 10000,
    tagline: 'Our most chosen',
    perks: ['Everything in Explorer', 'Complimentary airport transfer', 'Curated welcome hamper on arrival'],
    featured: true,
  },
  {
    id: 'royal',
    label: 'Royal',
    amount: 15000,
    tagline: 'The full experience',
    perks: ['Everything in Voyager', 'Private guide for entire trip', 'Heritage hotel upgrade where available'],
  },
];

const STYLE = `
  .inq-wrap { background:linear-gradient(135deg,#2a1f14,#1a1612); padding:56px 48px; max-width:760px; margin:0 auto; }
  .inq-tabs { display:flex; gap:10px; margin-bottom:28px; border-bottom:1px solid rgba(196,165,116,0.18); padding-bottom:12px; }
  .inq-tab { border:1px solid rgba(196,165,116,0.24); background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.7); padding:10px 16px; font-family:'Cinzel',serif; font-size:0.64rem; letter-spacing:0.18em; cursor:pointer; transition:all 0.2s; }
  .inq-tab.active { background:linear-gradient(135deg, rgba(212,149,106,0.16), rgba(184,115,51,0.18)); border-color:rgba(196,165,116,0.5); color:#F2C4A0; }
  .inq-tab:hover { color:#F2C4A0; border-color:rgba(196,165,116,0.42); }
  .inq-title { font-family:'Cinzel',serif; font-size:clamp(1.2rem,2.5vw,1.6rem); font-weight:400; color:white; margin-bottom:8px; letter-spacing:0.05em; }
  .inq-sub { font-family:'Cormorant Garamond',serif; font-size:1rem; color:rgba(255,255,255,0.6); margin-bottom:36px; }
  .inq-field { width:100%; background:rgba(255,255,255,0.07); border:1px solid rgba(196,165,116,0.35); padding:14px 18px; font-family:'Cormorant Garamond',serif; font-size:1rem; color:white; outline:none; transition:border-color 0.25s; box-sizing:border-box; margin-bottom:16px; display:block; }
  .inq-field:focus { border-color:#D4956A; }
  .inq-field::placeholder { color:rgba(255,255,255,0.35); }
  .inq-field[readonly] { background:rgba(196,165,116,0.1); color:rgba(255,255,255,0.5); cursor:default; }
  .inq-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .inq-label { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.3em; color:rgba(196,165,116,0.8); display:block; margin-bottom:6px; }
  .tier-section { margin-bottom:28px; }
  .tier-section-label { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.3em; color:rgba(196,165,116,0.8); margin-bottom:14px; display:block; }
  .tier-optional { font-family:'Cormorant Garamond',serif; font-size:0.85rem; color:rgba(255,255,255,0.35); margin-left:10px; font-style:italic; letter-spacing:0; }
  .tier-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
  .tier-card { border:1px solid rgba(196,165,116,0.2); padding:20px 16px; cursor:pointer; transition:all 0.25s; position:relative; background:rgba(255,255,255,0.03); }
  .tier-card:hover { border-color:rgba(196,165,116,0.5); background:rgba(196,165,116,0.06); }
  .tier-card.selected { border-color:#D4956A; background:rgba(212,149,106,0.1); }
  .tier-card.featured-tier { border-color:rgba(196,165,116,0.45); }
  .tier-badge { position:absolute; top:-10px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#D4956A,#B87333); color:white; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.2em; padding:3px 10px; white-space:nowrap; }
  .tier-name { font-family:'Cinzel',serif; font-size:0.85rem; color:white; margin-bottom:4px; letter-spacing:0.05em; }
  .tier-amount { font-family:'Cinzel',serif; font-size:1.3rem; color:#F2C4A0; margin-bottom:4px; }
  .tier-tagline { font-family:'Cormorant Garamond',serif; font-size:0.82rem; color:rgba(255,255,255,0.45); margin-bottom:12px; font-style:italic; }
  .tier-perks { list-style:none; padding:0; margin:0; }
  .tier-perk { font-family:'Cormorant Garamond',serif; font-size:0.82rem; color:rgba(255,255,255,0.6); margin-bottom:5px; display:flex; gap:6px; }
  .tier-perk::before { content:'◆'; color:#D4956A; font-size:0.55rem; flex-shrink:0; margin-top:3px; }
  .tier-deselect { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; color:rgba(196,165,116,0.5); background:none; border:none; cursor:pointer; margin-top:14px; display:block; transition:color 0.2s; }
  .tier-deselect:hover { color:#D4956A; }
  .inq-btn { width:100%; background:linear-gradient(135deg,#D4956A,#B87333); color:white; border:none; padding:16px; font-family:'Cinzel',serif; font-size:0.78rem; letter-spacing:0.25em; cursor:pointer; margin-top:8px; transition:opacity 0.25s; }
  .inq-btn:hover { opacity:0.88; }
  .inq-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .inq-success { text-align:center; padding:32px 0; font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:#F2C4A0; }
  .inq-err { color:#f87171; font-family:'Cormorant Garamond',serif; font-size:0.95rem; margin-bottom:12px; }
  .pay-screen { text-align:center; }
  .pay-eyebrow { font-family:'Cinzel',serif; font-size:0.68rem; letter-spacing:0.35em; color:#F2C4A0; margin-bottom:16px; }
  .pay-title { font-family:'Cinzel',serif; font-size:clamp(1.2rem,2.5vw,1.7rem); color:white; font-weight:400; margin-bottom:8px; }
  .pay-sub { font-family:'Cormorant Garamond',serif; font-size:1rem; color:rgba(255,255,255,0.55); margin-bottom:32px; }
  .pay-qr { width:220px; height:220px; border:2px solid rgba(196,165,116,0.4); margin:0 auto 24px; display:flex; align-items:center; justify-content:center; background:white; padding:12px; box-sizing:border-box; }
  .pay-qr img { width:100%; height:100%; object-fit:contain; }
  .pay-qr-placeholder { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.2em; color:#999; text-align:center; line-height:1.8; }
  .pay-amount { font-family:'Cinzel',serif; font-size:2rem; color:#F2C4A0; margin-bottom:4px; }
  .pay-amount-note { font-family:'Cormorant Garamond',serif; font-size:0.9rem; color:rgba(255,255,255,0.4); margin-bottom:28px; }
  .pay-timer { font-family:'Cinzel',serif; font-size:1.4rem; color:white; margin-bottom:4px; transition:color 0.3s; }
  .pay-timer.urgent { color:#f87171; }
  .pay-timer-label { font-family:'Cormorant Garamond',serif; font-size:0.85rem; color:rgba(255,255,255,0.4); margin-bottom:24px; }
  .pay-divider { width:60px; height:1px; background:linear-gradient(90deg,transparent,rgba(196,165,116,0.4),transparent); margin:24px auto; }
  .pay-instructions { font-family:'Cormorant Garamond',serif; font-size:0.95rem; color:rgba(255,255,255,0.5); line-height:1.7; max-width:360px; margin:0 auto; }
  .confirm-screen { text-align:center; padding:32px 0; }
  .confirm-icon { font-size:2.5rem; margin-bottom:20px; }
  .confirm-title { font-family:'Cinzel',serif; font-size:1.2rem; color:white; font-weight:400; margin-bottom:12px; letter-spacing:0.05em; }
  .confirm-body { font-family:'Cormorant Garamond',serif; font-size:1.05rem; color:rgba(255,255,255,0.65); line-height:1.8; max-width:420px; margin:0 auto 20px; }
  .confirm-countdown { font-family:'Cinzel',serif; font-size:0.68rem; letter-spacing:0.2em; color:rgba(196,165,116,0.6); }
  @media(max-width:640px) {
    .inq-row{grid-template-columns:1fr;}
    .tier-grid{grid-template-columns:1fr;}
    .inq-wrap{padding:40px 24px;}
    .inq-tabs{flex-wrap:wrap;}
    .inq-tab{flex:1 1 auto;}
  }
`;

function fmt(n) {
  return '\u20B9' + n.toLocaleString('en-IN');
}

function fmtTime(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function PaymentScreen({ tier, onExpired }) {
  const TOTAL = 5 * 60;
  const [secs, setSecs] = useState(TOTAL);
  const [confirming, setConfirming] = useState(false);
  const [confirmSecs, setConfirmSecs] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => setSecs((s) => {
      if (s <= 1) {
        clearInterval(timer);
        setConfirming(true);
        return 0;
      }
      return s - 1;
    }), 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!confirming) return undefined;

    const timer = setInterval(() => setConfirmSecs((s) => {
      if (s <= 1) {
        clearInterval(timer);
        onExpired();
        return 0;
      }
      return s - 1;
    }), 1000);

    return () => clearInterval(timer);
  }, [confirming, onExpired]);

  if (confirming) {
    return (
      <div className="confirm-screen">
        <div className="confirm-icon">✦</div>
        <h3 className="confirm-title">We'll Be In Touch</h3>
        <p className="confirm-body">
          Thank you for your interest in the <strong style={{ color: '#F2C4A0' }}>{tier.label}</strong> package.
          Once we confirm your payment, our team will reach out within 24 hours to begin planning your journey.
        </p>
        <p className="confirm-countdown">Redirecting in {confirmSecs}s...</p>
      </div>
    );
  }

  const qr = QR_IMAGES[tier.id];

  return (
    <div className="pay-screen">
      <p className="pay-eyebrow">ADVANCE PAYMENT</p>
      <h3 className="pay-title">{tier.label} Package - {fmt(tier.amount)}</h3>
      <p className="pay-sub">Scan the QR code to pay your advance. The balance is collected on arrival.</p>
      <div className="pay-qr">
        {qr
          ? <img src={qr} alt={tier.label} />
          : <p className="pay-qr-placeholder">ADD YOUR QR IMAGE TO<br />/public/qr/qr-{tier.amount}.png</p>}
      </div>
      <p className="pay-amount">{fmt(tier.amount)}</p>
      <p className="pay-amount-note">Advance only · Balance due on arrival</p>
      <p className={`pay-timer${secs <= 60 ? ' urgent' : ''}`}>{fmtTime(secs)}</p>
      <p className="pay-timer-label">Time remaining to complete payment</p>
      <div className="pay-divider" />
      <p className="pay-instructions">
        After paying, screenshot your confirmation and share it with us on WhatsApp or email.
        Our team will verify and confirm your booking within a few hours.
      </p>
    </div>
  );
}

export default function InquiryForm({ interestPlace }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [selectedTier, setSelectedTier] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');
  const [activeTab, setActiveTab] = useState('journey');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setStatus('loading');
    setErrMsg('');

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          interest_place: interestPlace,
          tier: selectedTier?.id || null,
          tier_amount: selectedTier?.amount || null,
          payment_status: selectedTier ? 'pending' : 'none',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus(selectedTier ? 'payment' : 'success');
    } catch (err) {
      setErrMsg(err.message);
      setStatus('error');
    }
  }

  const tabs = (
    <div className="inq-tabs">
      <button type="button" className={`inq-tab${activeTab === 'journey' ? ' active' : ''}`} onClick={() => setActiveTab('journey')}>
        Journey Inquiry
      </button>
      <button type="button" className={`inq-tab${activeTab === 'car' ? ' active' : ''}`} onClick={() => setActiveTab('car')}>
        Car Rental
      </button>
    </div>
  );

  if (status === 'success') {
    return (
      <>
        <style>{STYLE}</style>
        <div className="inq-wrap">
          {tabs}
          <div className="inq-success">✦ &nbsp; Thank you. We will be in touch shortly regarding <em>{interestPlace}</em>.</div>
        </div>
      </>
    );
  }

  if (status === 'payment') {
    return (
      <>
        <style>{STYLE}</style>
        <div className="inq-wrap">
          {tabs}
          <PaymentScreen tier={selectedTier} onExpired={() => { window.location.href = '/'; }} />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLE}</style>
      <div className="inq-wrap">
        {tabs}
        {activeTab === 'car' ? (
          <CarRentalForm embedded />
        ) : (
          <>
            <p className="inq-title">Plan Your Journey</p>
            <p className="inq-sub">Enquire about <strong style={{ color: '#F2C4A0' }}>{interestPlace}</strong> - our team responds within 24 hours.</p>
            <form onSubmit={submit}>
              {status === 'error' && <p className="inq-err">⚠ {errMsg}</p>}
              <div className="inq-row">
                <div>
                  <label className="inq-label">YOUR NAME</label>
                  <input className="inq-field" placeholder="Arjun Mehta" value={form.name} onChange={set('name')} required />
                </div>
                <div>
                  <label className="inq-label">PHONE NUMBER</label>
                  <input className="inq-field" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} required />
                </div>
              </div>
              <label className="inq-label">EMAIL ADDRESS</label>
              <input className="inq-field" type="email" placeholder="arjun@email.com" value={form.email} onChange={set('email')} required />
              <label className="inq-label">DESTINATION</label>
              <input className="inq-field" value={interestPlace} readOnly />

              <div className="tier-section">
                <span className="tier-section-label">
                  RESERVE WITH ADVANCE PAYMENT
                  <span className="tier-optional">optional</span>
                </span>
                <div className="tier-grid">
                  {TIERS.map((tier) => (
                    <div
                      key={tier.id}
                      className={`tier-card${tier.featured ? ' featured-tier' : ''}${selectedTier?.id === tier.id ? ' selected' : ''}`}
                      onClick={() => setSelectedTier((t) => (t?.id === tier.id ? null : tier))}
                    >
                      {tier.featured && <span className="tier-badge">MOST POPULAR</span>}
                      <p className="tier-name">{tier.label}</p>
                      <p className="tier-amount">{fmt(tier.amount)}</p>
                      <p className="tier-tagline">{tier.tagline}</p>
                      <ul className="tier-perks">
                        {tier.perks.map((perk, i) => <li key={i} className="tier-perk">{perk}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                {selectedTier && (
                  <button type="button" className="tier-deselect" onClick={() => setSelectedTier(null)}>
                    ✕ &nbsp; REMOVE ADVANCE PAYMENT
                  </button>
                )}
              </div>

              <label className="inq-label">MESSAGE (OPTIONAL)</label>
              <textarea className="inq-field" rows={3} placeholder="Dates, group size, special requirements..." value={form.message} onChange={set('message')} style={{ resize: 'vertical' }} />
              <button className="inq-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'SENDING...' : selectedTier ? `ENQUIRE & PAY ${fmt(selectedTier.amount)} ADVANCE` : 'SEND ENQUIRY'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
