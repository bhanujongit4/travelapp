import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

export const metadata = {
  title: 'Traveller Reviews | Good Morning India Holidays',
  description: 'Read traveller reviews, testimonials, and journey reflections from Good Morning India Holidays guests.',
};

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

  :root { --rg-mid:#D4956A; --rg-deep:#B87333; --rg-light:#F2C4A0; --charcoal:#1A1612; --ivory:#FAF7F2; --cream:#F0EBE1; --warm-gray:#6B5D54; }
  .reviews-root { font-family:'Cormorant Garamond', Georgia, serif; min-height:100vh; background:var(--ivory); color:var(--charcoal); }
  .cinzel { font-family:'Cinzel', serif; }
  .reviews-hero { padding:92px 24px 72px; background:linear-gradient(135deg, #2a1f14, #1a1612); text-align:center; color:white; }
  .reviews-eye { font-size:0.75rem; letter-spacing:0.38em; color:var(--rg-light); margin-bottom:14px; }
  .reviews-title { font-size:clamp(2rem, 5vw, 3.4rem); font-weight:400; margin-bottom:16px; }
  .reviews-desc { max-width:740px; margin:0 auto; color:rgba(255,255,255,0.82); font-size:1.08rem; line-height:1.8; }
  .reviews-wrap { max-width:1180px; margin:0 auto; padding:72px 24px 92px; }
  .reviews-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px; }
  .review-card { background:white; border:1px solid #e8e0d8; padding:30px; display:flex; flex-direction:column; gap:18px; }
  .review-image-wrap {
    width:100%; min-height:240px; background:var(--cream); border:1px solid #efe6dc;
    display:flex; align-items:center; justify-content:center; padding:16px;
  }
  .review-thumb { width:100%; max-height:360px; object-fit:contain; display:block; background:var(--cream); }
  .review-meta { display:flex; flex-direction:column; gap:4px; }
  .review-name { font-size:1.22rem; font-weight:500; }
  .review-location { color:var(--warm-gray); font-size:0.95rem; }
  .review-stars { color:var(--rg-deep); letter-spacing:0.15em; font-size:0.82rem; }
  .review-headline { font-size:1.2rem; line-height:1.35; font-weight:500; }
  .review-text { font-size:1.04rem; color:var(--warm-gray); line-height:1.8; }
  .review-link { display:inline-flex; align-items:center; gap:10px; color:var(--rg-deep); text-decoration:none; font-family:'Cinzel', serif; font-size:0.68rem; letter-spacing:0.18em; text-transform:uppercase; }
  .review-link:hover { color:var(--charcoal); }
  .reviews-empty { padding:50px 24px; text-align:center; color:var(--warm-gray); font-size:1.05rem; font-style:italic; }
`;

function stars(rating = 5) {
  return '★'.repeat(Math.max(1, Math.min(5, Number(rating) || 5)));
}

export default async function ReviewsPage() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const reviews = error ? [] : (data || []);

  return (
    <div className="reviews-root">
      <style>{STYLE}</style>
      <section className="reviews-hero">
        <p className="cinzel reviews-eye">GUEST REFLECTIONS</p>
        <h1 className="cinzel reviews-title">Reviews From The Road</h1>
        <p className="reviews-desc">
          Real words from guests who travelled with us across India, from quick escapes to deeply layered journeys.
        </p>
      </section>

      <section className="reviews-wrap">
        {reviews.length === 0 ? (
          <p className="reviews-empty">Reviews will appear here as soon as they are published from the admin panel.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => {
              const cardContent = (
                <>
                  {review.image_url && (
                    <div className="review-image-wrap">
                      <img className="review-thumb" src={review.image_url} alt={review.name || review.headline} />
                    </div>
                  )}
                  <div className="review-meta">
                    <p className="cinzel review-name">{review.name || 'Guest Traveller'}</p>
                    {review.location && <p className="review-location">{review.location}</p>}
                    <p className="cinzel review-stars">{stars(review.rating)}</p>
                  </div>
                  <h2 className="cinzel review-headline">{review.headline}</h2>
                  <p className="review-text">{review.text}</p>
                 
                </>
              );

              return (
                <article key={review.id} className="review-card">
                  {review.image_link ? (
                    <Link href={review.image_link} className="review-link" style={{ display: 'block', textDecoration: 'none' }}>
                      <div style={{ color: 'inherit' }}>{cardContent}</div>
                    </Link>
                  ) : (
                    cardContent
                  )}
                  {!review.image_link && review.cta_label && review.cta_url && (
                    <Link href={review.cta_url} className="review-link">{review.cta_label}</Link>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
