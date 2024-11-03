import { createClient } from '@/utils/supabase/server';
import React, { useState, useEffect } from "react";
import { EventProp } from '@/utils/types';

async function addEvent(eventProp: EventProp) {
    const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventProp),
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('Error:', data);
    } else {
        console.log('Success:', data.message);
    }
}

export default async function Add() {
  const [eventProp, setEventProp] = useState<EventProp>({
      name: '',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      });
      
  const [fetchEvents, setFetchEvents] = useState(false);
  // Force NORUN for frontend
  /*
  useEffect(() => {
    // TODO
    if (fetchEvents) {
      addEvent(eventProp).finally(() => setFetchEvents(false)); // Reset fetchEvents after API call
    }
  }, [fetchEvents]); // Changes only on fetchEvents change
  */
  return (
    <div className="">
      
    </div>
  );
  return 
}
