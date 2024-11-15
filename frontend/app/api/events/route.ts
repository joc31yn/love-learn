'use server';

import { NextResponse } from 'next/server';
import { EventProp } from '@/utils/types';
import { PostgrestError } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  // Get the authenticated user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let result: EventProp[] | null = null;
  let fetchError: PostgrestError | null = null;
  if (user) {
    // Fetch events from user_events if the user is authenticated
    const { data, error } = await supabase
      .from('user_events')
      .select('title, start_date, end_date, description, location')
      .eq('user_id', user.id);
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
  // Infer the type of `result` automatically
  const events: EventProp[] = result ?? [];

  return NextResponse.json({ events });
}
