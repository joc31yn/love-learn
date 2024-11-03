"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventProp } from '@/api/events/route';

async function fetchEvents(): Promise<EventProp[]> {
  const res = await fetch('/api/events', {
    method: 'GET',
    cache: 'no-store', // Ensures a fresh fetch call each time
  });

  if (!res.ok) {
    console.error('Failed to fetch events');
    return []; 
  }

  const data = await res.json();
  return data.events; 
}

export default function Calendar() {
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsInProps = await fetchEvents();
  
        // Check if eventsInProps is an array to prevent errors
        const formattedEvents = (eventsInProps || []).map((event: EventProp) => ({
          title: event.name,
          start: event.start_date,
          end: event.end_date,
          extendedProps: {
            location: event.location,
            description: event.description,
          },
        }));
  
        setCalendarEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    fetchData();
  }, []); // [] means run only on mount
  
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height={"75vh"}
        events={calendarEvents}
        eventContent={(eventInfo) => (
          <div>
            <b>{eventInfo.event.title}</b>
            <br />
            <b>{eventInfo.event.extendedProps.location}</b>
            <br />
            <b
              style={{
                whiteSpace: "normal",
                flexWrap: "wrap",
                wordWrap: "break-word",
              }}
            >
              {eventInfo.event.extendedProps.description}
            </b>
          </div>
        )}
      />
    </div>
  );
}
