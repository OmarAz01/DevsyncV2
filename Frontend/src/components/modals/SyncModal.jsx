import React, { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const SyncModal = ({ syncingWith, turnOffSyncModal, createAlert }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie] = useCookies(["token"]);
  const [message, setMessage] = useState("");

  const handleSync = () => {
    if (cookie.token === undefined || cookie.token === null) {
      createAlert("You must be logged in to sync", "error");
      turnOffSyncModal();
      return;
    }
    if (message === "") {
      createAlert("Message cannot be empty", "error");
      return;
    }
    const profanityMatcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });
    if (profanityMatcher.hasMatch(message)) {
      createAlert("Message contains profanity", "error");
      return;
    }
    axios
      .post(
        BASE_URL + "/api/sync",
        {
          message: message,
          recipientUsername: syncingWith,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        }
      )
      .then((response) => {
        createAlert("Sync sent", "success");
        turnOffSyncModal();
      })
      .catch((error) => {
        createAlert("Failed to send sync", "error");
        turnOffSyncModal();
        console.log(error);
      });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 pointer-events-none"></div>
      <div className="fixed h-fit w-4/5 sm:w-[600px] top-1/2 left-1/2 transform -translate-x-1/2 rounded-3xl -translate-y-1/2 bg-background border-2 border-primary shadow-xl shadow-black px-2 pt-2 sm:px-8 sm:pt-8 z-50">
        <div className="flex flex-col h-full">
          <h1 className="text-secondary text-center text-xl sm:text-2xl border-b pb-2 px-4 sm:mt-0 mt-2 border-neutral-700 font-Roboto font-bold">
            Sync with {syncingWith}
          </h1>
          <div className="flex-col flex justify-start w-full p-2 md:p-4 items-start">
            <div className="flex flex-col items-start w-full">
              <textarea
                name="message"
                id="message"
                className="w-full border mt-2 resize-none border-neutral-400 rounded-md p-2 bg-neutral-900 text-secondary font-Roboto"
                placeholder="*Use this to send a short message letting them know you want to sync. Don't forget to include your preferred contact info!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={9}
                maxLength={250}
              ></textarea>
            </div>
            <div className="flex flex-row items-center justify-center my-4 space-x-4 w-full">
              <button
                onClick={handleSync}
                className="bg-primary hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
              >
                Sync
              </button>
              <button
                onClick={() => turnOffSyncModal()}
                className="bg-red-600 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SyncModal;
