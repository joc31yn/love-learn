import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

import {
  InstaIcon,
  LocalIcon,
  LearnIcon,
  DevIcon,
  IcalIcon,
} from "@/components/icons/all_icons";
import Image from "next/image";
import gear_img from "@/lib/gears.png";

interface SyncPopUpProps {
  popUpStat: boolean;
  togglePopUpStat: () => void;
  onclose: () => void;
}

async function syncEvent(requestType: string, requestDetail: any) {
  console.log(requestDetail);
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ "type": requestType, "detail": requestDetail }),
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
  const [learnLink, setLearnLink] = useState("");
  const [displayICTF, setDisplayICTF] = useState(Boolean);
  const [ICFile, setICFile] = useState<File | null>(null);
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

  const handleLearnLinkChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value || ""; // Use `value` to capture input text
    setLearnLink(value); // Update the state
  };

  const handleICFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setICFile(file);
  };
  const instaOnClick = () => {
    setInsSynced(true);
    syncEvent("instagram", "uwcsclub");
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
    setLearnLink("");
    // https://supabase.com/docs/reference/javascript/auth-getsession
  };

  return (
    <>
      {popUpStat && (
        <div className="modal">
          <div className="overlay">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-gradient-to-r from-cyan-200 to-blue-50 rounded-lg shadow-lg w-1/3 max-w-2xl">
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
                        <span>Enter Calendar File From Learn:</span>
                        <input
                          type="text"
                          name="learn"
                          onChange={handleLearnLinkChange}
                        />
                        <div className="flex flex-row justify-between w-4/5">
                          <Button
                            className="bg-white text-black hover:bg-red-500 border border-black"
                            onClick={() => {
                              setLearnSynced(false), setDisplayLearnTF(false);
                            }}
                          >
                            CANCEL
                          </Button>
                          {learnLink != null && (
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
                          )}
                        </div>
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
                        <span>Enter Calendar File:</span>
                        <input
                          type="file"
                          name="ical"
                          accept="*/*"
                          onChange={handleICFileChange}
                        />
                        <div className="flex flex-row justify-between w-4/5">
                          <Button
                            className="bg-white text-black hover:bg-red-500 border border-black"
                            onClick={() => {
                              setIcalSynced(false), setDisplayICTF(false);
                            }}
                          >
                            CANCEL
                          </Button>
                          {ICFile != null && (
                            <Button
                              onClick={() => {
                                syncEvent("ical", ICFile),
                                  setICFile(null),
                                  setIcalSynced(true),
                                  setDisplayICTF(false);
                              }}
                            >
                              CONFIRM AND SEND
                            </Button>
                          )}
                        </div>
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
