import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { EventProp } from '@/utils/types'; // Adjust the path as necessary

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { title, start_date, end_date, location, description }: EventProp = await req.json();
    // Check if user is authenticated
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'User not authenticated' }, { status: 500 });
    }

    // Insert the event associated with the user's ID
    const { error } = await supabase
    .from('user_events')
    .insert([{
      user_id: user.id,
      title: title,
      description,
      start_date,
      end_date,
      location,
    }]);
    if (error) {
      return NextResponse.json({ message: 'Insertion error', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Event created successfully' }, { status: 200 });
  }
  