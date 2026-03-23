import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function POST(req) {
  const {
    name,
    phone,
    email,
    destination,
    travel_date,
    travellers,
    budget,
    notes,
  } = await req.json();

  if (!name || !phone || !email || !destination || !travel_date || !travellers) {
    return NextResponse.json(
      { error: 'name, phone, email, destination, travel_date and travellers are required' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from('book_agent_requests').insert({
    name,
    phone,
    email,
    destination,
    travel_date,
    travellers,
    budget: budget || null,
    notes: notes || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

