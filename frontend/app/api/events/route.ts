// app/api/events/route.ts
'use server';

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export interface EventProp {
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
}

export async function GET() {
  // Get the authenticated user
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let result, fetchError;
  if (user) {
    // Fetch events from user_events if the user is authenticated
    const { data, error } = await supabase
      .from('user_events')
      .select('title, description, event_date, location')
      .eq('id', user.id);
    result = data;
    fetchError = error;
  } 
  else {
    // Fetch public events if the user is not authenticated
    const { data, error } = await supabase
      .from('public_events')
      .select('title, start_date, end_date, description, location');
    result = data;
    fetchError = error;
  }

  if (fetchError) {
    console.error('Error fetching events:', fetchError.message);
    return NextResponse.json({ events: [] }, { status: 500 });
  }

  const events: EventProp[] = (result || []).map((event: any) => ({
    name: event.title,
    start_date: event.start_date,
    end_date: event.end_date,
    location: event.location,
    description: event.description,
  }));

  return NextResponse.json({ events });
}
