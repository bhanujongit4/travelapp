'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

// ─── COLOUR & TYPOGRAPHY TOKENS ───────────────────────────────────────────────
// Rose-gold palette + ivory/white, serif fonts to match hero's "font-serif" class
// We import Cormorant Garamond (regal serif) + Cinzel (display caps) via Google Fonts
// injected via a <style> tag inside the component.

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

  :root {
    --rg-light:  #F2C4A0;
    --rg-mid:    #D4956A;
    --rg-deep:   #B87333;
    --rg-gold:   #C4A574;
    --ivory:     #FAF7F2;
    --cream:     #F0EBE1;
    --charcoal:  #1A1612;
    --warm-gray: #6B5D54;
  }

  .india-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .india-page {
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: var(--charcoal);
    background: var(--ivory);
  }

  /* ── Display headings ── */
  .cinzel { font-family: 'Cinzel', serif; }

  /* ── Rose-gold divider ── */
  .rg-divider {
    width: 80px; height: 2px;
    background: linear-gradient(90deg, transparent, var(--rg-mid), transparent);
    margin: 0 auto;
  }

  /* ── Ornamental line ── */
  .ornament {
    display: flex; align-items: center; gap: 16px;
    color: var(--rg-mid); font-size: 0.78rem; letter-spacing: 0.4em;
  }
  .ornament::before, .ornament::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent, var(--rg-mid));
  }
  .ornament::after { background: linear-gradient(90deg, var(--rg-mid), transparent); }

  /* ── Image placeholder ── */
  .img-box {
    background: linear-gradient(135deg, #e8ddd3 0%, #d4c5b8 50%, #c8b8a8 100%);
    position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
  }
  .img-box::after {
    content: attr(data-label);
    position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
    font-family: 'Cinzel', serif; font-size: 0.72rem; letter-spacing: 0.25em;
    color: #ffffff !important; opacity: 1 !important; z-index: 3;
    text-shadow: 0 2px 12px rgba(0,0,0,0.7); white-space: nowrap;
  }
  .img-box[data-label]::after { color: #ffffff !important; }
  .img-box svg { opacity: 0.25; }

  /* ── CTA Button ── */
  .btn-rg {
    display: inline-block;
    border: 1.5px solid var(--rg-mid);
    padding: 14px 44px;
    font-family: 'Cinzel', serif; font-size: 0.78rem; letter-spacing: 0.25em;
    color: var(--rg-mid); background: transparent;
    cursor: pointer; transition: all 0.3s ease;
    text-decoration: none;
  }
  .btn-rg:hover { background: var(--rg-mid); color: white; }

  .btn-rg-fill {
    display: inline-block;
    background: linear-gradient(135deg, var(--rg-mid), var(--rg-deep));
    padding: 14px 44px;
    font-family: 'Cinzel', serif; font-size: 0.78rem; letter-spacing: 0.25em;
    color: white; border: none; cursor: pointer; transition: all 0.3s ease;
  }
  .btn-rg-fill:hover { opacity: 0.88; }

  /* ── Destination card ── */
    .dest-card { position: relative; overflow: hidden; cursor: default; }
  .dest-img { transition: none; transform: none; }
  .dest-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(26,22,18,0.82) 0%, rgba(26,22,18,0.28) 60%, transparent 100%);
    opacity: 1; transition: none;
    display: flex; flex-direction: column; justify-content: flex-end; padding: 28px;
  }
  /* ── Tour package card ── */
  .pkg-card {
    background: white; border: 1px solid #e8e0d8;
    transition: box-shadow 0.3s, transform 0.3s;
  }
  .pkg-card:hover { box-shadow: 0 20px 60px rgba(180,120,60,0.15); transform: translateY(-4px); }

  /* ── Stats ── */
  .stat-item { border-right: 1px solid rgba(196,165,116,0.3); }
  .stat-item:last-child { border-right: none; }

  /* ── Testimonial ── */
  .testimonial-card {
    background: white; border-top: 3px solid var(--rg-mid);
    padding: 40px; position: relative;
  }
  .testimonial-card::before {
    content: '"'; font-family: 'Cormorant Garamond', serif; font-size: 6rem;
    line-height: 1; color: var(--rg-light); position: absolute; top: 8px; left: 28px;
  }
  .testimonial-slider { max-width: 920px; margin: 0 auto; }
  .testimonial-nav { display: flex; justify-content: center; align-items: center; gap: 14px; margin-top: 26px; }
  .testimonial-arrow {
    width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(212,149,106,0.4);
    background: white; color: var(--rg-deep); cursor: pointer; font-size: 1.1rem;
  }
  .testimonial-dots { display: flex; gap: 8px; }
  .testimonial-dot {
    width: 10px; height: 10px; border-radius: 50%; border: none; cursor: pointer;
    background: rgba(184,115,51,0.25);
  }
  .testimonial-dot.active { background: var(--rg-deep); }
  .testimonial-image-wrap {
    width: 100%; min-height: 260px; background: var(--cream); border: 1px solid #efe6dc;
    display: flex; align-items: center; justify-content: center; padding: 16px; margin-bottom: 22px;
  }
  .testimonial-image {
    width: 100%; max-height: 360px; object-fit: contain; display: block; background: var(--cream);
  }

  /* ── Process step ── */
  .process-num {
    width: 64px; height: 64px; border: 1.5px solid var(--rg-mid);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-family: 'Cinzel', serif; font-size: 1.1rem; color: var(--rg-mid);
    flex-shrink: 0;
  }

  /* ── Section spacing ── */
  .section { padding: 100px 0; }
  .section-sm { padding: 60px 0; }
  .container { width: 100%; max-width: 1280px; margin: 0 auto; padding: 0 40px; }

  /* ── Dark section ── */
  .section-dark { background: var(--charcoal); color: white; }
  .section-dark .rg-divider { background: linear-gradient(90deg, transparent, var(--rg-light), transparent); }
  .section-cream { background: var(--cream); }
  .section-rg { background: linear-gradient(135deg, #2a1f14, #1a1612); color: white; }

  /* ── Grid helpers ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
  .destinations-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto; gap: 16px; }
  .feature-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 640px; }
  .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .story-image-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 36px; }
  .process-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; }
  .andaman-grid { display: grid; grid-template-columns: 1fr 1fr; }
  .andaman-images { display: grid; grid-template-rows: 1fr 1fr; }
  .newsletter-section { padding: 100px 40px; text-align: center; }
  .newsletter-form { display: flex; gap: 0; max-width: 520px; margin: 0 auto; justify-content: center; }
  .footer-shell { padding: 80px 40px 40px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 64px; }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }

  @media (max-width: 1024px) {
    .grid-4, .stats-grid, .process-grid { grid-template-columns: repeat(2, 1fr); }
    .grid-3, .destinations-grid, .footer-grid { grid-template-columns: repeat(2, 1fr); }
    .grid-2, .feature-grid, .story-grid, .andaman-grid { grid-template-columns: 1fr; }
    .feature-grid { min-height: auto; }
    .story-grid { gap: 40px; }
  }

  @media (max-width: 768px) {
    .container { padding: 0 20px; }
    .section { padding: 60px 0; }
    .section-sm { padding: 40px 0; }
    .grid-4, .grid-3, .grid-2, .stats-grid, .destinations-grid, .story-image-grid, .process-grid, .footer-grid {
      grid-template-columns: 1fr;
    }
    .destinations-grid { grid-template-rows: none; }
    .stat-item {
      border-right: none;
      border-bottom: 1px solid rgba(196,165,116,0.3);
    }
    .stat-item:last-child { border-bottom: none; }
    .newsletter-section, .footer-shell { padding-left: 20px; padding-right: 20px; }
    .newsletter-form { flex-direction: column; max-width: 100%; gap: 12px; }
    .footer-bottom { justify-content: center; text-align: center; }
    .feature-grid > .img-box {
      min-height: 320px !important;
    }
    .andaman-images { grid-template-rows: 280px 280px; }
  }

  @media (max-width: 480px) {
    .btn-rg, .btn-rg-fill {
      width: 100%;
      text-align: center;
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  /* ── Horizontal rule ornament ── */
  hr.fancy {
    border: none; height: 1px;
    background: linear-gradient(90deg, transparent, var(--rg-light), var(--rg-mid), var(--rg-light), transparent);
    margin: 0;
  }
`;

// ─── SVG placeholder icon ─────────────────────────────────────────────────────
// ─── DATA ──────────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { name: 'Kerala', tagline: 'God\'s Own Country', desc: '14 nights of backwaters, spice trails & Ayurveda', height: 480, label: 'KERALA — BACKWATERS & BEYOND' },
  { name: 'Lakshadweep', tagline: 'The Coral Crown', desc: 'Pristine atolls, bioluminescent shores & silence', height: 320, label: 'LAKSHADWEEP — AGATTI ISLANDS' },
  { name: 'Rajasthan', tagline: 'The Royal Heartland', desc: 'Palaces, sand dunes & the grandeur of a lost empire', height: 320, label: 'RAJASTHAN — JAIPUR TO JAISALMER' },
  { name: 'Ladakh', tagline: 'Roof of the World', desc: 'Monasteries, moonscapes & the Pangong lake at dawn', height: 400, label: 'LADAKH — LEH & THE NUBRA VALLEY' },
  { name: 'Andaman', tagline: 'The Emerald Necklace', desc: 'Turquoise shallows, WWII relics & diving at Havelock', height: 400, label: 'ANDAMAN — HAVELOCK & NEIL ISLAND' },
  { name: 'Varanasi', tagline: 'The Eternal City', desc: 'Ghats, Ganga Aarti & the oldest living city on earth', height: 480, label: 'VARANASI — DAWN ON THE GANGES' },
];

const PACKAGES = [
  {
    title: 'Kerala & Lakshadweep Splendour',
    days: '16 Days / 15 Nights',
    price: '₹ 1,85,000',
    per: 'per person twin-sharing',
    tags: ['Backwaters', 'Ayurveda', 'Coral Reefs', 'Houseboat'],
    highlights: [
      'Private houseboat on Alleppey backwaters — 2 nights',
      'Agatti Island seaplane transfer from Kochi',
      'Full-board beach villa at Bangaram Island Resort',
      'Kathakali performance & backstage artist access',
      'Silent Valley forest walk with naturalist guide',
      'Glass-bottom boat snorkelling over Kavaratti Reef',
    ],
    badge: 'BESTSELLER',
  },
  {
    title: 'Royal Rajasthan Grand Circuit',
    days: '14 Days / 13 Nights',
    price: '₹ 2,20,000',
    per: 'per person twin-sharing',
    tags: ['Heritage Hotels', 'Camel Safari', 'Cuisine', 'Polo'],
    highlights: [
      'Suite nights at Taj Lake Palace, Udaipur',
      'Private sunrise hot-air balloon over Pushkar',
      'Camel caravan camp under stars at Sam Dunes',
      'Personal shopper session in Jodhpur\'s old bazaar',
      'Elephant conservation morning at Amer Fort',
      'Exclusive dinner at Umaid Bhawan\'s private terrace',
    ],
    badge: 'LUXURY',
  },
  {
    title: 'Himalayan Ladakh Odyssey',
    days: '10 Days / 9 Nights',
    price: '₹ 1,40,000',
    per: 'per person twin-sharing',
    tags: ['Trekking', 'Monasteries', 'Camping', 'Photography'],
    highlights: [
      'Acclimatisation at premium glamping camp near Leh',
      'Private blessing at Hemis Monastery with head lama',
      'Kayaking on the confluence of Zanskar & Indus',
      'Night shoot at Pangong Tso under Milky Way',
      'Nubra Valley sand-dune sunrise camel ride',
      'Khardung La pass crossing — world\'s highest motorable road',
    ],
    badge: 'ADVENTURE',
  },
];

const EXPERIENCES = [
  { icon: '🌿', title: 'Wellness & Ayurveda', desc: 'Curated Panchakarma retreats in century-old Kerala tharavads under certified Vaidyas.' },
  { icon: '🍛', title: 'Culinary Journeys', desc: 'Private cooking classes with Rajasthani royal families, spice market tours in Kochi & Mughal kitchen experiences in Lucknow.' },
  { icon: '🦁', title: 'Wildlife Encounters', desc: 'Tiger tracking at Ranthambore, elephant dawn walks at Periyar & sloth bear sightings in Satpura — all with expert naturalists.' },
  { icon: '🏛️', title: 'Heritage Immersions', desc: 'Private after-hours access to Hampi ruins, Konark Sun Temple night photography & a private zamindar estate dinner in Kolkata.' },
  { icon: '⛵', title: 'Coastal & Island', desc: 'Sailing catamarans to uninhabited Lakshadweep atolls, night-fishing with Koli fishermen & bioluminescent kayaking off Havelock.' },
  { icon: '📿', title: 'Spiritual Sojourns', desc: 'Varanasi dawn boat ride with a Brahmin guide, private puja at Madurai Meenakshi & Vipassana intro retreat in Bodh Gaya.' },
];

const TESTIMONIALS = [
  { name: 'Priya Raghunathan', origin: 'Singapore', tour: 'Kerala & Lakshadweep Splendour', text: 'The seaplane into Agatti was the most cinematic moment of my life. The team knew every hidden lagoon, every right tide. Nothing felt touristy — everything felt like a secret shared.' },
  { name: 'James & Elspeth Ford', origin: 'Edinburgh, UK', tour: 'Royal Rajasthan Grand Circuit', text: 'Waking up to the Lake Palace reflection at 6 a.m., a private boat, chai in hand — I cannot believe this was real life. Meticulous curation from first email to final farewell.' },
  { name: 'Arjun Mehta', origin: 'Dubai', tour: 'Himalayan Ladakh Odyssey', text: 'They arranged a monk to chant specifically for us at sunrise. The Pangong night shoot photos are now framed in my living room. Worth every rupee and then some.' },
];

const IMAGE_URLS = {
  destinations: [
    'https://unsplash.com/photos/Mf84Sa314pE/download?force=true&w=1800',
    'https://unsplash.com/photos/Z-huxISN9F8/download?force=true&w=1600',
    'https://unsplash.com/photos/u9GQHEzuK08/download?force=true&w=1600',
    'https://unsplash.com/photos/aprtnT-WaF0/download?force=true&w=1600',
    'https://unsplash.com/photos/v1-e_1Gki4w/download?force=true&w=1600',
  ],
  featuredKeralaLakshadweep: 'https://unsplash.com/photos/q-jFrkO0EEM/download?force=true&w=2000',
  packageCards: [
    'https://unsplash.com/photos/-pQjOzw6BBo/download?force=true&w=1400',
    'https://unsplash.com/photos/vFvfgCnrW4A/download?force=true&w=1400',
    'https://unsplash.com/photos/aprtnT-WaF0/download?force=true&w=1400',
  ],
  rajasthan: {
    tajLakePalace: 'https://unsplash.com/photos/CSIBRncar9Y/download?force=true&w=1400',
    samDunes: 'https://unsplash.com/photos/uZqTO-pAJRo/download?force=true&w=1400',
  },
  ladakhBanner: {
    pangong: 'https://unsplash.com/photos/aprtnT-WaF0/download?force=true&w=1800',
    thiksey: 'https://unsplash.com/photos/zsqiNk8UO2o/download?force=true&w=1200',
    nubra: 'https://unsplash.com/photos/e1AGNnxD4KY/download?force=true&w=1200',
  },
  andaman: {
    radhanagar: 'https://unsplash.com/photos/t4dDiavIFyQ/download?force=true&w=1600',
    reefDiving: 'https://unsplash.com/photos/atIcPln6aYA/download?force=true&w=1600',
  },
};
// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function IndiaPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeReview, setActiveReview] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!mounted || error) return;
      setReviews(data || []);
      setActiveReview(0);
    }

    loadReviews();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveReview((current) => (current + 1) % reviews.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [reviews]);

  const currentReview = reviews[activeReview];

  return (
    <div className="india-page">
      <style>{STYLE}</style>

      {/* ══════════════════════════════════════════════════════════════
          1. BRAND STRIP (right below hero)
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background: 'var(--charcoal)', padding: '18px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.35em', color: 'var(--rg-light)' }}>
            EST. 2008 — DELHI, INDIA
          </p>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.1em' }}>
            Handcrafted journeys across the subcontinent
          </p>
          <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.35em', color: 'var(--rg-light)' }}>
            ATOL & IATA CERTIFIED
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. INTRODUCTION — WHO WE ARE
      ══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container" style={{ maxWidth: 860, textAlign: 'center' }}>
          <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 24 }}>
            THE ART OF INDIAN TRAVEL
          </p>
          <h2 className="cinzel" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 400, lineHeight: 1.15, marginBottom: 32, color: 'var(--charcoal)' }}>
            India Is Not One Country.<br />It Is A Thousand.
          </h2>
          <div className="rg-divider" style={{ marginBottom: 32 }} />
          <p style={{ fontSize: '1.25rem', lineHeight: 1.85, color: 'var(--warm-gray)', fontWeight: 300, marginBottom: 20 }}>
            From the coral-fringed silence of Lakshadweep to the incense-thick lanes of Varanasi, 
            from the camel-bone palaces of Rajasthan to the mist-wrapped cardamom estates of Munnar — 
            we have spent fifteen years learning which roads lead somewhere extraordinary.
          </p>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--warm-gray)', fontWeight: 300 }}>
            We do not sell itineraries. We build narratives — shaped by your pace, your curiosity, and the 
            version of India you haven't met yet. Every guesthouse has been slept in. Every guide has been 
            tested. Every boat we put you on, we've stood at the bow ourselves.
          </p>
          <div style={{ marginTop: 48 }}>
            <a className="btn-rg" href="/about">OUR STORY</a>
          </div>
        </div>
      </section>

      <hr className="fancy" />

      {/* ══════════════════════════════════════════════════════════════
          3. STATS BAR
      ══════════════════════════════════════════════════════════════ */}
      <div className="section-cream section-sm">
        <div className="container">
          <div className="stats-grid">
            {[
              { num: '4,800+', label: 'Journeys Crafted' },
              { num: '29', label: 'States Explored' },
              { num: '15 Yrs', label: 'On The Road' },
              { num: '98%', label: 'Would Return' },
            ].map((s, i) => (
              <div key={i} className="stat-item" style={{ padding: '32px 0', textAlign: 'center' }}>
                <p className="cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--rg-deep)', marginBottom: 8 }}>{s.num}</p>
                <p style={{ fontSize: '0.92rem', letterSpacing: '0.15em', color: 'var(--warm-gray)', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. DESTINATIONS SHOWCASE
      ══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 20 }}>WHERE WE TAKE YOU</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, marginBottom: 24 }}>Our Signature Destinations</h2>
            <div className="rg-divider" />
          </div>

          {/* Masonry-style grid */}
          <div className="destinations-grid">
            {/* Kerala — tall left */}
            <div className="dest-card" style={{ gridRow: 'span 2' }}>
              <div className="img-box dest-img" style={{ height: '100%', minHeight: 700, backgroundImage: `url(${IMAGE_URLS.destinations[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label={DESTINATIONS[0].label} />
              <div className="dest-overlay">
                <p className="cinzel" style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: '#ffffff', marginBottom: 8 }}>{DESTINATIONS[0].tagline.toUpperCase()}</p>
                <h3 className="cinzel" style={{ fontSize: '1.6rem', color: 'white', fontWeight: 500, marginBottom: 8 }}>{DESTINATIONS[0].name}</h3>
                
              </div>
            </div>
            {/* Lakshadweep */}
            <div className="dest-card">
              <div className="img-box dest-img" style={{ height: 340, backgroundImage: `url(${IMAGE_URLS.destinations[1]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label={DESTINATIONS[1].label} />
              <div className="dest-overlay">
                <p className="cinzel" style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: '#ffffff', marginBottom: 6 }}>{DESTINATIONS[1].tagline.toUpperCase()}</p>
                <h3 className="cinzel" style={{ fontSize: '1.4rem', color: 'white', fontWeight: 500 }}>{DESTINATIONS[1].name}</h3>
              </div>
            </div>
            {/* Rajasthan */}
            <div className="dest-card">
              <div className="img-box dest-img" style={{ height: 340, backgroundImage: `url(${IMAGE_URLS.destinations[2]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label={DESTINATIONS[2].label} />
              <div className="dest-overlay">
                <p className="cinzel" style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: '#ffffff', marginBottom: 6 }}>{DESTINATIONS[2].tagline.toUpperCase()}</p>
                <h3 className="cinzel" style={{ fontSize: '1.4rem', color: 'white', fontWeight: 500 }}>{DESTINATIONS[2].name}</h3>
              </div>
            </div>
            {/* Ladakh */}
            <div className="dest-card">
              <div className="img-box dest-img" style={{ height: 340, backgroundImage: `url(${IMAGE_URLS.destinations[3]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label={DESTINATIONS[3].label} />
              <div className="dest-overlay">
                <p className="cinzel" style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: '#ffffff', marginBottom: 6 }}>{DESTINATIONS[3].tagline.toUpperCase()}</p>
                <h3 className="cinzel" style={{ fontSize: '1.4rem', color: 'white', fontWeight: 500 }}>{DESTINATIONS[3].name}</h3>
              </div>
            </div>
            {/* Andaman */}
            <div className="dest-card">
              <div className="img-box dest-img" style={{ height: 340, backgroundImage: `url(${IMAGE_URLS.destinations[4]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label={DESTINATIONS[4].label} />
              <div className="dest-overlay">
                <p className="cinzel" style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: '#ffffff', marginBottom: 6 }}>{DESTINATIONS[4].tagline.toUpperCase()}</p>
                <h3 className="cinzel" style={{ fontSize: '1.4rem', color: 'white', fontWeight: 500 }}>{DESTINATIONS[4].name}</h3>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a className="btn-rg" href="/explore">VIEW ALL DESTINATIONS</a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. FEATURED EXPERIENCE — KERALA & LAKSHADWEEP (full-width editorial)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: 'var(--charcoal)' }}>
        <div className="feature-grid">
          {/* Image side */}
          <div className="img-box" style={{ minHeight: 640, backgroundImage: `url(${IMAGE_URLS.featuredKeralaLakshadweep})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="ALLEPPEY HOUSEBOAT AT DUSK" />
          {/* Content side */}
          <div style={{ padding: 'clamp(40px, 6vw, 96px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'var(--rg-light)', marginBottom: 24 }}>EDITOR'S CHOICE — 2026</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)', fontWeight: 400, color: 'white', lineHeight: 1.2, marginBottom: 24 }}>
              Drift Through Kerala.<br />Disappear Into Lakshadweep.
            </h2>
            <div style={{ width: 60, height: 1.5, background: 'var(--rg-mid)', marginBottom: 28 }} />
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.9, fontWeight: 300, marginBottom: 20 }}>
              Begin in Fort Kochi's colonial lanes, board a private houseboat at Alleppey where your 
              cook prepares karimeen pollichathu over a wood fire as paddy fields drift past. 
              After three nights on water, a seaplane from Kochi carries you 400 km west to Agatti atoll.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.9, fontWeight: 300, marginBottom: 40 }}>
              Lakshadweep receives fewer than 15,000 tourists a year — by design and by law. 
              Your beach villa at Bangaram Island Resort sits 3 metres from a lagoon so clear you 
              can see your shadow on the sandy floor 8 metres down. No cars. No crowds. No noise 
              beyond the tide.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a className="btn-rg-fill" href="/explore">EXPLORE THIS JOURNEY</a>
              <a className="btn-rg" style={{ borderColor: 'rgba(196,165,116,0.5)', color: 'var(--rg-light)' }} href="/explore">DOWNLOAD ITINERARY</a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. TOUR PACKAGES
      ══════════════════════════════════════════════════════════════ */}
      <section className="section section-cream">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 20 }}>CURATED PROGRAMMES</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, marginBottom: 24 }}>Signature Tour Packages</h2>
            <div className="rg-divider" />
          </div>

          <div className="grid-3">
            {PACKAGES.map((pkg, i) => (
              <div key={i} className="pkg-card">
                {/* Image */}
                <div className="img-box" style={{ height: 260, position: 'relative', backgroundImage: `url(${IMAGE_URLS.packageCards[i]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label={pkg.title.toUpperCase()}>
                  <span className="cinzel" style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'linear-gradient(135deg, var(--rg-mid), var(--rg-deep))',
                    color: 'white', fontSize: '0.6rem', letterSpacing: '0.25em',
                    padding: '6px 14px',
                  }}>{pkg.badge}</span>
                </div>
                {/* Body */}
                <div style={{ padding: '32px 28px' }}>
                  <p style={{ fontSize: '0.82rem', letterSpacing: '0.2em', color: 'var(--rg-mid)', marginBottom: 10 }}>{pkg.days}</p>
                  <h3 className="cinzel" style={{ fontSize: '1.2rem', fontWeight: 500, marginBottom: 16, lineHeight: 1.3 }}>{pkg.title}</h3>
                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {pkg.tags.map((t, j) => (
                      <span key={j} style={{ fontSize: '0.76rem', letterSpacing: '0.1em', border: '1px solid var(--rg-light)', color: 'var(--rg-deep)', padding: '4px 10px' }}>{t}</span>
                    ))}
                  </div>
                  {/* Highlights */}
                  <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                    {pkg.highlights.map((h, j) => (
                      <li key={j} style={{ display: 'flex', gap: 12, marginBottom: 10, fontSize: '0.97rem', color: 'var(--warm-gray)', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--rg-mid)', flexShrink: 0, marginTop: 2 }}>◆</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div style={{ borderTop: '1px solid #e8e0d8', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', marginBottom: 4 }}>STARTING FROM</p>
                      <p className="cinzel" style={{ fontSize: '1.5rem', color: 'var(--rg-deep)' }}>{pkg.price}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--warm-gray)' }}>{pkg.per}</p>
                    </div>
                    <a className="btn-rg" style={{ padding: '10px 24px', fontSize: '0.65rem' }} href="/explore">ENQUIRE</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. SPLIT — RAJASTHAN EDITORIAL
      ══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="story-grid">
            <div>
              <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 20 }}>FEATURED REGION</p>
              <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: 24 }}>
                Rajasthan:<br />The Kingdom That Refused to Fade
              </h2>
              <div style={{ width: 60, height: 1.5, background: 'var(--rg-mid)', marginBottom: 28 }} />
              <p style={{ fontSize: '1.1rem', lineHeight: 1.9, color: 'var(--warm-gray)', fontWeight: 300, marginBottom: 20 }}>
                The Maharawal of Jaisalmer still hosts guests in his ancestral haveli. The women of 
                Barmer still hand-block cloth the way they did for the Mughal court. In Bundi, a 
                painter's family has kept alive a 400-year-old school of miniature art in a single room.
              </p>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.9, color: 'var(--warm-gray)', fontWeight: 300, marginBottom: 36 }}>
                We don't just take you to these places. We introduce you to the people who live inside 
                the legend — and let the evenings be long, the food be real, and the sunsets be 
                unreasonably pink over sandstone.
              </p>
              <div className="story-image-grid">
                {['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Bundi', 'Pushkar'].map((c, i) => (
                  <p key={i} style={{ display: 'flex', gap: 10, fontSize: '0.95rem', color: 'var(--charcoal)' }}>
                    <span style={{ color: 'var(--rg-mid)' }}>→</span> {c}
                  </p>
                ))}
              </div>
              <a className="btn-rg" href="/explore">RAJASTHAN PACKAGES</a>
            </div>
            {/* Stacked images */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 16, height: 560 }}>
              <div className="img-box" style={{ backgroundImage: `url(${IMAGE_URLS.rajasthan.tajLakePalace})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="TAJ LAKE PALACE — UDAIPUR" />
              <div className="img-box" style={{ backgroundImage: `url(${IMAGE_URLS.rajasthan.samDunes})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="SAM SAND DUNES — JAISALMER AT DUSK" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. EXPERIENCES
      ══════════════════════════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--charcoal)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-light)', marginBottom: 20 }}>BEYOND THE ITINERARY</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, marginBottom: 24, color: 'white' }}>
              Six Ways We Take You Deeper
            </h2>
            <div className="rg-divider" />
          </div>
          <div className="grid-3" style={{ gap: 2 }}>
            {EXPERIENCES.map((exp, i) => (
              <div key={i} style={{
                padding: '48px 36px',
                borderLeft: i % 3 !== 0 ? '1px solid rgba(196,165,116,0.15)' : 'none',
                borderBottom: i < 3 ? '1px solid rgba(196,165,116,0.15)' : 'none',
              }}>
                <div style={{ fontSize: '2.4rem', marginBottom: 20 }}>{exp.icon}</div>
                <h3 className="cinzel" style={{ fontSize: '1rem', fontWeight: 500, color: 'white', marginBottom: 16, letterSpacing: '0.05em' }}>{exp.title}</h3>
                <p style={{ fontSize: '0.97rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.85, fontWeight: 300 }}>{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          9. LADAKH BANNER (full-width editorial image row)
      ══════════════════════════════════════════════════════════════ */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr' }}>
          <div className="img-box" style={{ height: 500, backgroundImage: `url(${IMAGE_URLS.ladakhBanner.pangong})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="PANGONG TSO AT FIRST LIGHT" />
          <div className="img-box" style={{ height: 500, backgroundImage: `url(${IMAGE_URLS.ladakhBanner.thiksey})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="THIKSEY MONASTERY" />
          <div className="img-box" style={{ height: 500, backgroundImage: `url(${IMAGE_URLS.ladakhBanner.nubra})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="NUBRA VALLEY DUNES" />
        </div>
        <div style={{ background: 'var(--cream)', padding: '56px 40px', textAlign: 'center' }}>
          <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 16 }}>LADAKH — SEASON JUNE TO SEPTEMBER</p>
          <h2 className="cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 400, marginBottom: 20 }}>
            5,359 Metres Above the World's Noise
          </h2>
          <p style={{ maxWidth: 680, margin: '0 auto 32px', fontSize: '1.1rem', color: 'var(--warm-gray)', lineHeight: 1.8, fontWeight: 300 }}>
            The passes close in October. The lake freezes in November. Book the window — 
            we handle everything from acclimatisation planning to inner-line permits for the restricted zones.
          </p>
          <a className="btn-rg" href="/explore">BOOK LADAKH 2026</a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          10. HOW IT WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 20 }}>YOUR JOURNEY BEGINS HERE</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, marginBottom: 24 }}>How We Build Your Trip</h2>
            <div className="rg-divider" />
          </div>
          <div className="process-grid">
            {[
              { n: '01', title: 'Tell Us Your Dream', body: 'Fill our discovery form or call us. We ask the questions no one else thinks to — not just where, but why, and how you want to feel.' },
              { n: '02', title: 'Your Tailor Reaches Out', body: 'Within 48 hours a specialist who has personally visited your destinations calls you. No scripts, no call centres.' },
              { n: '03', title: 'We Craft the Proposal', body: 'A hand-built PDF lands in your inbox — maps, property photos, guide profiles, day-by-day narrative, and a clear price.' },
              { n: '04', title: 'You Travel in Confidence', body: 'A 24/7 India-based concierge line, a WhatsApp group with your local guide, and an emergency protocol that has never failed.' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '48px 36px',
                borderRight: i < 3 ? '1px solid #e8e0d8' : 'none',
                textAlign: 'center',
              }}>
                <div className="process-num" style={{ margin: '0 auto 24px' }}>{s.n}</div>
                <h3 className="cinzel" style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: 16, letterSpacing: '0.05em' }}>{s.title}</h3>
                <p style={{ fontSize: '0.97rem', color: 'var(--warm-gray)', lineHeight: 1.85 }}>{s.body}</p>              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="fancy" />

      {/* ══════════════════════════════════════════════════════════════
          11. TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section className="section section-cream">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 20 }}>WORDS FROM OUR TRAVELLERS</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, marginBottom: 24 }}>They Came Curious. They Left Changed.</h2>
            <div className="rg-divider" />
          </div>
          {currentReview ? (
            <div className="testimonial-slider">
              <div className="testimonial-card">
                {currentReview.image_url && (
                  <div className="testimonial-image-wrap">
                    <img
                      src={currentReview.image_url}
                      alt={currentReview.name || 'Guest Traveller'}
                      className="testimonial-image"
                    />
                  </div>
                )}
                <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: 'var(--warm-gray)', fontWeight: 300, marginBottom: 28, paddingTop: 24 }}>
                  {currentReview.text}
                </p>
                <div style={{ borderTop: '1px solid #e8e0d8', paddingTop: 20 }}>
                  <div>
                    <p className="cinzel" style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: 4 }}>
                      {currentReview.name || 'Guest Traveller'}
                    </p>
                    <p style={{ fontSize: '0.84rem', color: 'var(--warm-gray)', letterSpacing: '0.1em' }}>
                      {currentReview.location || 'Good Morning India Holidays Guest'}
                    </p>
                    {currentReview.headline && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--rg-mid)', marginTop: 6 }}>{currentReview.headline}</p>
                    )}
                  </div>
                </div>
              </div>
              {reviews.length > 1 && (
                <div className="testimonial-nav">
                  <button
                    type="button"
                    className="testimonial-arrow"
                    onClick={() => setActiveReview((activeReview - 1 + reviews.length) % reviews.length)}
                    aria-label="Previous review"
                  >
                    ‹
                  </button>
                  <div className="testimonial-dots">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`testimonial-dot${index === activeReview ? ' active' : ''}`}
                        onClick={() => setActiveReview(index)}
                        aria-label={`Go to review ${index + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="testimonial-arrow"
                    onClick={() => setActiveReview((activeReview + 1) % reviews.length)}
                    aria-label="Next review"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--warm-gray)', fontStyle: 'italic' }}>
              Published reviews will appear here automatically.
            </p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          12. ANDAMAN EDITORIAL ROW
      ══════════════════════════════════════════════════════════════ */}
      <section className="andaman-grid">
        {/* Content */}
        <div style={{ background: 'linear-gradient(135deg, #2a1f14, #1a1612)', padding: 'clamp(48px,7vw,100px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'var(--rg-light)', marginBottom: 20 }}>THE ANDAMAN ARCHIPELAGO</p>
          <h2 className="cinzel" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 400, color: 'white', lineHeight: 1.2, marginBottom: 24 }}>
            536 Islands.<br />Only 37 Open to Visitors.
          </h2>
          <div style={{ width: 60, height: 1.5, background: 'var(--rg-mid)', marginBottom: 28 }} />
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.9, fontWeight: 300, marginBottom: 16 }}>
            Havelock's Radhanagar Beach was voted Asia's best for a reason — pale coral sand, 
            Bengal Bay green, no beach vendors, no jet-skis. We stay at Jalakara, a nine-villa 
            property run by architects who love the island.
          </p>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.9, fontWeight: 300, marginBottom: 40 }}>
            Neil Island is quieter still. Your schedule here is dictated by tide tables — morning 
            dives on the Margherita's Mischief wreck, afternoon hammock time, evening reef walks 
            by torchlight looking for octopus.
          </p>
          <a className="btn-rg-fill" href="/explore">ANDAMAN PACKAGES</a>
        </div>
        {/* Images stacked */}
        <div className="andaman-images">
          <div className="img-box" style={{ backgroundImage: `url(${IMAGE_URLS.andaman.radhanagar})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="RADHANAGAR BEACH — HAVELOCK ISLAND" />
          <div className="img-box" style={{ backgroundImage: `url(${IMAGE_URLS.andaman.reefDiving})`, backgroundSize: 'cover', backgroundPosition: 'center' }} data-label="CORAL REEF DIVING — NEIL ISLAND" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          13. WHY US — PROMISES
      ══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 20 }}>OUR COMMITMENTS</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, marginBottom: 24 }}>The Promises We Make — And Keep</h2>
            <div className="rg-divider" />
          </div>
          <div className="grid-4">
            {[
              { title: 'No Hidden Charges', body: 'The price you see in the proposal is the price you pay. Taxes itemised. No "local payment" surprises.' },
              { title: 'No Cookie-Cutter Tours', body: 'Every itinerary is written from scratch. We don\'t pull from a template library; we pull from experience.' },
              { title: 'Responsible Tourism', body: 'We partner with community lodges, employ local guides exclusively, and offset all ground transport emissions.' },
              { title: 'Cancel with Dignity', body: 'Life changes. Our cancellation policy is among the most generous in the industry — written in plain language, no footnotes.' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '36px 28px', border: '1px solid #e8e0d8', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, border: '1.5px solid var(--rg-mid)', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, background: 'var(--rg-mid)', borderRadius: '50%' }} />
                </div>
                <h3 className="cinzel" style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: 14, letterSpacing: '0.05em' }}>{p.title}</h3>
                <p style={{ fontSize: '0.97rem', color: 'var(--warm-gray)', lineHeight: 1.8 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          14. FAQ
      ══════════════════════════════════════════════════════════════ */}
      <section className="section section-cream">
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p className="cinzel" style={{ fontSize: '0.78rem', letterSpacing: '0.4em', color: 'var(--rg-mid)', marginBottom: 20 }}>FREQUENTLY ASKED</p>
            <h2 className="cinzel" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 400, marginBottom: 24 }}>Questions We Hear Often</h2>
            <div className="rg-divider" />
          </div>
          {[
            { q: 'Can I customise a package completely?', a: 'Yes — every trip we sell begins as a blank page. Packages are starting frameworks, not constraints. Tell us your travel dates, party size, and interests and we build accordingly.' },
            { q: 'Are permits required for Lakshadweep?', a: 'Foreign nationals require an Entry Permit from the Ministry of Home Affairs. Indian nationals need a clearance from the Lakshadweep Administration. We handle all permit applications as part of the booking process at no extra charge.' },
            { q: 'What is the best time for Kerala backwaters?', a: 'October through March is ideal — the monsoon has washed the canals clean and temperatures are gentler. We deliberately avoid booking backwater trips in peak summer (April–June) when heat on enclosed waterways can be severe.' },
            { q: 'Do you arrange travel insurance?', a: 'We work with Cover-More and Royal Sundaram to offer comprehensive travel insurance that includes medical evacuation from remote areas like Ladakh and Andaman. Strongly recommended for high-altitude itineraries.' },
            { q: 'Is solo travel catered for?', a: 'Absolutely. We have a roster of like-minded solo travellers who sometimes prefer to share journeys — we can match you, or keep your trip fully private. Solo supplement charges are the lowest possible for the property category you book.' },
          ].map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #ddd4c8', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <span className="cinzel" style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--charcoal)', letterSpacing: '0.03em' }}>{faq.q}</span>
                <span style={{ color: 'var(--rg-mid)', fontSize: '1.4rem', flexShrink: 0, marginLeft: 20 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p style={{ paddingBottom: 28, fontSize: '1rem', color: 'var(--warm-gray)', lineHeight: 1.85, fontWeight: 400 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          15. NEWSLETTER / CTA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section className="newsletter-section" style={{ background: 'linear-gradient(135deg, var(--rg-mid) 0%, var(--rg-deep) 100%)' }}>
        <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.85)', marginBottom: 20 }}>RECEIVE OUR TRAVEL LETTERS</p>
        <h2 className="cinzel" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 400, color: 'white', marginBottom: 16 }}>
          Rare Openings. Hidden Windows. First Access.
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.88)', marginBottom: 40, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 300 }}>
          Once a month, we write about a destination as it actually is — not the brochure version. 
          Occasionally we share early-bird prices and last-minute inventory.
        </p>
        <div className="newsletter-form">
          <input
            type="email" placeholder="Your email address"
            style={{
              flex: 1, padding: '16px 24px', border: 'none', outline: 'none',
              fontSize: '0.95rem', fontFamily: 'Cormorant Garamond, serif',
              background: 'rgba(255,255,255,0.15)', color: 'white',
              '::placeholder': { color: 'rgba(255,255,255,0.5)' }
            }}
          />
          <button style={{
            background: 'var(--charcoal)', color: 'white', border: 'none', cursor: 'pointer',
            padding: '16px 32px', fontFamily: 'Cinzel, serif', fontSize: '0.65rem', letterSpacing: '0.25em',
            flexShrink: 0,
          }}>SUBSCRIBE</button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          16. FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer className="footer-shell" style={{ background: 'var(--charcoal)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <h3 className="cinzel" style={{ fontSize: '1.4rem', fontWeight: 500, color: 'white', marginBottom: 20, letterSpacing: '0.15em' }}>GOOD MORNING INDIA HOLIDAYS</h3>
              <p style={{ fontSize: '0.97rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.85, fontWeight: 300, marginBottom: 24 }}>
                Handcrafted journeys across the Indian subcontinent since 2008. 
                Headquartered in New Delhi. Roots in every state.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--rg-light)' }}>+91 11 4567 8900</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--rg-light)', marginTop: 6 }}>hello@goodmorningindiaholidays.in</p>
            </div>
            {/* Links */}
            {[
              {
                heading: 'Destinations',
                links: [
                  { label: 'Kerala', href: '/explore' },
                  { label: 'Lakshadweep', href: '/explore' },
                  { label: 'Rajasthan', href: '/explore' },
                  { label: 'Ladakh', href: '/explore' },
                  { label: 'Andaman', href: '/explore' },
                  { label: 'Varanasi', href: '/explore' },
                ],
              },
              {
                heading: 'Pages',
                links: [
                  { label: 'Home', href: '/' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Explore India', href: '/explore' },
                  { label: 'Reviews', href: '/reviews' },
                  { label: 'Stories', href: '/stories' },
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <p className="cinzel" style={{ fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--rg-light)', marginBottom: 24 }}>{col.heading.toUpperCase()}</p>
                <ul style={{ listStyle: 'none' }}>
                  {col.links.map((l, j) => (
                    <li key={j} style={{ marginBottom: 12 }}>
                      <a href={l.href} style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--rg-light)'}
                        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                      >{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom" style={{ borderTop: '1px solid rgba(196,165,116,0.2)', paddingTop: 32 }}>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>
              © 2026 GOOD MORNING INDIA HOLIDAYS PRIVATE LIMITED. ALL RIGHTS RESERVED.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>
              ATOL 12438 · IATA 14-3 1527 3
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}











