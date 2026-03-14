// app/api/admin/places/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { slugify } from '@/app/lib/slug';

function checkAdmin(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const stateId = searchParams.get('state_id');
  let query = supabaseAdmin.from('places').select('*').order('title');
  if (stateId) query = query.eq('state_id', stateId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const {
    state_id, title, hero_image, description,
    best_season, highlights, gallery, links,
  } = body;
  if (!state_id || !title) return NextResponse.json({ error: 'state_id and title required' }, { status: 400 });

  // highlights & gallery come as newline-separated strings from the form
  const highlightsArr = Array.isArray(highlights) ? highlights
    : (highlights || '').split('\n').map(s => s.trim()).filter(Boolean);
  const galleryArr = Array.isArray(gallery) ? gallery
    : (gallery || '').split('\n').map(s => s.trim()).filter(Boolean);
  // links come as [{label,url}] already parsed
  const linksJson = links || [];

  const { data, error } = await supabaseAdmin
    .from('places')
    .insert({
      state_id, title, slug: slugify(title), hero_image,
      description, best_season,
      highlights: highlightsArr,
      gallery:    galleryArr,
      links:      linksJson,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, title, hero_image, description, best_season, highlights, gallery, links } = body;

  const highlightsArr = Array.isArray(highlights) ? highlights
    : (highlights || '').split('\n').map(s => s.trim()).filter(Boolean);
  const galleryArr = Array.isArray(gallery) ? gallery
    : (gallery || '').split('\n').map(s => s.trim()).filter(Boolean);

  const { data, error } = await supabaseAdmin
    .from('places')
    .update({
      title, slug: slugify(title), hero_image, description, best_season,
      highlights: highlightsArr, gallery: galleryArr, links: links || [],
    })
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('places').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
