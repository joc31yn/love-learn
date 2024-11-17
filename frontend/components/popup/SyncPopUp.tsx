import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createBrowserClient } from '@supabase/ssr';

interface SyncPopUpProps {
  popUpStat: boolean;
  togglePopUpStat: () => void;
  onclose: () => void;
}

async function syncEvent(requestType: string, requestDetail: string) {
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requestType }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error syncing event:', errorData.error);
    return;
  }

  const data = await response.json();
  console.log('Sync event response:', data);
}

const SyncPopUp: React.FC<SyncPopUpProps> = ({
  popUpStat,
  togglePopUpStat,
  onclose,
}) => {
  //   const emptyEventData = {
  //     title: "",
  //     start_date: "",
  //     end_date: "",
  //     location: "",
  //     description: "",
  //   };
  const [displayLearnTF, setDisplayLearnTF] = useState(Boolean);
  const [learnLink, setLearnLink] = useState(String);
  const [displayICTF, setDisplayICTF] = useState(Boolean);
  const [ICLink, setICLink] = useState(String);

  useEffect(() => {
    // Add or remove the modal class based on the togglePopup state
    if (typeof window !== "undefined") {
      if (popUpStat) {
        document.body.classList.add("active-modal");
      } else {
        document.body.classList.remove("active-modal");
      }
    }
  }, [popUpStat]);

  const handleOnClose = async () => {
    setDisplayLearnTF(false);
    setDisplayICTF(false);
    onclose();
    togglePopUpStat();
    // https://supabase.com/docs/reference/javascript/auth-getsession
  };

  return (
    <>
      {popUpStat && (
        <div className="modal">
          <div className="overlay">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 leading-7 bg-gray-100 p-6 rounded w-1/2">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Sync Options
              </h1>
              <div className="flex flex-col items-center space-y-4">
                <Button
                  onClick={() => syncEvent("instagram", "")} // Close the modal
                >
                  SYNC INSTAGRAM
                </Button>
                <Button
                  onClick={() => syncEvent("devpost", "")} // Close the modal
                >
                  SYNC DEVPOST
                </Button>
                <Button
                  onClick={() => setDisplayLearnTF(true)} // Close the modal
                >
                  SYNC LEARN
                </Button>

                {displayLearnTF && (
                  <div className="flex flex-col items-center space-y-4">
                    <Label>LEARN LINK:</Label>
                    <Input
                      type="text"
                      name="learn"
                      placeholder="enter link here"
                      value={learnLink}
                      onChange={(e) => setLearnLink(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        syncEvent("learn", learnLink),
                          setLearnLink(""),
                          setDisplayLearnTF(false);
                      }}
                    >
                      CONFIRM AND SEND
                    </Button>
                  </div>
                )}

                <Button
                  onClick={() => setDisplayICTF(true)} // Close the modal
                >
                  SYNC ICAL
                </Button>

                {displayICTF && (
                  <div className="flex flex-col items-center space-y-4">
                    <Label>ICAL LINK:</Label>
                    <Input
                      className="w-30"
                      type="text"
                      name="ical"
                      placeholder="enter link here"
                      value={ICLink}
                      onChange={(e) => setICLink(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        syncEvent("ical", ICLink),
                          setICLink(""),
                          setDisplayICTF(false);
                      }}
                    >
                      CONFIRM AND SEND
                    </Button>
                  </div>
                )}
                <br />
                <button
                  onClick={handleOnClose}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-red-500"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SyncPopUp;
//TEST THIS SHIT TMR
