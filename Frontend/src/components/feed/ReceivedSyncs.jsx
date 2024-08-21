import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { getSnackbarUtilityClass } from "@mui/material";

const ReceivedSyncs = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie] = useCookies(["token"]);
  const [syncs, setSyncs] = useState([]);

  useEffect(() => {
    getSyncs();
  }, []);

  const getSyncs = () => {
    axios
      .get(BASE_URL + "/api/sync/received", {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      })
      .then((response) => {
        setSyncs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col items-center w-full p-2 mt-6">
      {syncs.length > 0 ? (
        syncs.map((sync) => (
          <div
            key={sync.id}
            className="border-b border-neutral-500 mb-4 w-full max-w-[700px] px-4 pt-2 pb-3"
          >
            <div className="flex justify-between">
              <div className="flex">
                <a
                  href={`${window.location.origin}/profile/${sync.senderUsername}`}
                  className="text-base font-Roboto font-bold text-primary hover:underline"
                >
                  {sync.senderUsername}
                </a>
                <p className="text-base font-Roboto text-secondary ml-2">
                  wants to sync
                </p>
              </div>
              <div className="flex">
                <button className="text-sm text-black font-Roboto font-bold bg-primary px-4 py-1 rounded-lg hover:scale-105 hover:brightness-110">
                  Accept
                </button>
                <button className="text-sm text-black font-Roboto font-bold bg-red-500 px-4 py-1 rounded-lg hover:scale-105 hover:brightness-110 ml-2">
                  Decline
                </button>
              </div>
            </div>
            <p className="mb-3 mt-2 text-start  font-Noto text-sm text-secondary break-words">
              {sync.message}
            </p>
          </div>
        ))
      ) : (
        <p className="text-lg font-Noto text-secondary">No received syncs</p>
      )}
    </div>
  );
};

export default ReceivedSyncs;
