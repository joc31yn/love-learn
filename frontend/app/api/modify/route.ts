import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { EventProp } from '@/utils/types'; // Adjust the path as necessary

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Parse the request body
  const { id, title, start_date, end_date, location, description }: Partial<EventProp> & { id: string } = await req.json();

  // Validate required fields
  if (!id) {
    return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
  }

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
  }

  // Update the event associated with the user's ID
  const { error } = await supabase
    .from('user_events')
    .update({
      ...(title && { title }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
      ...(location && { location }),
      ...(description && { description }),
    })
    .eq('id', id)
    .eq('user_id', user.id); // Ensure the user owns the event

  if (error) {
    return NextResponse.json({ message: 'Update error', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Event updated successfully' }, { status: 200 });
}
