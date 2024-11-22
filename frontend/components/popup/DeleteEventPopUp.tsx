import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { EventProp } from "@/utils/types";
import { X } from "lucide-react";

interface DeleteEventPopUpProps {
  event: EventProp;
  togglePopup: boolean;
  toggleDeleteEvent: () => void;
  toggleRemoveEvent: () => void;
}

const removeSelectedEvent = async (event: EventProp) => {
  const response = await fetch("/api/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: event.title }),
  });

  if (!response.ok) {
    console.error("Failed to delete event:", await response.text());
    return;
  }
  console.log("Event deleted successfully");
};

const DeleteEventPopUp: React.FC<DeleteEventPopUpProps> = ({
  event,
  togglePopup,
  toggleDeleteEvent,
  toggleRemoveEvent,
}) => {
  const handleDeleteEvent = async () => {
    removeSelectedEvent(event);
    toggleDeleteEvent();
  };

  const handleRemoveEvent = () => {
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
              <div className="bg-white rounded-lg shadow-lg w-1/3 max-w-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold mb-4">
                    Event to Be Deleted
                  </h2>
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
                  <p className="text-gray-800 mb-2">{event.title}</p>

                  <Label>Start Date:</Label>
                  <p className="text-gray-800 mb-2">{event.start_date}</p>

                  <Label>End Date:</Label>
                  <p className="text-gray-800 mb-2">{event.end_date}</p>

                  <Label>Location:</Label>
                  <p className="text-gray-800 mb-2">{event.location}</p>

                  <Label>Description:</Label>
                  <p className="text-gray-800 mb-2">{event.description}</p>

                  <div className="flex justify-around mt-4">
                    <Button
                      onClick={handleDeleteEvent}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Confirm Delete
                    </Button>
                    <Button
                      onClick={handleRemoveEvent}
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteEventPopUp;
