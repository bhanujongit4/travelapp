'use client';
// app/admin/page.jsx
// Password-gated admin CMS panel for Bharat Voyages
// Manages: Regions → States → Places, and reads Inquiries

import { useState, useEffect, useCallback } from 'react';

// ── Styles ────────────────────────────────────────────────────────────────────
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Cinzel:wght@400;500;600;700&display=swap');

  :root {
    --rg-mid:   #D4956A;
    --rg-deep:  #B87333;
    --rg-light: #F2C4A0;
    --charcoal: #1A1612;
    --ivory:    #FAF7F2;
    --cream:    #F0EBE1;
    --warm-gray:#6B5D54;
    --sidebar-w: 260px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .adm { font-family:'Cormorant Garamond',Georgia,serif; background:var(--ivory); color:var(--charcoal); min-height:100vh; }
  .cinzel { font-family:'Cinzel',serif; }

  /* ── Login ── */
  .adm-login { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--charcoal); }
  .adm-login-box { background:#221a12; border:1px solid rgba(196,165,116,0.25); padding:56px 48px; width:100%; max-width:440px; text-align:center; }
  .adm-login-title { font-family:'Cinzel',serif; font-size:1.4rem; color:white; margin-bottom:8px; letter-spacing:0.1em; }
  .adm-login-sub { font-size:0.95rem; color:rgba(255,255,255,0.45); margin-bottom:40px; }
  .adm-input { width:100%; background:rgba(255,255,255,0.07); border:1px solid rgba(196,165,116,0.3); padding:14px 18px; font-family:'Cormorant Garamond',serif; font-size:1rem; color:white; outline:none; transition:border-color 0.25s; margin-bottom:16px; display:block; }
  .adm-input:focus { border-color:var(--rg-mid); }
  .adm-input::placeholder { color:rgba(255,255,255,0.3); }
  .adm-btn { background:linear-gradient(135deg,var(--rg-mid),var(--rg-deep)); color:white; border:none; padding:14px 40px; font-family:'Cinzel',serif; font-size:0.75rem; letter-spacing:0.25em; cursor:pointer; transition:opacity 0.25s; width:100%; }
  .adm-btn:hover { opacity:0.88; }
  .adm-btn:disabled { opacity:0.5; cursor:not-allowed; }
  .adm-btn-sm { background:transparent; border:1px solid var(--rg-mid); color:var(--rg-mid); padding:8px 20px; font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.2em; cursor:pointer; transition:all 0.2s; }
  .adm-btn-sm:hover { background:var(--rg-mid); color:white; }
  .adm-btn-danger { background:transparent; border:1px solid #c0392b; color:#c0392b; padding:6px 14px; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.15em; cursor:pointer; transition:all 0.2s; }
  .adm-btn-danger:hover { background:#c0392b; color:white; }
  .adm-err { color:#f87171; font-size:0.9rem; margin-bottom:12px; }

  /* ── Shell ── */
  .adm-shell { display:flex; min-height:100vh; }

  /* ── Sidebar ── */
  .adm-sidebar { width:var(--sidebar-w); background:var(--charcoal); flex-shrink:0; display:flex; flex-direction:column; padding:32px 0; }
  .adm-sidebar-brand { font-family:'Cinzel',serif; font-size:0.85rem; letter-spacing:0.2em; color:var(--rg-light); padding:0 24px 32px; border-bottom:1px solid rgba(196,165,116,0.15); margin-bottom:24px; }
  .adm-sidebar-brand span { display:block; font-size:0.6rem; letter-spacing:0.3em; color:rgba(255,255,255,0.35); margin-top:4px; }
  .adm-nav-item { display:block; width:100%; background:none; border:none; text-align:left; padding:12px 24px; font-family:'Cinzel',serif; font-size:0.7rem; letter-spacing:0.2em; color:rgba(255,255,255,0.55); cursor:pointer; transition:all 0.2s; border-left:2px solid transparent; }
  .adm-nav-item:hover { color:white; background:rgba(255,255,255,0.05); }
  .adm-nav-item.active { color:var(--rg-light); border-left-color:var(--rg-mid); background:rgba(196,165,116,0.08); }
  .adm-sidebar-bottom { margin-top:auto; padding:24px; border-top:1px solid rgba(196,165,116,0.15); }
  .adm-logout { font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.2em; color:rgba(255,255,255,0.35); background:none; border:none; cursor:pointer; transition:color 0.2s; }
  .adm-logout:hover { color:var(--rg-light); }

  /* ── Main area ── */
  .adm-main { flex:1; overflow-y:auto; }
  .adm-topbar { background:white; border-bottom:1px solid #e8e0d8; padding:20px 40px; display:flex; align-items:center; justify-content:space-between; }
  .adm-topbar-title { font-family:'Cinzel',serif; font-size:1rem; font-weight:500; letter-spacing:0.05em; }
  .adm-content { padding:40px; }

  /* ── Cards ── */
  .adm-card { background:white; border:1px solid #e8e0d8; padding:28px; margin-bottom:20px; }
  .adm-card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .adm-card-title { font-family:'Cinzel',serif; font-size:1rem; font-weight:500; }
  .adm-card-meta { font-size:0.85rem; color:var(--warm-gray); margin-bottom:8px; }
  .adm-card-actions { display:flex; gap:10px; align-items:center; }
  .adm-badge { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; padding:3px 10px; background:rgba(212,149,106,0.15); color:var(--rg-deep); border:1px solid rgba(212,149,106,0.3); }

  /* ── Forms ── */
  .adm-form { background:var(--cream); border:1px solid #e0d6ca; padding:32px; margin-bottom:28px; }
  .adm-form-title { font-family:'Cinzel',serif; font-size:0.85rem; letter-spacing:0.2em; color:var(--rg-mid); margin-bottom:24px; }
  .adm-field-group { margin-bottom:18px; }
  .adm-label { font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.25em; color:var(--warm-gray); display:block; margin-bottom:6px; }
  .adm-text-input { width:100%; border:1px solid #d8cfc5; background:white; padding:12px 16px; font-family:'Cormorant Garamond',serif; font-size:1rem; color:var(--charcoal); outline:none; transition:border-color 0.2s; }
  .adm-text-input:focus { border-color:var(--rg-mid); }
  .adm-textarea { width:100%; border:1px solid #d8cfc5; background:white; padding:12px 16px; font-family:'Cormorant Garamond',serif; font-size:1rem; color:var(--charcoal); outline:none; transition:border-color 0.2s; resize:vertical; min-height:120px; }
  .adm-textarea:focus { border-color:var(--rg-mid); }
  .adm-textarea-tall { min-height:200px; }
  .adm-select { width:100%; border:1px solid #d8cfc5; background:white; padding:12px 16px; font-family:'Cormorant Garamond',serif; font-size:1rem; color:var(--charcoal); outline:none; }
  .adm-form-row { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .adm-form-row-3 { display:grid; grid-template-columns:repeat(3, 1fr); gap:20px; }
  .adm-hint { font-size:0.82rem; color:var(--warm-gray); margin-top:5px; font-style:italic; }
  .adm-upload-box { border:1px dashed rgba(212,149,106,0.5); background:rgba(255,255,255,0.6); padding:14px; margin-top:10px; }
  .adm-file-input { display:block; width:100%; font-family:'Cormorant Garamond',serif; font-size:0.95rem; color:var(--warm-gray); }
  .adm-upload-row { display:flex; gap:12px; align-items:center; margin-top:10px; flex-wrap:wrap; }
  .adm-upload-note { font-size:0.82rem; color:var(--warm-gray); }
  .adm-checkbox-row { display:flex; align-items:center; gap:10px; }
  .adm-checkbox { width:18px; height:18px; accent-color:var(--rg-deep); }
  .adm-thumb { width:72px; height:72px; object-fit:cover; flex-shrink:0; border:1px solid #e0d6ca; background:var(--cream); }
  .adm-pill-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
  .adm-pill { font-size:0.8rem; color:var(--warm-gray); background:var(--cream); padding:3px 10px; border:1px solid #e0d6ca; }

  /* ── Inline links editor ── */
  .adm-link-row { display:grid; grid-template-columns:1fr 1fr auto; gap:10px; margin-bottom:10px; align-items:center; }
  .adm-link-add { font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.2em; color:var(--rg-mid); background:none; border:1px dashed rgba(212,149,106,0.5); padding:8px 16px; cursor:pointer; transition:all 0.2s; margin-top:8px; }
  .adm-link-add:hover { background:rgba(212,149,106,0.08); }

  /* ── Inquiries ── */
  .adm-inq-card { background:white; border:1px solid #e8e0d8; border-left:3px solid var(--rg-mid); padding:24px 28px; margin-bottom:16px; }
  .adm-inq-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
  .adm-inq-name { font-family:'Cinzel',serif; font-size:0.95rem; font-weight:500; margin-bottom:4px; }
  .adm-inq-meta { font-size:0.88rem; color:var(--warm-gray); }
  .adm-inq-interest { display:inline-block; font-family:'Cinzel',serif; font-size:0.62rem; letter-spacing:0.2em; padding:4px 12px; background:rgba(212,149,106,0.12); color:var(--rg-deep); border:1px solid rgba(212,149,106,0.3); margin-top:8px; }
  .adm-inq-message { font-size:1rem; color:var(--warm-gray); line-height:1.7; margin-top:12px; font-style:italic; }
  .adm-inq-date { font-size:0.8rem; color:rgba(107,93,84,0.6); }

  /* ── States ── */
  .adm-divider { height:1px; background:linear-gradient(90deg,transparent,rgba(212,149,106,0.3),transparent); margin:32px 0; }
  .adm-empty { text-align:center; padding:48px; color:var(--warm-gray); font-size:1rem; font-style:italic; }
  .adm-success { color:#16a34a; font-size:0.9rem; margin-bottom:12px; font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.15em; }

  @media(max-width:768px) {
    .adm-sidebar { display:none; }
    .adm-form-row { grid-template-columns:1fr; }
    .adm-form-row-3 { grid-template-columns:1fr; }
    .adm-content { padding:20px; }
  }
`;

// ── API helpers ──────────────────────────────────────────────────────────────
function api(path, opts = {}, pw) {
  return fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': pw,
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  }).then(r => r.json());
}

async function uploadAdminFile(file, pw) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'x-admin-password': pw },
    body: formData,
  });

  return response.json();
}

function ImageField({ label, value, placeholder, onChange, pw }) {
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadErr('');
    setUploading(true);
    const res = await uploadAdminFile(file, pw);
    setUploading(false);

    if (res.error) {
      setUploadErr(res.error);
      return;
    }

    onChange(res.url || '');
    e.target.value = '';
  }

  return (
    <div className="adm-field-group">
      <label className="adm-label">{label}</label>
      <input className="adm-text-input" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
      <div className="adm-upload-box">
        <input className="adm-file-input" type="file" accept="image/*" onChange={onFileChange} />
        <div className="adm-upload-row">
          {uploading && <span className="adm-upload-note">Uploading image...</span>}
          {!uploading && <span className="adm-upload-note">Paste an image URL above or upload from your system here.</span>}
          {uploadErr && <span className="adm-err" style={{ marginBottom: 0 }}>{uploadErr}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Sub-panels ───────────────────────────────────────────────────────────────

function RegionsPanel({ pw }) {
  const [regions, setRegions]   = useState([]);
  const [form, setForm]         = useState({ title: '', description: '' });
  const [msg, setMsg]           = useState('');
  const [err, setErr]           = useState('');

  const load = useCallback(() => {
    api('/api/admin/regions', {}, pw).then(d => Array.isArray(d) && setRegions(d));
  }, [pw]);

  useEffect(() => { load(); }, [load]);

  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg('');
    const res = await api('/api/admin/regions', { method: 'POST', body: form }, pw);
    if (res.error) { setErr(res.error); return; }
    setMsg('Region created.'); setForm({ title: '', description: '' }); load();
  }

  async function del(id) {
    if (!confirm('Delete this region and ALL its states/places?')) return;
    await api('/api/admin/regions', { method: 'DELETE', body: { id } }, pw);
    load();
  }

  return (
    <div>
      <div className="adm-form">
        <p className="adm-form-title">ADD NEW REGION (LEVEL 1)</p>
        {err && <p className="adm-err">⚠ {err}</p>}
        {msg && <p className="adm-success">✓ {msg}</p>}
        <div className="adm-field-group">
          <label className="adm-label">REGION TITLE</label>
          <input className="adm-text-input" placeholder="e.g. North India, Crazy Adventures, South India" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <p className="adm-hint">This becomes the top-level grouping. Slug is auto-generated.</p>
        </div>
        <div className="adm-field-group">
          <label className="adm-label">DESCRIPTION (OPTIONAL)</label>
          <textarea className="adm-textarea" placeholder="A short intro shown on the region page..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <button className="adm-btn" onClick={submit} style={{ width: 'auto', padding: '12px 40px' }}>ADD REGION</button>
      </div>

      <div className="adm-divider" />

      {regions.length === 0 ? <p className="adm-empty">No regions yet. Add one above.</p> : regions.map(r => (
        <div key={r.id} className="adm-card">
          <div className="adm-card-header">
            <div>
              <h3 className="adm-card-title">{r.title}</h3>
              <p className="adm-card-meta">Slug: /{r.slug} &nbsp;·&nbsp; {(r.states || []).length} state(s)</p>
            </div>
            <div className="adm-card-actions">
              <span className="adm-badge">REGION</span>
              <button className="adm-btn-danger" onClick={() => del(r.id)}>DELETE</button>
            </div>
          </div>
          {(r.states || []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {r.states.map(s => <span key={s.id} style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', background: 'var(--cream)', padding: '3px 10px', border: '1px solid #e0d6ca' }}>{s.title}</span>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StatesPanel({ pw }) {
  const [regions, setRegions]   = useState([]);
  const [states, setStates]     = useState([]);
  const [form, setForm]         = useState({ region_id: '', title: '', description: '' });
  const [msg, setMsg]           = useState('');
  const [err, setErr]           = useState('');

  useEffect(() => {
    api('/api/admin/regions', {}, pw).then(d => Array.isArray(d) && setRegions(d));
    api('/api/admin/states', {}, pw).then(d => Array.isArray(d) && setStates(d));
  }, [pw]);

  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg('');
    const res = await api('/api/admin/states', { method: 'POST', body: form }, pw);
    if (res.error) { setErr(res.error); return; }
    setMsg('State/UT created.'); setForm(f => ({ ...f, title: '', description: '' }));
    api('/api/admin/states', {}, pw).then(d => Array.isArray(d) && setStates(d));
  }

  async function del(id) {
    if (!confirm('Delete this state and ALL its places?')) return;
    await api('/api/admin/states', { method: 'DELETE', body: { id } }, pw);
    api('/api/admin/states', {}, pw).then(d => Array.isArray(d) && setStates(d));
  }

  return (
    <div>
      <div className="adm-form">
        <p className="adm-form-title">ADD NEW STATE / UNION TERRITORY (LEVEL 2)</p>
        {err && <p className="adm-err">⚠ {err}</p>}
        {msg && <p className="adm-success">✓ {msg}</p>}
        <div className="adm-field-group">
          <label className="adm-label">PARENT REGION</label>
          <select className="adm-select" value={form.region_id} onChange={e => setForm(f => ({ ...f, region_id: e.target.value }))} required>
            <option value="">— Select a region —</option>
            {regions.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
          </select>
        </div>
        <div className="adm-field-group">
          <label className="adm-label">STATE / UT TITLE</label>
          <input className="adm-text-input" placeholder="e.g. Uttarakhand, Lakshadweep, Goa" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
        </div>
        <div className="adm-field-group">
          <label className="adm-label">DESCRIPTION (OPTIONAL)</label>
          <textarea className="adm-textarea" placeholder="Brief intro shown on the state listing page..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
        <button className="adm-btn" onClick={submit} style={{ width: 'auto', padding: '12px 40px' }}>ADD STATE / UT</button>
      </div>

      <div className="adm-divider" />

      {states.length === 0 ? <p className="adm-empty">No states yet.</p> : states.map(s => {
        const parentRegion = regions.find(r => r.id === s.region_id);
        return (
          <div key={s.id} className="adm-card">
            <div className="adm-card-header">
              <div>
                <h3 className="adm-card-title">{s.title}</h3>
                <p className="adm-card-meta">
                  Under: {parentRegion?.title || s.region_id} &nbsp;·&nbsp; Slug: /{s.slug} &nbsp;·&nbsp; {(s.places || []).length} place(s)
                </p>
              </div>
              <div className="adm-card-actions">
                <span className="adm-badge">STATE / UT</span>
                <button className="adm-btn-danger" onClick={() => del(s.id)}>DELETE</button>
              </div>
            </div>
            {(s.places || []).length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {s.places.map(p => <span key={p.id} style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', background: 'var(--cream)', padding: '3px 10px', border: '1px solid #e0d6ca' }}>{p.title}</span>)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PlacesPanel({ pw }) {
  const [states, setStates]   = useState([]);
  const [places, setPlaces]   = useState([]);
  const [editId, setEditId]   = useState(null);
  const [msg, setMsg]         = useState('');
  const [err, setErr]         = useState('');

  const emptyForm = { state_id: '', title: '', hero_image: '', description: '', best_season: '', highlights: '', gallery: '', links: [{ label: '', url: '' }] };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    api('/api/admin/states', {}, pw).then(d => Array.isArray(d) && setStates(d));
    api('/api/admin/places', {}, pw).then(d => Array.isArray(d) && setPlaces(d));
  }, [pw]);

  const reload = () => api('/api/admin/places', {}, pw).then(d => Array.isArray(d) && setPlaces(d));

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function setLink(i, k, v) {
    setForm(f => {
      const links = [...f.links];
      links[i] = { ...links[i], [k]: v };
      return { ...f, links };
    });
  }
  const addLink    = () => setForm(f => ({ ...f, links: [...f.links, { label: '', url: '' }] }));
  const removeLink = i  => setForm(f => ({ ...f, links: f.links.filter((_, j) => j !== i) }));

  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg('');
    const links = form.links.filter(l => l.label && l.url);
    const payload = { ...form, links };
    const res = editId
      ? await api('/api/admin/places', { method: 'PUT',  body: { ...payload, id: editId } }, pw)
      : await api('/api/admin/places', { method: 'POST', body: payload }, pw);
    if (res.error) { setErr(res.error); return; }
    setMsg(editId ? 'Place updated.' : 'Place created.');
    setForm(emptyForm); setEditId(null); reload();
  }

  function startEdit(p) {
    setEditId(p.id);
    setForm({
      state_id:    p.state_id,
      title:       p.title,
      hero_image:  p.hero_image || '',
      description: p.description || '',
      best_season: p.best_season || '',
      highlights:  (p.highlights || []).join('\n'),
      gallery:     (p.gallery || []).join('\n'),
      links:       (p.links && p.links.length) ? p.links : [{ label: '', url: '' }],
    });
    window.scrollTo(0, 0);
  }

  async function del(id) {
    if (!confirm('Delete this place?')) return;
    await api('/api/admin/places', { method: 'DELETE', body: { id } }, pw);
    reload();
  }

  return (
    <div>
      <div className="adm-form">
        <p className="adm-form-title">{editId ? 'EDIT PLACE' : 'ADD NEW PLACE (LEVEL 3)'}</p>
        {err && <p className="adm-err">⚠ {err}</p>}
        {msg && <p className="adm-success">✓ {msg}</p>}

        <div className="adm-form-row">
          <div className="adm-field-group">
            <label className="adm-label">PARENT STATE / UT</label>
            <select className="adm-select" value={form.state_id} onChange={set('state_id')} required>
              <option value="">— Select state —</option>
              {states.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="adm-field-group">
            <label className="adm-label">PLACE TITLE</label>
            <input className="adm-text-input" placeholder="e.g. Rishikesh, Coorg, Hampi" value={form.title} onChange={set('title')} required />
          </div>
        </div>

        <div className="adm-form-row">
          <ImageField
            label="HERO IMAGE URL"
            placeholder="https://..."
            value={form.hero_image}
            onChange={(value) => setForm(f => ({ ...f, hero_image: value }))}
            pw={pw}
          />
          <div className="adm-field-group">
            <label className="adm-label">BEST SEASON</label>
            <input className="adm-text-input" placeholder="e.g. October to March" value={form.best_season} onChange={set('best_season')} />
          </div>
        </div>

        <div className="adm-field-group">
          <label className="adm-label">RICH DESCRIPTION</label>
          <textarea className="adm-textarea adm-textarea-tall" placeholder="Write a detailed, evocative description of the place. Use new paragraphs freely — they'll be preserved." value={form.description} onChange={set('description')} />
        </div>

        <div className="adm-form-row">
          <div className="adm-field-group">
            <label className="adm-label">HIGHLIGHTS</label>
            <textarea className="adm-textarea" placeholder={"One highlight per line:\nWhite water rafting on the Ganges\nBeatles Ashram\nTriveni Ghat evening aarti"} value={form.highlights} onChange={set('highlights')} />
            <p className="adm-hint">One bullet point per line.</p>
          </div>
          <div className="adm-field-group">
            <label className="adm-label">GALLERY IMAGE URLS</label>
            <textarea className="adm-textarea" placeholder={"One URL per line:\nhttps://example.com/img1.jpg\nhttps://example.com/img2.jpg"} value={form.gallery} onChange={set('gallery')} />
            <p className="adm-hint">One image URL per line.</p>
          </div>
        </div>

        <div className="adm-field-group">
          <label className="adm-label">USEFUL LINKS</label>
          {form.links.map((l, i) => (
            <div key={i} className="adm-link-row">
              <input className="adm-text-input" placeholder="Link label" value={l.label} onChange={e => setLink(i, 'label', e.target.value)} />
              <input className="adm-text-input" placeholder="https://..." value={l.url} onChange={e => setLink(i, 'url', e.target.value)} />
              <button type="button" className="adm-btn-danger" onClick={() => removeLink(i)} style={{ padding: '8px 12px' }}>✕</button>
            </div>
          ))}
          <button type="button" className="adm-link-add" onClick={addLink}>+ ADD LINK</button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button className="adm-btn" onClick={submit} style={{ width: 'auto', padding: '12px 40px' }}>
            {editId ? 'SAVE CHANGES' : 'ADD PLACE'}
          </button>
          {editId && (
            <button className="adm-btn-sm" onClick={() => { setEditId(null); setForm(emptyForm); }}>
              CANCEL EDIT
            </button>
          )}
        </div>
      </div>

      <div className="adm-divider" />

      {places.length === 0 ? <p className="adm-empty">No places yet.</p> : places.map(p => {
        const parentState = states.find(s => s.id === p.state_id);
        return (
          <div key={p.id} className="adm-card">
            <div className="adm-card-header">
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                {p.hero_image && <img src={p.hero_image} alt="" style={{ width: 64, height: 64, objectFit: 'cover', flexShrink: 0 }} />}
                <div>
                  <h3 className="adm-card-title">{p.title}</h3>
                  <p className="adm-card-meta">Under: {parentState?.title || '—'} &nbsp;·&nbsp; /{p.slug} {p.best_season && `· Best: ${p.best_season}`}</p>
                </div>
              </div>
              <div className="adm-card-actions">
                <span className="adm-badge">PLACE</span>
                <button className="adm-btn-sm" onClick={() => startEdit(p)}>EDIT</button>
                <button className="adm-btn-danger" onClick={() => del(p.id)}>DELETE</button>
              </div>
            </div>
            {(p.highlights || []).length > 0 && (
              <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.highlights.slice(0, 3).map((h, i) => (
                  <span key={i} style={{ fontSize: '0.8rem', color: 'var(--warm-gray)', background: 'var(--cream)', padding: '3px 10px', border: '1px solid #e0d6ca' }}>{h}</span>
                ))}
                {p.highlights.length > 3 && <span style={{ fontSize: '0.8rem', color: 'var(--rg-mid)' }}>+{p.highlights.length - 3} more</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function InquiriesPanel({ pw }) {
  const [inquiries, setInquiries] = useState([]);

  const load = useCallback(() => {
    api('/api/admin/inquiries', {}, pw).then(d => Array.isArray(d) && setInquiries(d));
  }, [pw]);

  useEffect(() => { load(); }, [load]);

  async function del(id) {
    if (!confirm('Delete this inquiry?')) return;
    await api('/api/admin/inquiries', { method: 'DELETE', body: { id } }, pw);
    load();
  }

  return (
    <div>
      {inquiries.length === 0 ? (
        <p className="adm-empty">No inquiries yet.</p>
      ) : inquiries.map(inq => (
        <div key={inq.id} className="adm-inq-card">
          <div className="adm-inq-header">
            <div>
              <p className="adm-inq-name">{inq.name}</p>
              <p className="adm-inq-meta">{inq.email} &nbsp;·&nbsp; {inq.phone}</p>
              <span className="adm-inq-interest">INTERESTED IN: {inq.interest_place}</span>
              {inq.message && <p className="adm-inq-message">"{inq.message}"</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <p className="adm-inq-date">{new Date(inq.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              <button className="adm-btn-danger" onClick={() => del(inq.id)}>DISMISS</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CarRentalsPanel({ pw }) {
  const [requests, setRequests] = useState([]);

  const load = useCallback(() => {
    api('/api/admin/car-rentals', {}, pw).then(d => Array.isArray(d) && setRequests(d));
  }, [pw]);

  useEffect(() => { load(); }, [load]);

  async function del(id) {
    if (!confirm('Delete this car rental request?')) return;
    await api('/api/admin/car-rentals', { method: 'DELETE', body: { id } }, pw);
    load();
  }

  return (
    <div>
      {requests.length === 0 ? (
        <p className="adm-empty">No car rental requests yet.</p>
      ) : requests.map(req => (
        <div key={req.id} className="adm-inq-card">
          <div className="adm-inq-header">
            <div>
              <p className="adm-inq-name">{req.name}</p>
              <p className="adm-inq-meta">{req.email} &nbsp;Â·&nbsp; {req.phone}</p>
              <span className="adm-inq-interest">
                CAR: {String(req.car_type || '').toUpperCase()} &nbsp;Â·&nbsp; CITY: {req.pickup_city}
              </span>
              <p className="adm-inq-meta" style={{ marginTop: 10 }}>
                Pickup: {req.pickup_date} &nbsp;Â·&nbsp; Dropoff: {req.dropoff_date}
              </p>
              {req.notes && <p className="adm-inq-message">"{req.notes}"</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <p className="adm-inq-date">{new Date(req.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              <button className="adm-btn-danger" onClick={() => del(req.id)}>DISMISS</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function GuideRequestsPanel({ pw }) {
  const [requests, setRequests] = useState([]);

  const load = useCallback(() => {
    api('/api/admin/book-agent', {}, pw).then(d => Array.isArray(d) && setRequests(d));
  }, [pw]);

  useEffect(() => { load(); }, [load]);

  async function del(id) {
    if (!confirm('Delete this guide request?')) return;
    await api('/api/admin/book-agent', { method: 'DELETE', body: { id } }, pw);
    load();
  }

  return (
    <div>
      {requests.length === 0 ? (
        <p className="adm-empty">No guide requests yet.</p>
      ) : requests.map(req => (
        <div key={req.id} className="adm-inq-card">
          <div className="adm-inq-header">
            <div>
              <p className="adm-inq-name">{req.name}</p>
              <p className="adm-inq-meta">{req.email} &nbsp;·&nbsp; {req.phone}</p>
              <span className="adm-inq-interest">
                DESTINATION: {req.destination} &nbsp;·&nbsp; TRAVELLERS: {req.travellers}
              </span>
              <p className="adm-inq-meta" style={{ marginTop: 10 }}>
                Travel date: {req.travel_date}
                {req.budget ? ` &nbsp;·&nbsp; Budget: ${req.budget}` : ''}
              </p>
              {req.notes && <p className="adm-inq-message">"{req.notes}"</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <p className="adm-inq-date">{new Date(req.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              <button className="adm-btn-danger" onClick={() => del(req.id)}>DISMISS</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewSubmissionsPanel({ pw }) {
  const [submissions, setSubmissions] = useState([]);

  const load = useCallback(() => {
    api('/api/admin/review-submissions', {}, pw).then(d => Array.isArray(d) && setSubmissions(d));
  }, [pw]);

  useEffect(() => { load(); }, [load]);

  async function del(id) {
    if (!confirm('Delete this review submission?')) return;
    await api('/api/admin/review-submissions', { method: 'DELETE', body: { id } }, pw);
    load();
  }

  return (
    <div>
      {submissions.length === 0 ? (
        <p className="adm-empty">No review submissions yet.</p>
      ) : submissions.map(sub => (
        <div key={sub.id} className="adm-inq-card">
          <div className="adm-inq-header">
            <div>
              <p className="adm-inq-name">{sub.name}</p>
              <p className="adm-inq-meta">{sub.email}{sub.location ? ` &nbsp;Â·&nbsp; ${sub.location}` : ''}</p>
              <span className="adm-inq-interest">RATING: {sub.rating || 5}/5</span>
              {sub.headline && <p style={{ marginTop: 12, fontFamily: 'Cinzel,serif', fontSize: '0.88rem' }}>{sub.headline}</p>}
              {sub.text && <p className="adm-inq-message">"{sub.text}"</p>}
              {sub.image_url && (
                <p style={{ marginTop: 10, fontSize: '0.88rem', color: 'var(--rg-mid)' }}>
                  Image: {sub.image_url}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <p className="adm-inq-date">{new Date(sub.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              <button className="adm-btn-danger" onClick={() => del(sub.id)}>DISMISS</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsPanel({ pw }) {
  const emptyForm = {
    name: '',
    location: '',
    headline: '',
    text: '',
    image_url: '',
    image_link: '',
    cta_label: '',
    cta_url: '',
    rating: '5',
    sort_order: '0',
    published: true,
  };

  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = useCallback(() => {
    api('/api/admin/reviews', {}, pw).then(d => Array.isArray(d) && setReviews(d));
  }, [pw]);

  useEffect(() => { load(); }, [load]);

  const set = key => e => {
    const value = key === 'published' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [key]: value }));
  };

  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg('');
    const res = editId
      ? await api('/api/admin/reviews', { method: 'PUT', body: { ...form, id: editId } }, pw)
      : await api('/api/admin/reviews', { method: 'POST', body: form }, pw);
    if (res.error) { setErr(res.error); return; }
    setMsg(editId ? 'Review updated.' : 'Review created.');
    setForm(emptyForm);
    setEditId(null);
    load();
  }

  function startEdit(review) {
    setEditId(review.id);
    setForm({
      name: review.name || '',
      location: review.location || '',
      headline: review.headline || '',
      text: review.text || '',
      image_url: review.image_url || '',
      image_link: review.image_link || '',
      cta_label: review.cta_label || '',
      cta_url: review.cta_url || '',
      rating: String(review.rating ?? 5),
      sort_order: String(review.sort_order ?? 0),
      published: review.published !== false,
    });
    window.scrollTo(0, 0);
  }

  async function del(id) {
    if (!confirm('Delete this review?')) return;
    await api('/api/admin/reviews', { method: 'DELETE', body: { id } }, pw);
    load();
  }

  return (
    <div>
      <div className="adm-form">
        <p className="adm-form-title">{editId ? 'EDIT REVIEW' : 'ADD REVIEW'}</p>
        {err && <p className="adm-err">âš  {err}</p>}
        {msg && <p className="adm-success">âœ“ {msg}</p>}

        <div className="adm-form-row">
          <div className="adm-field-group">
            <label className="adm-label">REVIEWER NAME</label>
            <input className="adm-text-input" value={form.name} onChange={set('name')} placeholder="e.g. Priya Mehra" />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">LOCATION</label>
            <input className="adm-text-input" value={form.location} onChange={set('location')} placeholder="e.g. Dubai, UAE" />
          </div>
        </div>

        <div className="adm-field-group">
          <label className="adm-label">HEADLINE</label>
          <input className="adm-text-input" value={form.headline} onChange={set('headline')} placeholder="Short standout line for the review" />
        </div>

        <div className="adm-field-group">
          <label className="adm-label">REVIEW TEXT</label>
          <textarea className="adm-textarea adm-textarea-tall" value={form.text} onChange={set('text')} placeholder="Full testimonial or review body..." />
        </div>

        <div className="adm-form-row">
          <ImageField
            label="IMAGE URL"
            placeholder="https://..."
            value={form.image_url}
            onChange={(value) => setForm(f => ({ ...f, image_url: value }))}
            pw={pw}
          />
          <div className="adm-field-group">
            <label className="adm-label">IMAGE CLICK LINK</label>
            <input className="adm-text-input" value={form.image_link} onChange={set('image_link')} placeholder="Optional destination / external URL" />
          </div>
        </div>

        <div className="adm-form-row">
          <div className="adm-field-group">
            <label className="adm-label">BUTTON LABEL</label>
            <input className="adm-text-input" value={form.cta_label} onChange={set('cta_label')} placeholder="e.g. See This Journey" />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">BUTTON URL</label>
            <input className="adm-text-input" value={form.cta_url} onChange={set('cta_url')} placeholder="https://... or /explore/..." />
          </div>
        </div>

        <div className="adm-form-row-3">
          <div className="adm-field-group">
            <label className="adm-label">RATING</label>
            <input className="adm-text-input" type="number" min="1" max="5" value={form.rating} onChange={set('rating')} />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">SORT ORDER</label>
            <input className="adm-text-input" type="number" value={form.sort_order} onChange={set('sort_order')} />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">VISIBILITY</label>
            <label className="adm-checkbox-row">
              <input className="adm-checkbox" type="checkbox" checked={form.published} onChange={set('published')} />
              <span>Published on the site</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button className="adm-btn" onClick={submit} style={{ width: 'auto', padding: '12px 40px' }}>
            {editId ? 'SAVE REVIEW' : 'ADD REVIEW'}
          </button>
          {editId && <button className="adm-btn-sm" onClick={() => { setEditId(null); setForm(emptyForm); }}>CANCEL EDIT</button>}
        </div>
      </div>

      <div className="adm-divider" />

      {reviews.length === 0 ? <p className="adm-empty">No reviews yet.</p> : reviews.map(review => (
        <div key={review.id} className="adm-card">
          <div className="adm-card-header">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {review.image_url && <img src={review.image_url} alt="" className="adm-thumb" />}
              <div>
                <h3 className="adm-card-title">{review.headline}</h3>
                <p className="adm-card-meta">
                  {review.name}{review.location ? ` Â· ${review.location}` : ''} Â· {review.rating || 5}/5
                </p>
              </div>
            </div>
            <div className="adm-card-actions">
              <span className="adm-badge">{review.published === false ? 'DRAFT' : 'REVIEW'}</span>
              <button className="adm-btn-sm" onClick={() => startEdit(review)}>EDIT</button>
              <button className="adm-btn-danger" onClick={() => del(review.id)}>DELETE</button>
            </div>
          </div>
          <p style={{ fontSize: '1rem', color: 'var(--warm-gray)', lineHeight: 1.7 }}>{review.text}</p>
        </div>
      ))}
    </div>
  );
}

function StoriesPanel({ pw }) {
  const emptyForm = {
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    body: '',
    cover_image: '',
    image_link: '',
    cta_label: '',
    cta_url: '',
    author_name: '',
    published_at: '',
    sort_order: '0',
    tags: '',
    published: true,
  };

  const [stories, setStories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = useCallback(() => {
    api('/api/admin/stories', {}, pw).then(d => Array.isArray(d) && setStories(d));
  }, [pw]);

  useEffect(() => { load(); }, [load]);

  const set = key => e => {
    const value = key === 'published' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [key]: value }));
  };

  async function submit(e) {
    e.preventDefault(); setErr(''); setMsg('');
    const payload = {
      ...form,
      published_at: form.published_at ? new Date(form.published_at).toISOString() : '',
    };
    const res = editId
      ? await api('/api/admin/stories', { method: 'PUT', body: { ...payload, id: editId } }, pw)
      : await api('/api/admin/stories', { method: 'POST', body: payload }, pw);
    if (res.error) { setErr(res.error); return; }
    setMsg(editId ? 'Story updated.' : 'Story created.');
    setForm(emptyForm);
    setEditId(null);
    load();
  }

  function startEdit(story) {
    setEditId(story.id);
    setForm({
      title: story.title || '',
      slug: story.slug || '',
      subtitle: story.subtitle || '',
      excerpt: story.excerpt || '',
      body: story.body || '',
      cover_image: story.cover_image || '',
      image_link: story.image_link || '',
      cta_label: story.cta_label || '',
      cta_url: story.cta_url || '',
      author_name: story.author_name || '',
      published_at: story.published_at ? new Date(story.published_at).toISOString().slice(0, 16) : '',
      sort_order: String(story.sort_order ?? 0),
      tags: Array.isArray(story.tags) ? story.tags.join('\n') : '',
      published: story.published !== false,
    });
    window.scrollTo(0, 0);
  }

  async function del(id) {
    if (!confirm('Delete this story?')) return;
    await api('/api/admin/stories', { method: 'DELETE', body: { id } }, pw);
    load();
  }

  return (
    <div>
      <div className="adm-form">
        <p className="adm-form-title">{editId ? 'EDIT STORY' : 'ADD STORY / BLOG POST'}</p>
        {err && <p className="adm-err">âš  {err}</p>}
        {msg && <p className="adm-success">âœ“ {msg}</p>}

        <div className="adm-form-row">
          <div className="adm-field-group">
            <label className="adm-label">TITLE</label>
            <input className="adm-text-input" value={form.title} onChange={set('title')} placeholder="Story headline" />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">CUSTOM SLUG (OPTIONAL)</label>
            <input className="adm-text-input" value={form.slug} onChange={set('slug')} placeholder="auto-generated if left blank" />
          </div>
        </div>

        <div className="adm-field-group">
          <label className="adm-label">SUBTITLE</label>
          <input className="adm-text-input" value={form.subtitle} onChange={set('subtitle')} placeholder="Short deck under the headline" />
        </div>

        <div className="adm-field-group">
          <label className="adm-label">EXCERPT</label>
          <textarea className="adm-textarea" value={form.excerpt} onChange={set('excerpt')} placeholder="Short preview copy for the listing page..." />
        </div>

        <div className="adm-field-group">
          <label className="adm-label">FULL STORY</label>
          <textarea className="adm-textarea adm-textarea-tall" value={form.body} onChange={set('body')} placeholder="Full article body. Use blank lines to separate paragraphs." />
        </div>

        <div className="adm-form-row">
          <ImageField
            label="COVER IMAGE URL"
            placeholder="https://..."
            value={form.cover_image}
            onChange={(value) => setForm(f => ({ ...f, cover_image: value }))}
            pw={pw}
          />
          <div className="adm-field-group">
            <label className="adm-label">IMAGE CLICK LINK</label>
            <input className="adm-text-input" value={form.image_link} onChange={set('image_link')} placeholder="Optional URL when image is clicked" />
          </div>
        </div>

        <div className="adm-form-row">
          <div className="adm-field-group">
            <label className="adm-label">BUTTON LABEL</label>
            <input className="adm-text-input" value={form.cta_label} onChange={set('cta_label')} placeholder="e.g. Read More, Enquire Now" />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">BUTTON URL</label>
            <input className="adm-text-input" value={form.cta_url} onChange={set('cta_url')} placeholder="https://... or /explore/..." />
          </div>
        </div>

        <div className="adm-form-row-3">
          <div className="adm-field-group">
            <label className="adm-label">AUTHOR</label>
            <input className="adm-text-input" value={form.author_name} onChange={set('author_name')} placeholder="e.g. Editorial Team" />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">PUBLISH DATE</label>
            <input className="adm-text-input" type="datetime-local" value={form.published_at} onChange={set('published_at')} />
          </div>
          <div className="adm-field-group">
            <label className="adm-label">SORT ORDER</label>
            <input className="adm-text-input" type="number" value={form.sort_order} onChange={set('sort_order')} />
          </div>
        </div>

        <div className="adm-form-row">
          <div className="adm-field-group">
            <label className="adm-label">TAGS</label>
            <textarea className="adm-textarea" value={form.tags} onChange={set('tags')} placeholder={"One tag per line:\nKerala\nLuxury\nWellness"} />
            <p className="adm-hint">One tag per line.</p>
          </div>
          <div className="adm-field-group">
            <label className="adm-label">VISIBILITY</label>
            <label className="adm-checkbox-row">
              <input className="adm-checkbox" type="checkbox" checked={form.published} onChange={set('published')} />
              <span>Published on the site</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button className="adm-btn" onClick={submit} style={{ width: 'auto', padding: '12px 40px' }}>
            {editId ? 'SAVE STORY' : 'ADD STORY'}
          </button>
          {editId && <button className="adm-btn-sm" onClick={() => { setEditId(null); setForm(emptyForm); }}>CANCEL EDIT</button>}
        </div>
      </div>

      <div className="adm-divider" />

      {stories.length === 0 ? <p className="adm-empty">No stories yet.</p> : stories.map(story => (
        <div key={story.id} className="adm-card">
          <div className="adm-card-header">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {story.cover_image && <img src={story.cover_image} alt="" className="adm-thumb" />}
              <div>
                <h3 className="adm-card-title">{story.title}</h3>
                <p className="adm-card-meta">
                  /stories#{story.slug} Â· {story.author_name || 'Editorial Team'}
                  {story.published_at ? ` Â· ${new Date(story.published_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}` : ''}
                </p>
              </div>
            </div>
            <div className="adm-card-actions">
              <span className="adm-badge">{story.published === false ? 'DRAFT' : 'STORY'}</span>
              <button className="adm-btn-sm" onClick={() => startEdit(story)}>EDIT</button>
              <button className="adm-btn-danger" onClick={() => del(story.id)}>DELETE</button>
            </div>
          </div>
          {story.excerpt && <p style={{ fontSize: '1rem', color: 'var(--warm-gray)', lineHeight: 1.7, marginBottom: 10 }}>{story.excerpt}</p>}
          {Array.isArray(story.tags) && story.tags.length > 0 && (
            <div className="adm-pill-row">
              {story.tags.map((tag, index) => <span key={index} className="adm-pill">{tag}</span>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── ROOT COMPONENT ────────────────────────────────────────────────────────────
const PANELS = ['Regions', 'States & UTs', 'Places', 'Reviews', 'Review Submissions', 'Stories', 'Inquiries', 'Car Rentals', 'Guide Requests'];

export default function AdminPage() {
  const [pw, setPw]             = useState('');
  const [authed, setAuthed]     = useState(false);
  const [authErr, setAuthErr]   = useState('');
  const [checking, setChecking] = useState(false);
  const [tab, setTab]           = useState('Regions');

  async function login(e) {
    e.preventDefault(); setAuthErr(''); setChecking(true);
    // Verify password by hitting a protected endpoint
    const res = await api('/api/admin/regions', {}, pw);
    setChecking(false);
    if (res.error === 'Unauthorized') { setAuthErr('Incorrect password.'); return; }
    setAuthed(true);
  }

  if (!authed) return (
    <>
      <style>{STYLE}</style>
      <div className="adm-login">
        <div className="adm-login-box">
          <p className="adm-login-title cinzel">GOOD MORNING INDIA HOLIDAYS</p>
          <p className="adm-login-sub">Admin Panel — Authorised Access Only</p>
          {authErr && <p className="adm-err">⚠ {authErr}</p>}
          <input className="adm-input" type="password" placeholder="Enter admin password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login(e)} autoFocus />
          <button className="adm-btn" onClick={login} disabled={checking}>
            {checking ? 'VERIFYING…' : 'ENTER'}
          </button>
        </div>
      </div>
    </>
  );

  const panelMap = {
    'Regions':      <RegionsPanel    pw={pw} />,
    'States & UTs': <StatesPanel     pw={pw} />,
    'Places':       <PlacesPanel     pw={pw} />,
    'Reviews':      <ReviewsPanel    pw={pw} />,
    'Review Submissions': <ReviewSubmissionsPanel pw={pw} />,
    'Stories':      <StoriesPanel    pw={pw} />,
    'Inquiries':    <InquiriesPanel  pw={pw} />,
    'Car Rentals':  <CarRentalsPanel pw={pw} />,
    'Guide Requests': <GuideRequestsPanel pw={pw} />,
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="adm">
        <div className="adm-shell">
          {/* Sidebar */}
          <aside className="adm-sidebar">
            <div className="adm-sidebar-brand cinzel">
              GOOD MORNING INDIA HOLIDAYS
              <span>ADMIN PANEL</span>
            </div>
            {PANELS.map(p => (
              <button key={p} className={`adm-nav-item${tab === p ? ' active' : ''}`} onClick={() => setTab(p)}>
                {p === 'Regions'     && '◈  '}
                {p === 'States & UTs'&& '◉  '}
                {p === 'Places'      && '◆  '}
                {p === 'Reviews'     && '★  '}
                {p === 'Stories'     && '✎  '}
                {p === 'Inquiries'   && '✉  '}
                {p === 'Guide Requests' && '☎  '}
                {p}
              </button>
            ))}
            <div className="adm-sidebar-bottom">
              <button className="adm-logout" onClick={() => { setAuthed(false); setPw(''); }}>SIGN OUT</button>
            </div>
          </aside>

          {/* Main */}
          <div className="adm-main">
            <div className="adm-topbar">
              <h1 className="adm-topbar-title cinzel">{tab}</h1>
              <span style={{ fontFamily: 'Cinzel,serif', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--warm-gray)' }}>
                {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </span>
            </div>
            <div className="adm-content">
              {panelMap[tab]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}





