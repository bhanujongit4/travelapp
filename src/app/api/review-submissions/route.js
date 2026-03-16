import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

function normalizeSubmission(body = {}) {
  return {
    name: body.name?.trim() || '',
    email: body.email?.trim() || '',
    location: body.location?.trim() || '',
    headline: body.headline?.trim() || '',
    text: body.text?.trim() || '',
    image_url: body.image_url?.trim() || '',
    rating: Number(body.rating) || 5,
  };
}

export async function POST(req) {
  const payload = normalizeSubmission(await req.json());

  if (!payload.name || !payload.email || !payload.headline || !payload.text) {
    return NextResponse.json({ error: 'name, email, headline, and text are required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('review_submissions')
    .insert(payload);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
