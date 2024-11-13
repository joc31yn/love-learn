// app/api/listenForChanges/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
      data: { user },
  } = await supabase.auth.getUser();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Listen for changes in the 'todos' table
  if (user) {
    supabase
    .channel('notify')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_events' }, (payload) => {
      writer.write(`data: ${JSON.stringify(payload)}\n\n`);
    })
    .subscribe();
  }
  else {
    supabase
    .channel('notify')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'public_events' }, (payload) => {
      writer.write(`data: ${JSON.stringify(payload)}\n\n`);
    })
    .subscribe();
  }

  req.signal.addEventListener("abort", () => {
    writer.close();  // Clean up when client disconnects
  });

  return new NextResponse(readable, {
    headers: {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    },
});

}
