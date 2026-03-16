'use client';

import { useState } from 'react';

const STYLE = `
  .rev-sub-wrap {
    margin-top: 72px;
    background: linear-gradient(135deg, #2a1f14, #1a1612);
    padding: 42px 36px;
    color: white;
    border: 1px solid rgba(196,165,116,0.2);
  }
  .rev-sub-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.4rem, 2.6vw, 2rem);
    font-weight: 400;
    margin-bottom: 10px;
  }
  .rev-sub-copy {
    font-size: 1.03rem;
    color: rgba(255,255,255,0.72);
    line-height: 1.8;
    margin-bottom: 28px;
  }
  .rev-sub-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .rev-sub-label {
    display: block;
    font-family: 'Cinzel', serif;
    font-size: 0.64rem;
    letter-spacing: 0.24em;
    color: rgba(242,196,160,0.85);
    margin-bottom: 6px;
  }
  .rev-sub-field {
    width: 100%;
    display: block;
    box-sizing: border-box;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(196,165,116,0.28);
    padding: 14px 16px;
    color: white;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem;
    outline: none;
    margin-bottom: 16px;
  }
  .rev-sub-field:focus {
    border-color: #D4956A;
  }
  .rev-sub-field::placeholder {
    color: rgba(255,255,255,0.32);
  }
  .rev-sub-btn {
    border: none;
    background: linear-gradient(135deg, #D4956A, #B87333);
    color: white;
    padding: 15px 24px;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.24em;
    cursor: pointer;
  }
  .rev-sub-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .rev-upload-box {
    border: 1px dashed rgba(196,165,116,0.45);
    background: rgba(255,255,255,0.04);
    padding: 14px 16px;
    margin-bottom: 16px;
  }
  .rev-upload-input {
    display: block;
    width: 100%;
    color: rgba(255,255,255,0.82);
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.98rem;
  }
  .rev-upload-note {
    margin-top: 10px;
    font-size: 0.92rem;
    color: rgba(255,255,255,0.58);
  }
  .rev-upload-preview {
    width: 100%;
    max-width: 220px;
    margin: 14px 0 4px;
    border: 1px solid rgba(196,165,116,0.24);
    background: rgba(255,255,255,0.05);
    padding: 8px;
  }
  .rev-upload-preview img {
    width: 100%;
    display: block;
    object-fit: cover;
  }
  .rev-sub-msg {
    margin-bottom: 16px;
    font-size: 0.98rem;
  }
  .rev-sub-msg.ok {
    color: #f4d3b8;
  }
  .rev-sub-msg.err {
    color: #fda4af;
  }
  @media (max-width: 720px) {
    .rev-sub-wrap {
      padding: 32px 22px;
    }
    .rev-sub-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const initialForm = {
  name: '',
  email: '',
  location: '',
  headline: '',
  text: '',
  image_url: '',
  rating: '5',
};

export default function ReviewSubmissionForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/review-submissions/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to upload image.');

      setForm((current) => ({ ...current, image_url: data.url || '' }));
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function submit(event) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/review-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit review.');

      setStatus('success');
      setMessage('Thank you. Your review has been received and is waiting for approval.');
      setForm(initialForm);
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }

  return (
    <>
      <style>{STYLE}</style>
      <section className="rev-sub-wrap">
        <p className="cinzel reviews-eye" style={{ marginBottom: 12 }}>ADD A REVIEW</p>
        <h2 className="rev-sub-title">Share Your Journey With Us</h2>
        <p className="rev-sub-copy">
          Leave a guest review in the same editorial style we use internally. Once approved, it can be published on the site.
        </p>

        <form onSubmit={submit}>
          {message && (
            <p className={`rev-sub-msg ${status === 'success' ? 'ok' : 'err'}`}>
              {message}
            </p>
          )}

          <div className="rev-sub-grid">
            <div>
              <label className="rev-sub-label">YOUR NAME</label>
              <input className="rev-sub-field" value={form.name} onChange={set('name')} placeholder="Priya Mehra" required />
            </div>
            <div>
              <label className="rev-sub-label">EMAIL</label>
              <input className="rev-sub-field" type="email" value={form.email} onChange={set('email')} placeholder="priya@email.com" required />
            </div>
          </div>

          <div className="rev-sub-grid">
            <div>
              <label className="rev-sub-label">LOCATION</label>
              <input className="rev-sub-field" value={form.location} onChange={set('location')} placeholder="Dubai, UAE" />
            </div>
            <div>
              <label className="rev-sub-label">RATING</label>
              <select className="rev-sub-field" value={form.rating} onChange={set('rating')}>
                <option value="5" className='text-black'>5 / 5</option>
                <option value="4" className='text-black'>4 / 5</option>
                <option value="3" className='text-black'>3 / 5</option>
                <option value="2" className='text-black'>2 / 5</option>
                <option value="1" className='text-black'>1 / 5</option>
              </select>
            </div>
          </div>

          <label className="rev-sub-label">HEADLINE</label>
          <input className="rev-sub-field" value={form.headline} onChange={set('headline')} placeholder="A short standout line for your trip" required />

          <label className="rev-sub-label">FULL REVIEW</label>
          <textarea className="rev-sub-field" rows={6} value={form.text} onChange={set('text')} placeholder="Tell future travellers what stood out, what felt special, and how the journey was handled..." required style={{ resize: 'vertical' }} />

          <label className="rev-sub-label">PHOTO (OPTIONAL)</label>
          <div className="rev-upload-box">
            <input className="rev-upload-input" type="file" accept="image/*" onChange={handleFileChange} />
            <p className="rev-upload-note">
              {uploading ? 'Uploading image...' : 'Upload directly from your device. Wait a moment after selecting a file to see the preview.'}
            </p>
            {form.image_url && (
              <div className="rev-upload-preview">
                <img src={form.image_url} alt="Uploaded review preview" />
              </div>
            )}
          </div>

          <button className="rev-sub-btn" disabled={status === 'loading' || uploading}>
            {status === 'loading' ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
          </button>
        </form>
      </section>
    </>
  );
}
