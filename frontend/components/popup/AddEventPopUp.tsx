import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import './EventPopUp.css';
interface AddEventPopUpProps {
    addEventBtn: boolean;
    toggleAddEvent: () => void;
}

const AddEventPopUp: React.FC<AddEventPopUpProps> = ({ addEventBtn, toggleAddEvent }) => {
    if (addEventBtn) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }
    return (
        <>
            {addEventBtn && (
                <div className='modal'>
                    <div className='overlay'>
                        <div className='event-content'>
                            <Label>Title:</Label>
                            <Input type="text" placeholder="Event title"></Input>

                            <Label>Start Date:</Label>
                            <Input type="text" placeholder="Month, Day, Year, 00:00 (24h clock)"></Input>

                            <Label>End Date:</Label>
                            <Input type="text" placeholder="Month, Day, Year, 00:00 (24h clock)"></Input>

                            <Label>Location:</Label>
                            <Input type="text" placeholder="Event location"></Input>

                            <Label>Description:</Label>
                            <Input type="text" placeholder="Event description"></Input>
                            <br></br>
                            <Button onClick={toggleAddEvent}>Add Event</Button>
                        </div>
                    </div>
                </div>
            )}
            );
        </>)
}

export default AddEventPopUp;

