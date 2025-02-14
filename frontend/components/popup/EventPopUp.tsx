"use client";
import React from "react";
import "./EventPopUp.css";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { EventProp } from "@/utils/types";

interface EventPopUpProps {
    event: EventProp;
    modal: boolean;
    toggleModal: () => void;
}

const EventPopUp: React.FC<EventPopUpProps> = ({ event, modal, toggleModal }) => {
    if (typeof window !== "undefined") {
        if (modal) {
            document.body.classList.add("active-modal");
        } else {
            document.body.classList.remove("active-modal");
        }
    }

    return (
        <>
            {modal && (
                <div className="modal">
                    <div className="overlay">
                        <div className="event-content">
                            <Button
                                onClick={toggleModal}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                Close
                            </Button>

                            <h2 className="text-xl font-semibold mb-4">Event Details</h2>

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

                            <div className="flex justify-center mt-4">
                                <Button
                                    onClick={toggleModal}
                                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventPopUp;
