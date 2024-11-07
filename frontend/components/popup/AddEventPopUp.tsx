import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
//import './EventPopUp.css';
import { EventProp, emptyEventData } from '@/utils/types';
// import { createClient } from "@/utils/supabase/server";

interface AddEventPopUpProps {
    togglePopup: boolean;
    toggleAddEvent: () => void;
    toggleRemoveEvent: () => void;
}

async function addEvent(eventProp: EventProp) {
    const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventProp),
    });

    const data = await response.json();
    
    if (!response.ok) {
        console.error('Error:', data);
    } else {
        console.log('Success:', data.message);
    }
}

const AddEventPopUp: React.FC<AddEventPopUpProps> = ({ togglePopup, toggleAddEvent, toggleRemoveEvent }) => {

    const [eventData, setEventData] = useState(emptyEventData);

    const resetEventData = () => {
        setEventData(emptyEventData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name);
        setEventData((prevData: any) => ({
            ...prevData,
            [name]: value
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
            document.body.classList.add('active-modal');
        } else {
            document.body.classList.remove('active-modal');
        }
    }

    return (
        <>
            {togglePopup && (
                <div className='modal'>
                    <div className='overlay'>
                        <div className='event-content'>
                            <button
                                onClick={handleRemoveEvent} // Close the modal
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                            </button>

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
                            <Button onClick={handleAddEvent}>Add Event</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddEventPopUp;
