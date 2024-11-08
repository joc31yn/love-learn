import Hero from "@/components/hero";
import Link from 'next/link';

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

