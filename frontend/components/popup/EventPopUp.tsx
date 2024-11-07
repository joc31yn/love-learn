"use client";
import React from 'react';
import './EventPopUp.css';
import { Button } from '../ui/button';

interface EventPopUpProps {
    modal: boolean;
    toggleModal: () => void;
}

const EventPopUp: React.FC<EventPopUpProps> = ({ modal, toggleModal }) => {
    if (typeof window !== "undefined") {
        if (modal) {
            document.body.classList.add('active-modal');
        } else {
            document.body.classList.remove('active-modal');
        }
    }
    return (
        <>
            {modal && (
                <div className='modal'>
                    <div className='overlay'>
                        <div className='event-content'>
                            <p>EVENTS Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Nam eu lacus ut lacus vulputate tincidunt quis vel nisl.
                                Phasellus a viverra elit. Vivamus nec scelerisque dolor.
                                Mauris sed placerat neque. Nullam arcu neque, mattis ac interdum vitae,
                                volutpat sed nulla. Fusce vel eros ut nibh faucibus venenatis.</p>
                                <br></br>
                            <Button onClick={toggleModal}>CLOSE</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EventPopUp
