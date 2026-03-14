// app/api/admin/states/route.js
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';
import { slugify } from '@/app/lib/slug';

function checkAdmin(req) {
  return req.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const regionId = searchParams.get('region_id');
  let query = supabaseAdmin.from('states').select('*, places(id, title, slug)').order('title');
  if (regionId) query = query.eq('region_id', regionId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { region_id, title, description } = await req.json();
  if (!region_id || !title) return NextResponse.json({ error: 'region_id and title required' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('states')
    .insert({ region_id, title, slug: slugify(title), description })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from('states').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}