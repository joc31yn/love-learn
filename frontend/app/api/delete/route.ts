import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { title } = await req.json();

  // Check if user is authenticated
  const {
      data: { user }
  } = await supabase.auth.getUser();
  
  if (!user) {
      return NextResponse.json({ message: 'User not authed' }, { status: 500 });
  }
  
  // Delete all entries with the given name and user_id
  const { error: deleteError } = await supabase
      .from('user_events')
      .delete()
      .eq('user_id', user.id)
      .eq('title', title);
  
  if (deleteError) {
      return NextResponse.json({ message: 'Deletion error', details: deleteError.message }, { status: 500 });
  }
  
  return NextResponse.json({ message: 'Deletion success' }, { status: 200 });
}
