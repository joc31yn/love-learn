"use client";

import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { emptyEventData, EventProp } from "@/utils/types";
import AddEventPopUp from "@/components/popup/AddEventPopUp";
import SyncPopUp from "./popup/SyncPopUp";
import EventPopUp from "@/components/popup/EventPopUp";
import { Button } from "@/components/ui/button";
import { EventClickArg } from "@fullcalendar/core";
import DeleteEventPopUp from "@/components/popup/DeleteEventPopUp";

async function fetchEvents(): Promise<EventProp[]> {
  const res = await fetch("/api/events", {
    method: "GET",
    cache: "no-store", // Ensures a fresh fetch call each time
  });
  if (!res.ok) {
    console.error("Failed to fetch events");
    return [];
  }

  const data = await res.json();
  return data.events;
}

// Data race: If a user is in one popup, another popup cannot be opened

export default function Calendar() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  // States for delete events:
  const [delAttempt, setDelAttempt] = useState(false);
  const [changeCal, setChangeCal] = useState(false);
  const [modal, setModal] = useState(false);
  const [addPopup, setAddPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [buttonText, setButtonText] = useState("Delete Event");
  const prevChangeCal = useRef(changeCal);
  // State for eventProp
  const [selectedEvent, setSelectedEvent] = useState(emptyEventData);
  // State for SyncPopUp
  const [syncPopUpDisp, setSyncPopUpDisp] = useState(false);

  const fetchData = async () => {
    try {
      const eventsInProps = await fetchEvents();
      //console.log(eventsInProps);
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

  useEffect(() => {
    // This effect runs whenever delAttempt changes
    //console.log(delAttempt);
    if (delAttempt) {
      setButtonText("Cancel Deletion");
    } else {
      setButtonText("Delete Event");
    }
  }, [delAttempt]);

  const toggleModal = () => setModal(!modal);
  const toggleSyncDisp = () => setSyncPopUpDisp(!syncPopUpDisp);
  const openSyncPopUp = () => setSyncPopUpDisp(true);

  // PLACE HOLDER FOR ANY ONCLOSE ACTION FOR SYNC
  const syncOnClose = () => {};

  const convertToEventProp = (info: EventClickArg): EventProp => ({
    title: info.event.title,
    start_date: info.event.start ? info.event.start.toISOString() : "",
    end_date: info.event.end ? info.event.end.toISOString() : "",
    location: info.event.extendedProps.location || "",
    description: info.event.extendedProps.description || "",
  });

  const dayPopUp = (info: EventClickArg) => {
    //console.log(info.event.title);
    if (delAttempt) {
      setDeletePopup(true);
    } else {
      setModal(true);
    }
    setSelectedEvent(convertToEventProp(info));
  };

  const toggleAddEvent = () => {
    setAddPopup(false);
    setChangeCal(true);
  };

  const toggleRemoveEvent = () => {
    setModal(false);
    setAddPopup(false);
    setDeletePopup(false);
    setDelAttempt(false);
  };

  const toggleDeleteEvent = () => {
    setDeletePopup(false);
    setDelAttempt(false);
    setChangeCal(true);
  };

  const addPopUp = () => {
    setAddPopup(true);
  };

  // Function to delete event:
  const removeSelectedEvent = async (toDel: EventClickArg) => {
    const response = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: toDel.event.title }),
    });
    // Check if the response was successful
    if (!response.ok) {
      console.error("Failed to delete event:", await response.text());
      return;
    }

    // Update calendar rendering
    setChangeCal(true);
  };

  //Handles the text and delete status in the button for deleting events
  //##################################
  const handleDelReq = () => {
    setDelAttempt((prev) => !prev);
  };
  //##################################

  return (
    <div>
      <Button onClick={addPopUp}>Add Event</Button>
      <Button onClick={handleDelReq}>{buttonText}</Button>
      <Button onClick={openSyncPopUp}>Sync Event</Button>
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
        togglePopup={addPopup}
        toggleAddEvent={toggleAddEvent}
        toggleRemoveEvent={toggleRemoveEvent}
      ></AddEventPopUp>
      <DeleteEventPopUp
        event={selectedEvent}
        togglePopup={deletePopup}
        toggleDeleteEvent={toggleDeleteEvent}
        toggleRemoveEvent={toggleRemoveEvent}
      ></DeleteEventPopUp>
      <SyncPopUp
        popUpStat={syncPopUpDisp}
        togglePopUpStat={toggleSyncDisp}
        onclose={syncOnClose}
      ></SyncPopUp>
    </div>
  );
}
