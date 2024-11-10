import Hero from "@/components/hero";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Index() {
  return (
    <>
      <Hero />
      <Link href="/events">
        <Button>Go to Events</Button>
      </Link>
    </>
  );
}

