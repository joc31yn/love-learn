import React, { useState, useEffect } from "react";
import { EventProp } from "@/utils/types";

interface AddEventProp {
  addInfo: (info: EventProp) => void; // Define the prop type for addInfo
}

const EventAdder: React.FC<AddEventProp> = ({ addInfo }) => {
  const [newName, setNewName] = useState<string>("");
  const [newStartDate, setNewStartDate] = useState<string>("");
  const [newEndDate, setNewEndDate] = useState<string>("");
  const [newLocation, setNewLocation] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");

  const handleAddClick = () => {
    console.log("hac is called!!");
    if (
      newName.trim() &&
      newStartDate.trim() &&
      newEndDate.trim() &&
      newLocation.trim() &&
      newDescription.trim()
    ) {
      const newEvent: EventProp = {
        name: newName,
        start_date: newStartDate,
        end_date: newEndDate,
        location: newLocation,
        description: newDescription,
      };
      console.log("ADD INFO is called");
      addInfo(newEvent);

      //reset all hooks
      setNewName("");
      setNewStartDate("");
      setNewEndDate("");
      setNewLocation("");
      setNewDescription("");
    }
  };
  return (
    <div>
      <h1>ADD EVENT</h1>
      <h2>shit formatting idc at this point</h2>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Event Name"
      />
      <input
        type="text"
        value={newStartDate}
        onChange={(e) => setNewStartDate(e.target.value)}
        placeholder="Start Time"
      />
      <input
        type="text"
        value={newEndDate}
        onChange={(e) => setNewEndDate(e.target.value)}
        placeholder="Date"
      />
      <input
        type="text"
        value={newLocation}
        onChange={(e) => setNewLocation(e.target.value)}
        placeholder="Location"
      />
      <input
        type="text"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder="Description"
      />
      <button onClick={handleAddClick}>Add Event</button>
    </div>
  );
};
export default EventAdder;
