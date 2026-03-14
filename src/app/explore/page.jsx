import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

export const metadata = {
  title: 'Explore India | Good Morning India Holidays',
  description: 'Browse regions, states, and destination pages across India.',
};

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

  :root { --rg-mid:#D4956A; --rg-deep:#B87333; --rg-light:#F2C4A0; --charcoal:#1A1612; --ivory:#FAF7F2; --cream:#F0EBE1; --warm-gray:#6B5D54; }
  .explore-root { font-family:'Cormorant Garamond', Georgia, serif; min-height: 100vh; background: var(--ivory); color: var(--charcoal); }
  .cinzel { font-family:'Cinzel',serif; }
  .explore-hero { background: linear-gradient(135deg,#2a1f14,#1a1612); color: white; padding: 90px 40px 70px; text-align: center; }
  .explore-eye { font-size:0.75rem; letter-spacing:0.38em; color: var(--rg-light); margin-bottom: 16px; }
  .explore-title { font-size: clamp(2rem,5vw,3.2rem); font-weight: 400; margin-bottom: 14px; }
  .explore-desc { max-width: 680px; margin: 0 auto; color: rgba(255,255,255,0.82); line-height: 1.75; font-size: 1.08rem; }
  .explore-wrap { max-width: 1180px; margin: 0 auto; padding: 70px 40px; }
  .explore-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap: 20px; }
  .explore-card { border: 1px solid #e8e0d8; background: white; text-decoration: none; color: inherit; padding: 28px; display: block; }
  .explore-card:hover { box-shadow: 0 16px 44px rgba(180,120,60,0.15); transform: translateY(-3px); transition: all .25s ease; }
  .explore-card-eye { color: var(--rg-mid); letter-spacing: .22em; font-size: .68rem; margin-bottom: 12px; }
  .explore-card-title { font-family:'Cinzel',serif; font-size: 1.25rem; margin-bottom: 10px; }
  .explore-card-meta { color: var(--warm-gray); font-size: .95rem; }
  .explore-card-cta { margin-top: 14px; color: var(--rg-mid); letter-spacing: .18em; font-size: .72rem; }
  @media (max-width: 640px) { .explore-wrap { padding: 56px 20px; } .explore-hero { padding: 70px 20px 56px; } }
`;

export default async function ExploreIndexPage() {
  const { data: regions } = await supabase
    .from('regions')
    .select('id,title,slug,states(id)');

  const safeRegions = (regions || []).filter((region) => region?.slug);

  return (
    <div className="explore-root">
      <style>{STYLE}</style>
      <section className="explore-hero">
        <p className="cinzel explore-eye">DISCOVER BY REGION</p>
        <h1 className="cinzel explore-title">Explore India Your Way</h1>
        <p className="explore-desc">
          Start with a region, then narrow down into states and destination pages with complete details,
          season context, and curated travel notes.
        </p>
      </section>

      <section className="explore-wrap">
        <div className="explore-grid">
          {safeRegions.map((region) => (
            <Link key={region.id} href={`/explore/${region.slug}`} className="explore-card">
              <p className="cinzel explore-card-eye">REGION</p>
              <h2 className="explore-card-title">{region.title}</h2>
              <p className="explore-card-meta">{(region.states || []).length} states and territories</p>
              <p className="cinzel explore-card-cta">EXPLORE REGION</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
