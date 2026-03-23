// app/explore/[regionSlug]/[stateSlug]/page.jsx
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import InquiryForm from '@/app/components/InquiryForm';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { stateSlug } = await params;
  const { data: state } = await supabase
    .from('states').select('title').eq('slug', stateSlug).single();
  return { title: state ? `${state.title} | Good Morning India Holidays` : 'State' };
}

const STATE_HERO_IMAGE = '/images/state.png';

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');
  :root { --rg-mid:#D4956A; --rg-deep:#B87333; --rg-light:#F2C4A0; --charcoal:#1A1612; --ivory:#FAF7F2; --cream:#F0EBE1; --warm-gray:#6B5D54; }
  .sp { font-family:'Cormorant Garamond',Georgia,serif; background:var(--ivory); color:var(--charcoal); min-height:100vh; }
  .cinzel { font-family:'Cinzel',serif; }
  .sp-hero {
    position: relative;
    background-image: url('${STATE_HERO_IMAGE}');
    background-size: cover;
    background-position: center;
    padding: 86px 40px 68px;
  }
  .sp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(26,22,18,0.82), rgba(26,22,18,0.60));
  }
  .sp-hero-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) 320px;
    gap: 28px;
    align-items: end;
  }
  .sp-hero-copy { text-align: left; }
  .sp-breadcrumb { font-family:'Cinzel',serif; font-size:0.68rem; letter-spacing:0.3em; color:rgba(255,255,255,0.62); margin-bottom:20px; }
  .sp-breadcrumb a { color:var(--rg-light); text-decoration:none; }
  .sp-h1 { font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.5rem); font-weight:400; color:white; margin-bottom:16px; }
  .sp-desc { font-size:1.15rem; color:rgba(255,255,255,0.82); max-width:680px; margin:0; line-height:1.8; font-weight:300; }
  .sp-cta {
    border: 1px solid rgba(242,196,160,0.35);
    background: rgba(26,22,18,0.52);
    backdrop-filter: blur(3px);
    padding: 24px 22px;
  }
  .sp-cta-eye { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.25em; color:var(--rg-light); margin-bottom:10px; }
  .sp-cta-title { font-family:'Cinzel',serif; font-size:1.05rem; color:white; margin-bottom:8px; }
  .sp-cta-text { color:rgba(255,255,255,0.78); font-size:0.95rem; line-height:1.6; margin-bottom:16px; }
  .sp-cta-btn {
    display: inline-block;
    border: 1.5px solid var(--rg-mid);
    color: var(--rg-light);
    text-decoration: none;
    padding: 10px 16px;
    font-family:'Cinzel',serif;
    font-size:0.68rem;
    letter-spacing:0.18em;
  }
  .sp-cta-btn:hover { background: var(--rg-mid); color: white; }
  .sp-container { max-width:1100px; margin:0 auto; padding:0 40px; }
  .sp-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; padding:80px 0; }
  .sp-card { background:white; border:1px solid #e8e0d8; overflow:hidden; transition:box-shadow 0.3s,transform 0.3s; text-decoration:none; display:block; color:inherit; }
  .sp-card:hover { box-shadow:0 16px 48px rgba(180,120,60,0.15); transform:translateY(-4px); }
  .sp-card-img { width:100%; height:200px; object-fit:cover; display:block; background:linear-gradient(135deg,#e8ddd3,#c8b8a8); }
  .sp-card-img-placeholder { width:100%; height:200px; background:linear-gradient(135deg,#e8ddd3,#c8b8a8); display:flex; align-items:center; justify-content:center; }
  .sp-card-body { padding:28px; }
  .sp-card-season { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.25em; color:var(--rg-mid); margin-bottom:10px; }
  .sp-card-title { font-family:'Cinzel',serif; font-size:1.2rem; font-weight:500; margin-bottom:10px; }
  .sp-card-desc { font-size:0.97rem; color:var(--warm-gray); line-height:1.7; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .sp-card-arrow { margin-top:16px; font-size:0.72rem; letter-spacing:0.2em; color:var(--rg-mid); font-family:'Cinzel',serif; }
  .sp-inq-section { background:var(--cream); padding:80px 40px; }
  .sp-divider { width:60px; height:1.5px; background:linear-gradient(90deg,transparent,var(--rg-mid),transparent); margin:0 auto 40px; }
  .sp-section-eye { font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.4em; color:var(--rg-mid); text-align:center; margin-bottom:16px; }
  .sp-section-title { font-family:'Cinzel',serif; font-size:clamp(1.4rem,3vw,2rem); font-weight:400; text-align:center; margin-bottom:40px; }
  @media(max-width:900px){
    .sp-hero-inner { grid-template-columns: 1fr; }
  }
  @media(max-width:640px){ .sp-container{padding:0 20px;} .sp-hero{padding:60px 24px 48px;} }
`;

export default async function StatePage({ params }) {
  const { regionSlug, stateSlug } = await params;

  const { data: state } = await supabase
    .from('states')
    .select('*, regions(title,slug), places(id,title,slug,hero_image,description,best_season)')
    .eq('slug', stateSlug)
    .single();

  if (!state) notFound();

  return (
    <div className="sp">
      <style>{STYLE}</style>
      <div className="sp-hero">
        <div className="sp-hero-inner">
          <div className="sp-hero-copy">
            <p className="sp-breadcrumb">
              <Link href={`/explore/${regionSlug}`}>{state.regions?.title}</Link>
              {' '}›{' '}{state.title}
            </p>
            <h1 className="sp-h1">{state.title}</h1>
            {state.description && <p className="sp-desc">{state.description}</p>}
          </div>
          <aside className="sp-cta">
            <p className="sp-cta-eye">PLAN THIS STATE</p>
            <h3 className="sp-cta-title">Build your place shortlist</h3>
            <p className="sp-cta-text">Tell us your travel window and we will recommend the best places and route flow.</p>
            <a href="#state-inquiry" className="sp-cta-btn">SEND ENQUIRY</a>
          </aside>
        </div>
      </div>
      <div className="sp-container">
        <div className="sp-grid">
          {(state.places || []).map(place => (
            <Link key={place.id} href={`/explore/${regionSlug}/${stateSlug}/${place.slug}`} className="sp-card">
              {place.hero_image
                ? <img src={place.hero_image} alt={place.title} className="sp-card-img" />
                : <div className="sp-card-img-placeholder"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b0a090" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>
              }
              <div className="sp-card-body">
                {place.best_season && <p className="sp-card-season">BEST IN {place.best_season.toUpperCase()}</p>}
                <h2 className="sp-card-title">{place.title}</h2>
                {place.description && <p className="sp-card-desc">{place.description}</p>}
                <p className="sp-card-arrow">EXPLORE →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="sp-inq-section" id="state-inquiry">
        <p className="sp-section-eye">INTERESTED IN {state.title.toUpperCase()}?</p>
        <h2 className="sp-section-title">Send Us an Enquiry</h2>
        <div className="sp-divider" />
        <InquiryForm interestPlace={state.title} />
      </div>
    </div>
  );
}
