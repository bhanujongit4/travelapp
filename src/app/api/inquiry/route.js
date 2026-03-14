// app/api/inquiry/route.js
// Public endpoint — no admin auth needed; uses anon insert policy
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function POST(req) {
  const { name, email, phone, interest_place, message } = await req.json();
  if (!name || !email || !phone || !interest_place) {
    return NextResponse.json({ error: 'name, email, phone and interest_place are required' }, { status: 400 });
  }
  const { error } = await supabaseAdmin
    .from('inquiries')
    .insert({ name, email, phone, interest_place, message });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}