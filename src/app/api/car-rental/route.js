import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabaseAdmin';

export async function POST(req) {
  const {
    name,
    phone,
    email,
    pickup_city,
    pickup_date,
    dropoff_date,
    car_type,
    notes,
  } = await req.json();

  if (!name || !phone || !email || !pickup_city || !pickup_date || !dropoff_date || !car_type) {
    return NextResponse.json(
      { error: 'name, phone, email, pickup_city, pickup_date, dropoff_date and car_type are required' },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from('car_rental_requests').insert({
    name,
    phone,
    email,
    pickup_city,
    pickup_date,
    dropoff_date,
    car_type,
    notes,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
