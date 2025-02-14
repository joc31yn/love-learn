import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { EventProp } from "@/utils/types";

interface ModifyEventPopUpProps {
  event: EventProp;
  togglePopup: boolean;
  toggleModifyEvent: () => void;
  toggleRemoveEvent: () => void;
}

async function modifyEvent(eventProp: EventProp) {
  const response = await fetch("/api/modify", {
    method: "PUT",
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

const ModifyEventPopUp: React.FC<ModifyEventPopUpProps> = ({
  event,
  togglePopup,
  toggleModifyEvent,
  toggleRemoveEvent,
}) => {
  const [eventData, setEventData] = useState<EventProp>(event);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModifyEvent = async () => {
    console.log("Modified Event Data:", eventData);
    await modifyEvent(eventData);
    toggleModifyEvent(); // Optionally close the popup after modifying
  };

  const handleRemoveEvent = () => {
    toggleRemoveEvent(); // Optionally close the popup
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
              <div className="bg-white rounded-lg shadow-lg w-1/3 max-w-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-2xl font-bold">Modify Event</h2>
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
                  />

                  <Label>Start Date:</Label>
                  <Input
                    type="text"
                    name="start_date"
                    placeholder="Month, Day, Year, 00:00 (24h clock)"
                    value={eventData.start_date}
                    onChange={handleInputChange}
                  />

                  <Label>End Date:</Label>
                  <Input
                    type="text"
                    name="end_date"
                    placeholder="Month, Day, Year, 00:00 (24h clock)"
                    value={eventData.end_date}
                    onChange={handleInputChange}
                  />

                  <Label>Location:</Label>
                  <Input
                    type="text"
                    name="location"
                    placeholder="Event location"
                    value={eventData.location}
                    onChange={handleInputChange}
                  />

                  <Label>Description:</Label>
                  <Input
                    type="text"
                    name="description"
                    placeholder="Event description"
                    value={eventData.description}
                    onChange={handleInputChange}
                  />

                  <br />
                  <Button onClick={handleModifyEvent}>Modify Event</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModifyEventPopUp;
