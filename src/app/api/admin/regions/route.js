// app/api/admin/regions/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { slugify } from '@/app/lib/slug';

function checkAdmin(req) {
  const pw = req.headers.get('x-admin-password');
  return pw === process.env.ADMIN_PASSWORD;
}

// GET all regions
export async function GET(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from('regions')
    .select('*, states(id, title, slug)')
    .order('title');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST create region
export async function POST(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { title, description } = body;
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('regions')
    .insert({ title, slug: slugify(title), description })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// DELETE region
export async function DELETE(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('regions').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}