"use client";

import React, {useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventProp, EventProps, FetchEvents } from "./eventObtainer";
import EventPopUp from "./EventPopUp";

export default function Calendar() {
  const eventsInProps = FetchEvents();

  const [modal, setModal] = useState(true);
  const toggleModal = () => setModal(!modal);
 
  const calendarEvents = eventsInProps.events.map((event) => ({
    title: event.eventName,
    start: `${event.date}T${event.time}`,
    end: `${event.end_date}T${event.end_time}`,
    extendedProps: {
      location: event.location,
      description: event.description,
    },
  }));
  const dayPopUp = () =>{
    setModal(true);
  }
  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        dateClick={dayPopUp}
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
      <EventPopUp modal ={modal} toggleModal={toggleModal}/>
    </div>
  );
}
