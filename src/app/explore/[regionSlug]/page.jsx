// app/explore/[regionSlug]/page.jsx
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import InquiryForm from '@/app/components/InquiryForm';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { regionSlug } = await params;
  const { data: region } = await supabase
    .from('regions').select('title').eq('slug', regionSlug).single();
  return { title: region ? `${region.title} | Good Morning India Holidays` : 'Region' };
}

const REGION_HERO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/4/4c/National_Geographic_Map_of_Indian_Subcontinent.jpg';

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');
  :root { --rg-mid:#D4956A; --rg-deep:#B87333; --rg-light:#F2C4A0; --charcoal:#1A1612; --ivory:#FAF7F2; --cream:#F0EBE1; --warm-gray:#6B5D54; }
  .rp { font-family:'Cormorant Garamond',Georgia,serif; background:var(--ivory); color:var(--charcoal); min-height:100vh; }
  .cinzel { font-family:'Cinzel',serif; }
  .rp-hero {
    position: relative;
    background-image: url('${REGION_HERO_IMAGE}');
    background-size: cover;
    background-position: center;
    padding: 86px 40px 68px;
  }
  .rp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(26,22,18,0.82), rgba(26,22,18,0.62));
  }
  .rp-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) 320px;
    gap: 28px;
    align-items: end;
  }
  .rp-hero-copy { text-align: left; }
  .rp-eyebrow { font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.4em; color:var(--rg-light); margin-bottom:16px; }
  .rp-h1 { font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:400; color:white; margin-bottom:16px; }
  .rp-desc { font-size:1.15rem; color:rgba(255,255,255,0.82); max-width:680px; margin:0; line-height:1.8; font-weight:300; }
  .rp-cta {
    border: 1px solid rgba(242,196,160,0.35);
    background: rgba(26,22,18,0.52);
    backdrop-filter: blur(3px);
    padding: 24px 22px;
  }
  .rp-cta-eye { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.25em; color:var(--rg-light); margin-bottom:10px; }
  .rp-cta-title { font-family:'Cinzel',serif; font-size:1.05rem; color:white; margin-bottom:8px; }
  .rp-cta-text { color:rgba(255,255,255,0.78); font-size:0.95rem; line-height:1.6; margin-bottom:16px; }
  .rp-cta-btn {
    display: inline-block;
    border: 1.5px solid var(--rg-mid);
    color: var(--rg-light);
    text-decoration: none;
    padding: 10px 16px;
    font-family:'Cinzel',serif;
    font-size:0.68rem;
    letter-spacing:0.18em;
  }
  .rp-cta-btn:hover { background: var(--rg-mid); color: white; }
  .rp-container { max-width:1100px; margin:0 auto; padding:0 40px; }
  .rp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:24px; padding:80px 0; }
  .rp-card { background:white; border:1px solid #e8e0d8; padding:36px 28px; transition:box-shadow 0.3s,transform 0.3s; text-decoration:none; display:block; color:inherit; }
  .rp-card:hover { box-shadow:0 16px 48px rgba(180,120,60,0.15); transform:translateY(-4px); }
  .rp-card-eye { font-family:'Cinzel',serif; font-size:0.68rem; letter-spacing:0.3em; color:var(--rg-mid); margin-bottom:12px; }
  .rp-card-title { font-family:'Cinzel',serif; font-size:1.3rem; font-weight:500; margin-bottom:10px; }
  .rp-card-desc { font-size:0.97rem; color:var(--warm-gray); line-height:1.7; }
  .rp-card-arrow { margin-top:20px; font-size:0.75rem; letter-spacing:0.2em; color:var(--rg-mid); font-family:'Cinzel',serif; }
  .rp-divider { width:60px; height:1.5px; background:linear-gradient(90deg,transparent,var(--rg-mid),transparent); margin:0 auto 40px; }
  .rp-section-title { font-family:'Cinzel',serif; font-size:clamp(1.4rem,3vw,2rem); font-weight:400; text-align:center; margin-bottom:12px; }
  .rp-section-eye { font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.4em; color:var(--rg-mid); text-align:center; margin-bottom:16px; }
  .rp-inq-section { background:var(--cream); padding:80px 40px; }
  @media(max-width:900px){
    .rp-hero-inner { grid-template-columns: 1fr; }
  }
  @media(max-width:640px){ .rp-container{padding:0 20px;} .rp-hero{padding:60px 24px 48px;} }
`;

export default async function RegionPage({ params }) {
  const { regionSlug } = await params;

  const { data: region } = await supabase
    .from('regions')
    .select('*, states(id, title, slug, description)')
    .eq('slug', regionSlug)
    .single();

  if (!region) notFound();

  return (
    <div className="rp">
      <style>{STYLE}</style>
      <div className="rp-hero">
        <div className="rp-hero-inner">
          <div className="rp-hero-copy">
            <p className="rp-eyebrow">EXPLORE INDIA</p>
            <h1 className="rp-h1">{region.title}</h1>
            {region.description && <p className="rp-desc">{region.description}</p>}
          </div>
          <aside className="rp-cta">
            <p className="rp-cta-eye">PLAN THIS REGION</p>
            <h3 className="rp-cta-title">Get a curated route proposal</h3>
            <p className="rp-cta-text">Share your dates and we will suggest the best state combinations in this region.</p>
            <a href="#region-inquiry" className="rp-cta-btn">SEND ENQUIRY</a>
          </aside>
        </div>
      </div>
      <div className="rp-container">
        <div className="rp-grid">
          {(region.states || []).map(state => (
            <Link key={state.id} href={`/explore/${regionSlug}/${state.slug}`} className="rp-card">
              <p className="rp-card-eye">STATE / UNION TERRITORY</p>
              <h2 className="rp-card-title">{state.title}</h2>
              {state.description && <p className="rp-card-desc">{state.description}</p>}
              <p className="rp-card-arrow">EXPLORE PLACES →</p>
            </Link>
          ))}
        </div>
      </div>
      <div className="rp-inq-section" id="region-inquiry">
        <p className="rp-section-eye">INTERESTED IN THIS REGION?</p>
        <h2 className="rp-section-title" style={{ marginBottom: 40 }}>Send Us an Enquiry</h2>
        <div className="rp-divider" />
        <InquiryForm interestPlace={region.title} />
      </div>
    </div>
  );
}
