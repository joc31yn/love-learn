import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
//import './EventPopUp.css';
import { EventProp, emptyEventData } from "@/utils/types";
import { X } from "lucide-react";
// import { createClient } from "@/utils/supabase/server";

interface AddEventPopUpProps {
  togglePopup: boolean;
  toggleAddEvent: () => void;
  toggleRemoveEvent: () => void;
}

async function addEvent(eventProp: EventProp) {
  const response = await fetch("/api/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventProp),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error:", data);
  } else {
    console.log("Success:", data.message);
  }
}

const AddEventPopUp: React.FC<AddEventPopUpProps> = ({
  togglePopup,
  toggleAddEvent,
  toggleRemoveEvent,
}) => {
  const [eventData, setEventData] = useState(emptyEventData);

  const resetEventData = () => {
    setEventData(emptyEventData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prevData: EventProp) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddEvent = async () => {
    console.log("Event Data:", eventData);
    // Issue: Not a server component, cannot use supabase utils auth
    // Fix: Directly inject auth using createClient param overloading
    addEvent(eventData);
    // https://supabase.com/docs/reference/javascript/auth-getsession
    toggleAddEvent(); // Optionally close the popup after adding
  };

  const handleRemoveEvent = () => {
    resetEventData(); // Remove any saved values
    toggleRemoveEvent(); // Optionally close the popup after closing
  };

  if (typeof window !== "undefined") {
    if (togglePopup) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
  }

  return (
    <>
      {togglePopup && (
        <div className="modal">
          <div className="overlay">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-r from-pink-400 to-[rgba(20,64,180,0.6)] rounded-lg shadow-lg w-1/3 max-w-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-2xl font-bold">Add Event To Cal</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveEvent}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <div className="p-6">
                  <Label>Title:</Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="Event title"
                    value={eventData.title}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-black hover:bg-white"
                  />

                  <Label>Start Date:</Label>
                  <Input
                    type="text"
                    name="start_date"
                    placeholder="Month, Day, Year, 00:00 (24h clock)"
                    value={eventData.start_date}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-black hover:bg-white"
                  />

                  <Label>End Date:</Label>
                  <Input
                    type="text"
                    name="end_date"
                    placeholder="Month, Day, Year, 00:00 (24h clock)"
                    value={eventData.end_date}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-black hover:bg-white"
                  />

                  <Label>Location:</Label>
                  <Input
                    type="text"
                    name="location"
                    placeholder="Event location"
                    value={eventData.location}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-black hover:bg-white"
                  />

                  <Label>Description:</Label>
                  <Input
                    type="text"
                    name="description"
                    placeholder="Event description"
                    value={eventData.description}
                    onChange={handleInputChange}
                    className="bg-gray-100 text-black hover:bg-white"
                  />

                  <br />
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddEventPopUp;
