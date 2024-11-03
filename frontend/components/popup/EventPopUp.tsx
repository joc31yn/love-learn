"use client";
import React, { useState } from 'react';
import './EventPopUp.css';

interface EventPopUpProps {
    modal: boolean;
    toggleModal: () => void;
}

const EventPopUp: React.FC<EventPopUpProps> = ({ modal, toggleModal }) => {
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }
    return (
        <>
            <button onClick={toggleModal}>open</button>
            {modal && (
                <div className='modal'>
                    <div className='overlay'>
                        <div className='event-content'>
                            <p>EVENTS Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Nam eu lacus ut lacus vulputate tincidunt quis vel nisl.
                                Phasellus a viverra elit. Vivamus nec scelerisque dolor.
                                Mauris sed placerat neque. Nullam arcu neque, mattis ac interdum vitae,
                                volutpat sed nulla. Fusce vel eros ut nibh faucibus venenatis.</p>
                            <button onClick={toggleModal} className='close'>CLOSE</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default EventPopUp
