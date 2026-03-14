import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

export const metadata = {
  title: 'Stories | Good Morning India Holidays',
  description: 'Travel stories, blog posts, and editorial notes from Good Morning India Holidays.',
};

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

  :root { --rg-mid:#D4956A; --rg-deep:#B87333; --rg-light:#F2C4A0; --charcoal:#1A1612; --ivory:#FAF7F2; --cream:#F0EBE1; --warm-gray:#6B5D54; }
  .stories-root { font-family:'Cormorant Garamond', Georgia, serif; min-height:100vh; background:var(--ivory); color:var(--charcoal); }
  .cinzel { font-family:'Cinzel', serif; }
  .stories-hero { padding:96px 24px 74px; text-align:center; color:white; background:radial-gradient(circle at top, rgba(212,149,106,0.22), transparent 40%), linear-gradient(135deg, #1e1813, #2b2117 60%, #1a1612); }
  .stories-eye { font-size:0.75rem; letter-spacing:0.38em; color:var(--rg-light); margin-bottom:14px; }
  .stories-title { font-size:clamp(2rem, 5vw, 3.5rem); font-weight:400; margin-bottom:16px; }
  .stories-desc { max-width:760px; margin:0 auto; color:rgba(255,255,255,0.82); font-size:1.08rem; line-height:1.8; }
  .stories-wrap { max-width:1160px; margin:0 auto; padding:72px 24px 96px; display:grid; gap:30px; }
  .story-card { background:white; border:1px solid #e8e0d8; overflow:hidden; }
  .story-cover-wrap {
    width:100%; min-height:320px; background:var(--cream);
    display:flex; align-items:center; justify-content:center; padding:20px;
  }
  .story-cover { width:100%; max-height:720px; object-fit:contain; display:block; background:var(--cream); }
  .story-body { padding:34px 30px 32px; }
  .story-meta { display:flex; flex-wrap:wrap; gap:12px; color:var(--warm-gray); font-size:0.95rem; margin-bottom:16px; }
  .story-title { font-size:clamp(1.6rem, 3vw, 2.4rem); font-weight:400; line-height:1.2; margin-bottom:12px; }
  .story-subtitle { font-size:1.12rem; color:var(--rg-deep); margin-bottom:18px; }
  .story-excerpt { font-size:1.08rem; color:var(--warm-gray); line-height:1.75; margin-bottom:18px; }
  .story-paragraphs { display:grid; gap:14px; margin-bottom:22px; }
  .story-paragraph { font-size:1.08rem; color:var(--charcoal); line-height:1.82; }
  .story-tags { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
  .story-tag { border:1px solid rgba(212,149,106,0.3); color:var(--rg-deep); padding:5px 10px; font-size:0.8rem; letter-spacing:0.08em; }
  .story-link { display:inline-flex; align-items:center; gap:10px; color:var(--rg-deep); text-decoration:none; font-family:'Cinzel', serif; font-size:0.68rem; letter-spacing:0.18em; text-transform:uppercase; }
  .story-link:hover { color:var(--charcoal); }
  .stories-empty { padding:50px 24px; text-align:center; color:var(--warm-gray); font-size:1.05rem; font-style:italic; }
`;

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', { dateStyle: 'medium' });
}

function paragraphs(text) {
  return (text || '').split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
}

export default async function StoriesPage() {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });

  const stories = error ? [] : (data || []);

  return (
    <div className="stories-root">
      <style>{STYLE}</style>
      <section className="stories-hero">
        <p className="cinzel stories-eye">EDITORIAL JOURNAL</p>
        <h1 className="cinzel stories-title">Stories From Across India</h1>
        <p className="stories-desc">
          A home for travel notes, destination essays, guest observations, and long-form inspiration published from the admin panel.
        </p>
      </section>

      <section className="stories-wrap">
        {stories.length === 0 ? (
          <p className="stories-empty">Stories will appear here once they are published from the admin panel.</p>
        ) : (
          stories.map((story) => (
            <article key={story.id} className="story-card" id={story.slug}>
              {story.cover_image && (
                story.image_link ? (
                  <Link href={story.image_link} className="story-cover-wrap">
                    <img className="story-cover" src={story.cover_image} alt={story.title} />
                  </Link>
                ) : (
                  <div className="story-cover-wrap">
                    <img className="story-cover" src={story.cover_image} alt={story.title} />
                  </div>
                )
              )}
              <div className="story-body">
                <div className="story-meta">
                  {story.author_name && <span>{story.author_name}</span>}
                  {story.published_at && <span>{formatDate(story.published_at)}</span>}
                  {story.slug && <span>#{story.slug}</span>}
                </div>
                <h2 className="cinzel story-title">{story.title}</h2>
                {story.subtitle && <p className="story-subtitle">{story.subtitle}</p>}
                {story.excerpt && <p className="story-excerpt">{story.excerpt}</p>}
                <div className="story-paragraphs">
                  {paragraphs(story.body).map((paragraph, index) => (
                    <p key={index} className="story-paragraph">{paragraph}</p>
                  ))}
                </div>
                {Array.isArray(story.tags) && story.tags.length > 0 && (
                  <div className="story-tags">
                    {story.tags.map((tag, index) => <span key={index} className="story-tag">{tag}</span>)}
                  </div>
                )}
                {story.cta_label && story.cta_url && (
                  <Link href={story.cta_url} className="story-link">{story.cta_label}</Link>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
