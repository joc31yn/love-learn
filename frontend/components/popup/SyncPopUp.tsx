import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


interface SyncPopUpProps {
  popUpStat: boolean;
  togglePopUpStat: () => void;
  onclose: () => void;
}

async function syncEvent(requestType: string, requestDetail: string) {
  if (requestType === "instagram") {
  } else if (requestType === "learn") {
  } else if (requestType === "devpost") {
  } else if (requestType === "ical") {
  }
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
    onclose()
    togglePopUpStat();
    // https://supabase.com/docs/reference/javascript/auth-getsession
    
  };

  return (
    <>
      {popUpStat && (
        <div className="modal">
          <div className="overlay">
            <div className="event-content">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Sync Options
              </h1>
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={() => syncEvent("instagram", "")} // Close the modal
                  className="mx-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-yellow-100 active:bg-gray-200"
                >
                  SYNC INSTAGRAM
                </button>
                <button
                  onClick={() => syncEvent("devpost", "")} // Close the modal
                  className="mx-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-yellow-100 active:bg-gray-200"
                >
                  SYNC DEVPOST
                </button>
                <button
                  onClick={() => setDisplayLearnTF(true)} // Close the modal
                  className="mx-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-yellow-100 active:bg-gray-200"
                >
                  SYNC LEARN
                </button>

                {displayLearnTF && (
                  <div>
                    <Label>DEVPOST LINK:</Label>
                    <Input
                      type="text"
                      name="learn"
                      placeholder="enter link here"
                      value={learnLink}
                      onChange={(e) => setLearnLink(e.target.value)}
                    />
                    <button
                      onClick={() => { syncEvent("learn", learnLink), setLearnLink(""), setDisplayLearnTF(false) }}
                      className="mx-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-yellow-100 active:bg-gray-200"
                    >
                      CONFIRM AND SEND
                    </button>
                  </div>
                              )}
                              
                <button
                  onClick={() => setDisplayICTF(true)} // Close the modal
                  className="mx-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-yellow-100 active:bg-gray-200"
                >
                  SYNC ICAL
                </button>

                {displayICTF && (
                  <div>
                    <Label>ICAL LINK:</Label>
                    <Input
                      type="text"
                      name="ical"
                      placeholder="enter link here"
                      value={ICLink}
                      onChange={(e) => setICLink(e.target.value)}
                    />
                    <button
                      onClick={() => { syncEvent("ical", ICLink), setICLink(""), setDisplayICTF(false) }}
                      className="mx-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-yellow-100 active:bg-gray-200"
                    >
                      CONFIRM AND SEND
                    </button>
                  </div>
                )}
              </div>

              
              <br />
              <Button onClick={handleOnClose}>CLOSE</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SyncPopUp;
//TEST THIS SHIT TMR