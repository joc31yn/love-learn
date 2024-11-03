import Hero from "@/components/hero";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from 'next/link';
import EventPopUp from '../components/popup/EventPopUp';

export default async function Index() {
  return (
    <>
      <Hero />
      <Link href="/events">
        <button>Go to Events</button>
      </Link>
    </>
  );
}

