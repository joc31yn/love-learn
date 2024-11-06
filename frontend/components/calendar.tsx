"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventProp } from '@/utils/types';
import AddEventPopUp from '@/components/popup/AddEventPopUp';
import EventPopUp from "@/components/popup/EventPopUp";
import { Button } from "@/components/ui/button";
import { EventClickArg } from "@fullcalendar/core";

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
  //Hook for delete events:
  const [delAttempt, setDelAttempt] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [changeCal, setChangeCal] = useState(false);

  const prevChangeCal = useRef(changeCal);

  const fetchData = async () => {
    try {
      const eventsInProps = await fetchEvents();
      console.log(eventsInProps);
      // Check if eventsInProps is an array to prevent errors
      const formattedEvents = (eventsInProps || []).map((event: EventProp) => ({
        title: event.title,
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (prevChangeCal.current === false && changeCal === true) {
      fetchData();
      setChangeCal(false);
    }
    prevChangeCal.current = changeCal;
  }, [changeCal]); 

  const [modal, setModal] = useState(false);
  const [togglePopup, settogglePopup] = useState(false);
  const toggleModal = () => setModal(!modal);
  const toggleAddEvent = () => {
    settogglePopup(false);
    setChangeCal(true);
  }
  const toggleRemoveEvent = () => {
    settogglePopup(false);
  }
  const addPopUp = () => {
    settogglePopup(true);
  }

  // MODIFIED: if the user is attempting to delete, the event will be deleted on click
  const dayPopUp = (info: EventClickArg) => {
    if (delAttempt) {
      removeSelectedEvent(info);
      handleDelReq();
    } else {
      setModal(true);
    }
    
  };

  // Function to delete event:
  const removeSelectedEvent = async (toDel: EventClickArg) => {
    console.log(toDel.event.title);
    const response = await fetch('/api/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: toDel.event.title })
    });
    console.log("done");
    // Check if the response was successful
    if (!response.ok) {
      console.error('Failed to delete event:', await response.text());
      return;
    }

    // Update calendar rendering
    setChangeCal(true);
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

  return (
    <div>
      <Button onClick={addPopUp}>Add Event</Button>
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
      <AddEventPopUp
        togglePopup={togglePopup}
        toggleAddEvent={toggleAddEvent}
        toggleRemoveEvent={toggleRemoveEvent}>
      </AddEventPopUp>
    </div>
  );  
}
