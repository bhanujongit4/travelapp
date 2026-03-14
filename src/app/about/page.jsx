export const metadata = {
  title: 'About Us | Good Morning India Holidays',
  description: 'Learn about Good Morning India Holidays, our values, and how we craft journeys across India.',
};

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

  :root {
    --rg-light:  #F2C4A0;
    --rg-mid:    #D4956A;
    --rg-deep:   #B87333;
    --ivory:     #FAF7F2;
    --cream:     #F0EBE1;
    --charcoal:  #1A1612;
    --warm-gray: #6B5D54;
  }

  .about-page * { box-sizing: border-box; }
  .about-page { font-family: 'Cormorant Garamond', Georgia, serif; color: var(--charcoal); background: var(--ivory); min-height: 100vh; }
  .cinzel { font-family: 'Cinzel', serif; }
  .about-wrap { max-width: 1150px; margin: 0 auto; padding: 0 40px; }

  .about-hero {
    background: linear-gradient(135deg, #2a1f14, #1a1612);
    color: white;
    padding: clamp(70px, 10vw, 130px) 40px clamp(60px, 8vw, 100px);
    text-align: center;
  }

  .about-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.76rem;
    letter-spacing: 0.4em;
    color: var(--rg-light);
    margin-bottom: 18px;
  }

  .about-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.9rem, 5vw, 3.4rem);
    line-height: 1.15;
    font-weight: 400;
    margin-bottom: 18px;
  }

  .about-lead {
    max-width: 760px;
    margin: 0 auto;
    font-size: 1.16rem;
    line-height: 1.85;
    color: rgba(255,255,255,0.82);
    font-weight: 300;
  }

  .about-section { padding: 84px 0; }
  .about-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 36px; align-items: start; }

  .about-card {
    background: white;
    border: 1px solid #e8e0d8;
    padding: 34px 30px;
  }

  .about-h2 {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.4rem, 3vw, 2rem);
    font-weight: 500;
    margin-bottom: 18px;
  }

  .about-copy {
    font-size: 1.08rem;
    line-height: 1.85;
    color: var(--warm-gray);
    font-weight: 300;
  }

  .about-kpis { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

  .about-kpi {
    border: 1px solid #e8e0d8;
    background: var(--cream);
    padding: 26px 18px;
    text-align: center;
  }

  .about-kpi-num {
    font-family: 'Cinzel', serif;
    color: var(--rg-deep);
    font-size: 1.65rem;
    margin-bottom: 8px;
  }

  .about-kpi-label {
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-size: 0.79rem;
    color: var(--warm-gray);
  }

  .about-values {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 30px;
  }

  .about-value {
    border: 1px solid #e8e0d8;
    background: white;
    padding: 26px;
  }

  .about-value h3 {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
    color: var(--charcoal);
  }

  .about-value p {
    color: var(--warm-gray);
    line-height: 1.75;
    font-size: 0.97rem;
  }

  .about-cta {
    margin-top: 42px;
    display: inline-block;
    border: 1.5px solid var(--rg-mid);
    color: var(--rg-mid);
    text-decoration: none;
    padding: 12px 34px;
    font-family: 'Cinzel', serif;
    letter-spacing: 0.2em;
    font-size: 0.72rem;
    transition: all 0.25s ease;
  }

  .about-cta:hover {
    background: var(--rg-mid);
    color: white;
  }

  @media (max-width: 960px) {
    .about-grid { grid-template-columns: 1fr; }
    .about-values { grid-template-columns: 1fr; }
  }

  @media (max-width: 640px) {
    .about-wrap { padding: 0 20px; }
    .about-kpis { grid-template-columns: 1fr; }
  }
`;

export default function AboutPage() {
  return (
    <div className="about-page">
      <style>{STYLE}</style>

      <section className="about-hero">
        <p className="about-eyebrow">GOOD MORNING INDIA HOLIDAYS</p>
        <h1 className="about-title">Built by travellers. Trusted by families.</h1>
        <p className="about-lead">
          We design Indian journeys that feel personal from day one, with grounded local knowledge,
          verified partners, and a planning style that values comfort, clarity, and wonder in equal measure.
        </p>
      </section>

      <section className="about-section">
        <div className="about-wrap about-grid">
          <article className="about-card">
            <h2 className="about-h2">Who We Are</h2>
            <p className="about-copy">
              Good Morning India Holidays is a destination-first travel company focused entirely on India.
              From Himalayan routes and heritage cities to beach islands and wildlife zones, we curate each
              itinerary based on real on-ground logistics, season patterns, and traveller goals.
            </p>
            <br />
            <p className="about-copy">
              We are not template sellers. Every plan is assembled for the person taking it, with practical pacing,
              transparent costing, and support before, during, and after the journey.
            </p>
          </article>

          <aside className="about-kpis">
            <div className="about-kpi">
              <p className="about-kpi-num">29+</p>
              <p className="about-kpi-label">States Covered</p>
            </div>
            <div className="about-kpi">
              <p className="about-kpi-num">15+</p>
              <p className="about-kpi-label">Years of Curation</p>
            </div>
            <div className="about-kpi">
              <p className="about-kpi-num">4800+</p>
              <p className="about-kpi-label">Trips Planned</p>
            </div>
            <div className="about-kpi">
              <p className="about-kpi-num">24x7</p>
              <p className="about-kpi-label">Travel Support</p>
            </div>
          </aside>
        </div>

        <div className="about-wrap">
          <div className="about-values">
            <div className="about-value">
              <h3>Honest Planning</h3>
              <p>Clear route logic, realistic travel times, and practical recommendations with no hidden add-ons.</p>
            </div>
            <div className="about-value">
              <h3>Local Depth</h3>
              <p>We work with trusted regional operators and guides who know each place beyond brochure landmarks.</p>
            </div>
            <div className="about-value">
              <h3>Care in Execution</h3>
              <p>From permits to transfers and on-trip changes, we keep the experience smooth and well-supported.</p>
            </div>
          </div>

          <a href="/explore" className="about-cta">START EXPLORING</a>
        </div>
      </section>
    </div>
  );
}
