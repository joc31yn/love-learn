"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { EventProp, EventProps, FetchEvents } from "./eventObtainer";

export default function Calendar() {
  const eventsInProps = FetchEvents();
  const calendarEvents = eventsInProps.events.map((event) => ({
    title: event.eventName,
    start: `${event.date}T${event.time}`,
    end: `${event.end_date}T${event.end_time}`,
    extendedProps: {
      location: event.location,
      description: event.description,
    },
  }));
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
        height={"80vh"}
        events={calendarEvents}
        eventContent={(eventInfo) => (
          <div>
            <b>{eventInfo.event.title}</b>
            <br />
            <br />
            <b>{eventInfo.event.extendedProps.location}</b>
            <br />
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
