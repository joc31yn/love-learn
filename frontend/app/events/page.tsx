import { createClient } from '@/utils/supabase/server';

export default async function Events() {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("public_events").select();

  return <pre>{JSON.stringify(notes, null, 2)}</pre>
}
