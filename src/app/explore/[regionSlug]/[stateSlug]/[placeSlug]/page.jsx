// app/explore/[regionSlug]/[stateSlug]/[placeSlug]/page.jsx
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import InquiryForm from '@/app/components/InquiryForm';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { placeSlug } = await params;
  const { data: place } = await supabase
    .from('places').select('title').eq('slug', placeSlug).single();
  return { title: place ? `${place.title} | Good Morning India Holidays` : 'Place' };
}

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');
  :root { --rg-mid:#D4956A; --rg-deep:#B87333; --rg-light:#F2C4A0; --charcoal:#1A1612; --ivory:#FAF7F2; --cream:#F0EBE1; --warm-gray:#6B5D54; }
  .pp { font-family:'Cormorant Garamond',Georgia,serif; background:var(--ivory); color:var(--charcoal); }
  .cinzel { font-family:'Cinzel',serif; }
  .pp-hero { position:relative; height:80vh; min-height:520px; display:flex; align-items:flex-end; padding:64px 80px; background:linear-gradient(135deg,#2a1f14,#1a1612); overflow:hidden; }
  .pp-hero-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  .pp-hero-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(26,22,18,0.85) 0%,rgba(26,22,18,0.3) 60%,transparent 100%); }
  .pp-hero-content { position:relative; z-index:2; max-width:760px; }
  .pp-breadcrumb { font-family:'Cinzel',serif; font-size:0.68rem; letter-spacing:0.3em; color:rgba(255,255,255,0.5); margin-bottom:16px; }
  .pp-breadcrumb a { color:var(--rg-light); text-decoration:none; }
  .pp-h1 { font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.8rem); font-weight:400; color:white; line-height:1.1; margin-bottom:16px; }
  .pp-season { font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.25em; color:var(--rg-light); }
  .pp-body { display:grid; grid-template-columns:1fr 380px; gap:64px; max-width:1200px; margin:0 auto; padding:80px 40px; align-items:start; }
  .pp-description { font-size:1.15rem; line-height:1.95; color:var(--warm-gray); font-weight:300; white-space:pre-wrap; }
  .pp-highlights { background:white; border:1px solid #e8e0d8; padding:32px; margin-bottom:28px; }
  .pp-sidebar-title { font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.3em; color:var(--rg-mid); margin-bottom:20px; }
  .pp-hl-item { display:flex; gap:12px; margin-bottom:14px; font-size:1rem; color:var(--charcoal); line-height:1.5; }
  .pp-hl-dot { color:var(--rg-mid); flex-shrink:0; margin-top:2px; }
  .pp-links { background:var(--charcoal); padding:28px 32px; }
  .pp-link-item { display:block; color:var(--rg-light); font-family:'Cinzel',serif; font-size:0.7rem; letter-spacing:0.2em; text-decoration:none; padding:10px 0; border-bottom:1px solid rgba(196,165,116,0.15); transition:color 0.2s; }
  .pp-link-item:last-child { border-bottom:none; }
  .pp-link-item:hover { color:white; }
  .pp-gallery-section { background:var(--cream); padding:80px 40px; }
  .pp-gallery-container { max-width:1200px; margin:0 auto; }
  .pp-section-eye { font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.4em; color:var(--rg-mid); text-align:center; margin-bottom:16px; }
  .pp-section-title { font-family:'Cinzel',serif; font-size:clamp(1.4rem,3vw,2rem); font-weight:400; text-align:center; margin-bottom:48px; }
  .pp-divider { width:60px; height:1.5px; background:linear-gradient(90deg,transparent,var(--rg-mid),transparent); margin:0 auto 16px; }
  .pp-gallery { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; }
  .pp-gallery-item { overflow:hidden; }
  .pp-gallery img { width:100%; height:240px; object-fit:cover; display:block; transition:transform 0.4s; }
  .pp-gallery img:hover { transform:scale(1.03); }
  .pp-inq-section { padding:80px 40px; background:var(--ivory); }
  @media(max-width:900px) { .pp-body { grid-template-columns:1fr; } .pp-hero { padding:40px; } }
  @media(max-width:640px) { .pp-gallery-section,.pp-inq-section { padding:60px 20px; } }
`;

export default async function PlacePage({ params }) {
  const { regionSlug, stateSlug, placeSlug } = await params;

  const { data: place } = await supabase
    .from('places')
    .select('*, states(title,slug,regions(title,slug))')
    .eq('slug', placeSlug)
    .single();

  if (!place) notFound();

  const region = place.states?.regions;
  const state  = place.states;

  return (
    <div className="pp">
      <style>{STYLE}</style>

      <div className="pp-hero">
        {place.hero_image && <img src={place.hero_image} alt={place.title} className="pp-hero-img" />}
        <div className="pp-hero-overlay" />
        <div className="pp-hero-content">
          <p className="pp-breadcrumb">
            <Link href={`/explore/${regionSlug}`}>{region?.title}</Link>
            {' '}›{' '}
            <Link href={`/explore/${regionSlug}/${stateSlug}`}>{state?.title}</Link>
            {' '}›{' '}{place.title}
          </p>
          <h1 className="pp-h1">{place.title}</h1>
          {place.best_season && (
            <p className="pp-season">✦ &nbsp; BEST VISITED IN {place.best_season.toUpperCase()}</p>
          )}
        </div>
      </div>

      <div className="pp-body">
        <div>
          <p className="pp-description">{place.description}</p>
        </div>
        <div>
          {(place.highlights || []).length > 0 && (
            <div className="pp-highlights">
              <p className="pp-sidebar-title">HIGHLIGHTS</p>
              {place.highlights.map((h, i) => (
                <div key={i} className="pp-hl-item">
                  <span className="pp-hl-dot">◆</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}
          {(place.links || []).length > 0 && (
            <div className="pp-links">
              <p className="pp-sidebar-title" style={{ color: 'var(--rg-light)' }}>USEFUL LINKS</p>
              {place.links.map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="pp-link-item">
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {(place.gallery || []).length > 0 && (
        <div className="pp-gallery-section">
          <div className="pp-gallery-container">
            <p className="pp-section-eye">PHOTO GALLERY</p>
            <div className="pp-divider" />
            <h2 className="pp-section-title">Glimpses of {place.title}</h2>
            <div className="pp-gallery">
              {place.gallery.map((url, i) => (
                <div key={i} className="pp-gallery-item">
                  <img src={url} alt={`${place.title} ${i + 1}`} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="pp-inq-section">
        <p className="pp-section-eye">PLAN YOUR VISIT</p>
        <div className="pp-divider" />
        <h2 className="pp-section-title">Enquire About {place.title}</h2>
        <InquiryForm interestPlace={place.title} />
      </div>
    </div>
  );
}