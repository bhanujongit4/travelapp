
'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const BRAND_NAME = 'GOOD MORNING INDIA HOLIDAYS';

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');

  :root {
    --rg-light:  #F2C4A0;
    --rg-mid:    #D4956A;
    --rg-deep:   #B87333;
    --charcoal:  #1A1612;
    --charcoal2: #211910;
    --nav-h:     68px;
  }

  .gmih * { box-sizing: border-box; margin: 0; padding: 0; }

  .gmih-shell {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--charcoal);
    border-bottom: 1px solid rgba(196,165,116,0.22);
    box-shadow: 0 2px 28px rgba(0,0,0,0.55);
    font-family: 'Cormorant Garamond', Georgia, serif;
  }

  .gmih-nav {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .gmih-brand {
    display: flex;
    align-items: center;
    gap: 13px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .gmih-logo-box {
    width: 46px;
    height: 46px;
    border: 1.5px solid var(--rg-mid);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--rg-light);
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    letter-spacing: 0.1em;
    overflow: hidden;
  }
  .gmih-brand-text { display: flex; flex-direction: column; gap: 2px; }
  .gmih-brand-name {
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    color: white;
    line-height: 1;
    white-space: nowrap;
  }
  .gmih-brand-sub {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.8rem;
    font-weight: 300;
    font-style: italic;
    color: rgba(196,165,116,0.65);
    line-height: 1;
    white-space: nowrap;
  }

  .gmih-links {
    display: flex;
    align-items: center;
    gap: 4px;
    height: 100%;
  }
  .gmih-link {
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    letter-spacing: 0.28em;
    color: rgba(255,255,255,0.74);
    text-decoration: none;
    padding: 10px 16px;
    transition: color 0.2s;
    white-space: nowrap;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .gmih-link:hover { color: var(--rg-light); }

  .gmih-explore-wrap {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .gmih-explore-btn {
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    letter-spacing: 0.28em;
    color: rgba(255,255,255,0.74);
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
    transition: color 0.2s;
    white-space: nowrap;
  }
  .gmih-explore-btn:hover { color: var(--rg-light); }
  .gmih-explore-btn.open  { color: var(--rg-light); }

  .gmih-chevron {
    width: 6px;
    height: 6px;
    border-right: 1.5px solid currentColor;
    border-bottom: 1.5px solid currentColor;
    transform: rotate(45deg);
    transition: transform 0.25s;
    flex-shrink: 0;
    margin-top: -2px;
  }
  .gmih-chevron.open { transform: rotate(-135deg); margin-top: 3px; }

  .gmih-mega {
    position: absolute;
    top: calc(100% + 1px);
    right: 0;
    width: min(92vw, 980px);
    max-height: min(78vh, 760px);
    overflow-y: auto;
    background:
      linear-gradient(180deg, rgba(42,32,22,0.98) 0%, rgba(28,22,16,0.98) 100%);
    border: 1px solid rgba(196,165,116,0.26);
    border-top: 2px solid var(--rg-mid);
    box-shadow: 0 20px 60px rgba(0,0,0,0.7);
    padding: 30px 32px 34px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 22px;
    animation: megaSlide 0.18s ease forwards;
    transform-origin: top right;
  }
  @keyframes megaSlide {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0);   }
  }
  .gmih-mega-empty {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.02rem;
    color: rgba(255,255,255,0.46);
    font-style: italic;
    grid-column: 1/-1;
  }
  .gmih-mega-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 18px 18px 16px;
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(196,165,116,0.12);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
  }
  .gmih-region-link {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    color: #f4d3b8;
    text-decoration: none;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(196,165,116,0.18);
    display: block;
    transition: color 0.2s;
  }
  .gmih-region-link:hover { color: white; }
  .gmih-state-block {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-left: 14px;
    border-left: 1px solid rgba(196,165,116,0.16);
  }
  .gmih-state-link {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.12rem;
    font-weight: 600;
    color: rgba(255,255,255,0.92);
    text-decoration: none;
    transition: color 0.2s;
    line-height: 1.1;
  }
  .gmih-state-link:hover { color: var(--rg-light); }
  .gmih-place-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 0;
  }
  .gmih-place-pill {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.92rem;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    padding: 0;
    border: none;
    transition: color 0.2s, transform 0.2s;
    white-space: normal;
    line-height: 1.25;
  }
  .gmih-place-pill:hover {
    color: #fff2e6;
    transform: translateX(2px);
  }

  /* Hamburger */
  .gmih-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: none;
    border: 1px solid rgba(196,165,116,0.25);
    cursor: pointer;
    padding: 10px 12px;
    transition: border-color 0.2s;
    flex-shrink: 0;
  }
  .gmih-hamburger:hover { border-color: var(--rg-mid); }
  .gmih-hamburger span {
    display: block;
    width: 20px;
    height: 1.5px;
    background: rgba(255,255,255,0.7);
    transition: all 0.25s;
    transform-origin: center;
  }
  .gmih-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .gmih-hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
  .gmih-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  /* Drawer */
  .gmih-drawer {
    background: var(--charcoal2);
    border-top: 1px solid rgba(196,165,116,0.15);
    border-bottom: 2px solid var(--rg-mid);
    overflow-y: auto;
    max-height: calc(100vh - var(--nav-h));
    animation: drawerIn 0.2s ease forwards;
  }
  @keyframes drawerIn {
    from { opacity:0; transform:translateY(-6px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .gmih-drawer-inner { padding: 8px 24px 32px; display: flex; flex-direction: column; }
  .gmih-m-link {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    color: rgba(255,255,255,0.74);
    text-decoration: none;
    padding: 14px 0;
    border-bottom: 1px solid rgba(196,165,116,0.1);
    display: block;
    transition: color 0.2s;
  }
  .gmih-m-link:hover { color: var(--rg-light); }
  .gmih-m-explore-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid rgba(196,165,116,0.1);
    cursor: pointer;
    user-select: none;
  }
  .gmih-m-explore-label {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    color: rgba(255,255,255,0.74);
    transition: color 0.2s;
  }
  .gmih-m-explore-row:hover .gmih-m-explore-label { color: var(--rg-light); }
  .gmih-m-regions { display: flex; flex-direction: column; gap: 20px; padding: 20px 0 0 4px; }
  .gmih-m-region  { display: flex; flex-direction: column; gap: 10px; }
  .gmih-m-region-title {
    font-family: 'Cinzel', serif;
    font-size: 0.66rem;
    letter-spacing: 0.22em;
    color: #f4d3b8;
    text-decoration: none;
  }
  .gmih-m-state { padding-left: 12px; border-left: 1px solid rgba(196,165,116,0.18); display:flex; flex-direction:column; gap:8px; }
  .gmih-m-state-link {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.08rem;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    transition: color 0.2s;
  }
  .gmih-m-state-link:hover { color: var(--rg-light); }
  .gmih-m-places { display:flex; flex-wrap:wrap; gap:7px; }
  .gmih-m-place {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.62);
    text-decoration: none;
    padding: 3px 9px;
    border: 1px solid rgba(196,165,116,0.14);
    transition: all 0.2s;
  }
  .gmih-m-place:hover { color: var(--rg-light); border-color: rgba(196,165,116,0.4); }

  @media (max-width: 1180px) {
    .gmih-mega {
      width: min(94vw, 860px);
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    }
  }

  @media (max-width: 900px) {
    .gmih-links     { display: none; }
    .gmih-hamburger { display: flex; }
    .gmih-nav       { padding: 0 20px; }
  }
  @media (max-width: 520px) {
    .gmih-brand-sub  { display: none; }
    .gmih-brand-name { font-size: 0.58rem; letter-spacing: 0.1em; }
    .gmih-logo-box   { width: 38px; height: 38px; }
  }
`;

export default function NavbarClient({ regions }) {
  const [megaOpen,    setMegaOpen]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const wrapRef = useRef(null);

  // close mega on outside click
  useEffect(() => {
    function onDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function closeMega()   { setMegaOpen(false); }
  function closeDrawer() { setDrawerOpen(false); }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <header className="gmih gmih-shell">
        <nav className="gmih-nav">

          {/* Brand */}
          <Link href="/" className="gmih-brand" onClick={closeDrawer}>
            <div className="gmih-logo-box">LOGO</div>
            <div className="gmih-brand-text">
              <p className="gmih-brand-name">{BRAND_NAME}</p>
              <p className="gmih-brand-sub">Crafted journeys across India</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="gmih-links">
            <Link href="/"      className="gmih-link">Home</Link>
            <Link href="/about" className="gmih-link">About Us</Link>
            <Link href="/reviews" className="gmih-link">Reviews</Link>
            <Link href="/stories" className="gmih-link">Stories</Link>

            <div className="gmih-explore-wrap" ref={wrapRef}>
              <button
                className={`gmih-explore-btn${megaOpen ? ' open' : ''}`}
                onClick={() => setMegaOpen(o => !o)}
              >
                EXPLORE
                <span className={`gmih-chevron${megaOpen ? ' open' : ''}`} />
              </button>

              {megaOpen && (
                <div className="gmih-mega">
                  {regions.length === 0
                    ? <p className="gmih-mega-empty">No destinations added yet.</p>
                    : regions.map(region => (
                      <div key={region.id} className="gmih-mega-col">
                        <Link href={`/explore/${region.slug}`} className="gmih-region-link" onClick={closeMega}>
                          {region.title}
                        </Link>
                        {region.states.map(state => (
                          <div key={state.id} className="gmih-state-block">
                            <Link href={`/explore/${region.slug}/${state.slug}`} className="gmih-state-link" onClick={closeMega}>
                              {state.title}
                            </Link>
                            <div className="gmih-place-row">
                              {state.places.map(place => (
                                <Link key={place.id} href={`/explore/${region.slug}/${state.slug}/${place.slug}`} className="gmih-place-pill" onClick={closeMega}>
                                  {place.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* Hamburger */}
          <button
            className={`gmih-hamburger${drawerOpen ? ' open' : ''}`}
            onClick={() => setDrawerOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </nav>

        {/* Mobile drawer — inside header, below nav bar */}
        {drawerOpen && (
          <div className="gmih-drawer">
            <div className="gmih-drawer-inner">
              <Link href="/"      className="gmih-m-link" onClick={closeDrawer}>Home</Link>
              <Link href="/about" className="gmih-m-link" onClick={closeDrawer}>About Us</Link>
              <Link href="/reviews" className="gmih-m-link" onClick={closeDrawer}>Reviews</Link>
              <Link href="/stories" className="gmih-m-link" onClick={closeDrawer}>Stories</Link>

              <div className="gmih-m-explore-row" onClick={() => setExploreOpen(o => !o)}>
                <span className="gmih-m-explore-label">EXPLORE</span>
                <span className={`gmih-chevron${exploreOpen ? ' open' : ''}`} style={{ borderColor: 'rgba(196,165,116,0.6)' }} />
              </div>

              {exploreOpen && (
                <div className="gmih-m-regions">
                  {regions.length === 0
                    ? <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'0.9rem', color:'rgba(255,255,255,0.3)', fontStyle:'italic' }}>No destinations yet.</p>
                    : regions.map(region => (
                      <div key={region.id} className="gmih-m-region">
                        <Link href={`/explore/${region.slug}`} className="gmih-m-region-title" onClick={closeDrawer}>
                          {region.title}
                        </Link>
                        {region.states.map(state => (
                          <div key={state.id} className="gmih-m-state">
                            <Link href={`/explore/${region.slug}/${state.slug}`} className="gmih-m-state-link" onClick={closeDrawer}>
                              {state.title}
                            </Link>
                            <div className="gmih-m-places">
                              {state.places.map(place => (
                                <Link key={place.id} href={`/explore/${region.slug}/${state.slug}/${place.slug}`} className="gmih-m-place" onClick={closeDrawer}>
                                  {place.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
