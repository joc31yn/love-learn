"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventProp } from '@/utils/types';
import EventPopUp from "@/components/popup/EventPopUp";
import EventAdder from "@/components/calAddPage";
import { Button } from "@/components/ui/button";

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
  const [modal, setModal] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);
  //Hook for delete events:
  const [delAttempt, setDelAttempt] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);  

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

  // Function to generate an unique ID for an event. Note that if two events are identical
  //in every field, they will be regarded as identical
  function concat(
    a: string = "",
    b: string = "",
    c: string = "",
    d: string = "",
    e: string = ""
  ) {
    let str = "";
    str += a + b + c + d + e;
    return str;
  }

  // Add event (poorly implemented) for testing, delete at will
  const addEvent = (newInfo: EventProp) => {
    console.log("ADD EVENT is called");
    try {
      const nIFormatted = {
        id: concat(
          newInfo.name,
          newInfo.start_date,
          newInfo.end_date,
          newInfo.location,
          newInfo.description
        ),
        title: newInfo.name,
        start: newInfo.start_date,
        end: newInfo.end_date,
        extendedProps: {
          location: newInfo.location,
          description: newInfo.description,
        },
      };
      setCalendarEvents((prevEvents) => [...prevEvents, nIFormatted]);
    } catch (error) {
      console.error("Error adding events:", error);
    }
  };

  function areEventsIdentical(event1: any, event2: any): boolean {
    console.log(event1.id);
    console.log(event2.id);
    return event1.id == event2.id;
  }

  // Function to delete event:
  const removeSelectedEvent = (toDel: any) => {
    try {
      setCalendarEvents(
        calendarEvents.filter(
          (event) => event && !areEventsIdentical(event, toDel)
        )
      );
    } catch (error) {
      console.error("remove not successful", error);
    }
    console.log("DELETE ATTEMPT FINISHED");
  };

  //Handles the text and delete status in the button for deleting events
  //##################################
  const delButton = () => {
    if (delAttempt) {
      return "Cancel Deletion";
    } else {
      return "Delete Event";
    }
  };
  const handleDelReq = () => {
    if (delAttempt) {
      setDelAttempt(false);
    } else {
      setDelAttempt(true);
    }
  };
  //##################################

  const toggleModal = () => setModal(!modal);


  // MODIFIED: if the user is attempting to delete, the event will be deleted on click
  const dayPopUp = (info: EventClickArg) => {
    if (delAttempt) {
      
      removeSelectedEvent(info.event);
      handleDelReq();
    } else {
      setModal(true);
    }
    
  };

  return (
    <div>
      <EventAdder addInfo={addEvent} />
      <Button onClick={handleDelReq}>{delButton()}</Button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        eventClick={dayPopUp}
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
      <EventPopUp modal={modal} toggleModal={toggleModal} />
    </div>
  );
}
