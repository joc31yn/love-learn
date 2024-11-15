import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Instagram } from "lucide-react";
import {
  InstaIcon,
  LocalIcon,
  LearnIcon,
  DevIcon,
  IcalIcon,
} from "@/components/icons/all_icons";

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
  const [learnSynced, setLearnSynced] = useState(Boolean);
  const [insSynced, setInsSynced] = useState(Boolean);
  const [devSynced, setDevSynced] = useState(Boolean);
  const [icalSynced, setIcalSynced] = useState(Boolean);
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

  const instaOnClick = () => {
    setInsSynced(true);
    syncEvent("instagram", "");
  };
  const devOnClick = () => {
    syncEvent("devpost", "");
    setDevSynced(true);
  };

  const handleOnClose = async () => {
    setIcalSynced(false);
    setDevSynced(false);
    setInsSynced(false);
    setDisplayLearnTF(false);
    setLearnSynced(false);
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-lg w-1/3 max-w-2xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex flex-row items-center space-x-2">
                    <h2 className="text-2xl font-bold">Sync To</h2>
                    <LocalIcon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">: </h2>
                    {insSynced && <InstaIcon className="w-8 h-8" />}
                    {learnSynced && <LearnIcon className="w-8 h-8" />}
                    {devSynced && <DevIcon className="w-8 h-8" />}
                    {icalSynced && <IcalIcon className="w-8 h-8" />}
                  </div>

                  <Button variant="ghost" size="icon" onClick={handleOnClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <div className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-row justify-between w-4/5">
                      <Button
                        onClick={instaOnClick} // Close the modal
                      >
                        SYNC INSTAGRAM
                      </Button>

                      <InstaIcon className="w-8 h-8" />
                    </div>
                    <div className="flex flex-row justify-between w-4/5">
                      <Button
                        onClick={devOnClick} // Close the modal
                      >
                        SYNC DEVPOST
                      </Button>
                      <DevIcon className="w-8 h-8" />
                    </div>
                    <div className="flex flex-row justify-between w-4/5">
                      <Button
                        onClick={() => setDisplayLearnTF(true)} // Close the modal
                      >
                        SYNC LEARN
                      </Button>
                      <LearnIcon className="w-8 h-8" />
                    </div>

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
                              setLearnSynced(true),
                              setDisplayLearnTF(false);
                          }}
                        >
                          CONFIRM AND SEND
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-row justify-between w-4/5">
                      <Button
                        onClick={() => setDisplayICTF(true)} // Close the modal
                      >
                        SYNC ICAL
                      </Button>
                      <IcalIcon className="w-8 h-8" />
                    </div>
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
                              setIcalSynced(true);
                            setDisplayICTF(false);
                          }}
                        >
                          CONFIRM AND SEND
                        </Button>
                      </div>
                    )}
                    <br />
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

export default SyncPopUp;
