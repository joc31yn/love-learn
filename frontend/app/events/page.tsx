import { createClient } from '@/utils/supabase/server';
import React from "react";
import Calendar from "@/components/calendar";
import { Button } from "../../components/ui/button";
import Link from 'next/link';

export default async function Events() {
  return (
    <div className="rounded-md border border-gray-200 w-11/12 h-10/12 py-4 shadow">
      <Link href = "events/addEvent" target = "_blank">
        <Button>Add Event</Button>
      </Link>
      <Calendar />
    </div>
  );
  return
}
