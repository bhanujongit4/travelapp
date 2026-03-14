import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

function checkAdmin(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

function normalizeReview(body = {}) {
  return {
    name: body.name?.trim() || '',
    location: body.location?.trim() || '',
    headline: body.headline?.trim() || '',
    text: body.text?.trim() || '',
    image_url: body.image_url?.trim() || '',
    image_link: body.image_link?.trim() || '',
    cta_label: body.cta_label?.trim() || '',
    cta_url: body.cta_url?.trim() || '',
    rating: Number(body.rating) || 5,
    sort_order: Number(body.sort_order) || 0,
    published: body.published !== false,
  };
}

export async function GET(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = normalizeReview(await req.json());

  if (!payload.name || !payload.headline || !payload.text) {
    return NextResponse.json({ error: 'name, headline, and text are required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from('reviews')
    .update(normalizeReview(body))
    .eq('id', body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('reviews').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
