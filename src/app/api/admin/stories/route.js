import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { slugify } from '@/app/lib/slug';

function checkAdmin(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

function normalizeStory(body = {}) {
  const tags = Array.isArray(body.tags)
    ? body.tags
    : (body.tags || '').split('\n').map((tag) => tag.trim()).filter(Boolean);

  const title = body.title?.trim() || '';
  const slugSource = body.slug?.trim() || title;

  return {
    title,
    slug: slugify(slugSource),
    subtitle: body.subtitle?.trim() || '',
    excerpt: body.excerpt?.trim() || '',
    body: body.body?.trim() || '',
    cover_image: body.cover_image?.trim() || '',
    image_link: body.image_link?.trim() || '',
    cta_label: body.cta_label?.trim() || '',
    cta_url: body.cta_url?.trim() || '',
    author_name: body.author_name?.trim() || '',
    published_at: body.published_at || new Date().toISOString(),
    sort_order: Number(body.sort_order) || 0,
    published: body.published !== false,
    tags,
  };
}

export async function GET(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from('stories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = normalizeStory(await req.json());

  if (!payload.title || !payload.body) {
    return NextResponse.json({ error: 'title and body are required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('stories')
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
    .from('stories')
    .update(normalizeStory(body))
    .eq('id', body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('stories').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
