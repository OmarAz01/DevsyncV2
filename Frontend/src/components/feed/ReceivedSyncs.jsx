import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { formatDistanceToNow, parseISO, set } from "date-fns";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const ReceivedSyncs = ({ createAlert }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie] = useCookies(["token"]);
  const [syncs, setSyncs] = useState([]);
  const [syncResponseModal, setSyncResponseModal] = useState({
    open: false,
    syncId: "",
    status: "",
  });
  const [syncResponse, setSyncResponse] = useState("");

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
        const formattedSyncs = response.data.map((sync) => {
          const formattedTime = sync.dateOfSync + "Z";
          return {
            ...sync,
            dateOfSync: formatDistanceToNow(parseISO(formattedTime), {
              addSuffix: true,
            }),
          };
        });
        setSyncs(formattedSyncs);
      })
      .catch((error) => {
        createAlert("Failed to get syncs", "error");
        console.log(error);
      });
  };

  const openSyncResponseModal = (syncId, status) => {
    setSyncResponseModal({
      open: true,
      syncId: syncId,
      status: status,
    });
  };

  const closeSyncResponseModal = () => {
    setSyncResponseModal({
      open: false,
      syncId: "",
      status: "",
    });
  };

  const acceptSync = (syncId) => {
    const profanityMatcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });
    if (profanityMatcher.hasMatch(syncResponse)) {
      createAlert("Message contains profanity", "error");
      return;
    }
    let responseSync = syncs.find((sync) => sync.syncId === syncId);
    responseSync.status = "Accepted";
    responseSync.message = syncResponse;
    axios
      .put(BASE_URL + "/api/sync/" + syncId, responseSync, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      })
      .then((response) => {
        getSyncs();
        setSyncResponse("");
        closeSyncResponseModal();
        createAlert("Sync accepted", "success");
      })
      .catch((error) => {
        createAlert("Failed to accept sync", "error");
        console.log(error);
      });
  };

  const rejectSync = (syncId) => {
    let responseSync = syncs.find((sync) => sync.syncId === syncId);
    responseSync.status = "Rejected";
    axios
      .put(BASE_URL + "/api/sync/" + syncId, responseSync, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      })
      .then((response) => {
        getSyncs();
        closeSyncResponseModal();
        createAlert("Sync Rejected", "success");
      })
      .catch((error) => {
        createAlert("Failed to accept sync", "error");
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col items-center w-full px-2 pt-2 mt-6">
      {syncs.length > 0 ? (
        syncs.map((sync) => (
          <div
            key={sync.syncId}
            className="border-b border-neutral-500 mb-4 w-full max-w-[700px] px-4 pt-2 pb-2"
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
                <button
                  onClick={(e) => openSyncResponseModal(sync.syncId, "Accept")}
                  className="text-sm text-black font-Roboto font-bold bg-primary px-4 py-1 rounded-lg hover:scale-105 hover:brightness-110"
                >
                  Accept
                </button>
                <button
                  onClick={(e) => openSyncResponseModal(sync.syncId, "Reject")}
                  className="text-sm text-black font-Roboto font-bold bg-red-500 px-4 py-1 rounded-lg hover:scale-105 hover:brightness-110 ml-2"
                >
                  Reject
                </button>
              </div>
            </div>
            <p className="mb-2 mt-2 text-start  font-Noto text-sm text-secondary break-words">
              {sync.message}
            </p>
            <p className="text-sm w-full text-end text-neutral-500 italic">
              Sent {sync.dateOfSync}
            </p>
          </div>
        ))
      ) : (
        <p className="text-lg font-Noto text-secondary">No received syncs</p>
      )}
      {syncResponseModal.open && syncResponseModal.status === "Accept" ? (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 pointer-events-none"></div>
          <div className="fixed h-fit w-4/5 sm:w-[600px] top-1/2 left-1/2 transform -translate-x-1/2 rounded-3xl -translate-y-1/2 bg-background border-2 border-primary shadow-xl shadow-black px-2 pt-2 sm:px-8 sm:pt-8 z-50">
            <div className="flex flex-col h-full">
              <h1 className="text-secondary text-center text-xl sm:text-2xl border-b pb-2 px-4 sm:mt-0 mt-2 border-neutral-700 font-Roboto font-bold">
                Accept the Sync Request
              </h1>
              <div className="flex-col flex justify-start w-full p-2 md:p-4 items-start">
                <div className="flex flex-col items-start w-full">
                  <textarea
                    name="message"
                    id="message"
                    className="w-full border mt-2 resize-none border-neutral-400 rounded-md p-2 bg-neutral-900 text-secondary font-Roboto"
                    placeholder="This is an optional one time response, you can use this to send a short message letting them know you accepted the sync and if you have a different preferred contact method."
                    value={syncResponse}
                    onChange={(e) => setSyncResponse(e.target.value)}
                    rows={9}
                    maxLength={250}
                  ></textarea>
                </div>
                <div className="flex flex-row items-center justify-center my-4 space-x-4 w-full">
                  <button
                    onClick={() => acceptSync(syncResponseModal.syncId)}
                    className="bg-green-500 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => closeSyncResponseModal()}
                    className="bg-red-600 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : syncResponseModal.open && syncResponseModal.status === "Reject" ? (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 pointer-events-none"></div>
          <div className="fixed h-fit w-4/5 sm:w-[600px] top-1/2 left-1/2 transform -translate-x-1/2 rounded-3xl -translate-y-1/2 bg-background border-2 border-primary shadow-xl shadow-black px-2 pt-2 sm:px-8 sm:pt-8 z-50">
            <div className="flex flex-col h-full">
              <h1 className="text-secondary text-center text-xl sm:text-2xl border-b pb-2 px-4 sm:mt-0 mt-2 border-neutral-700 font-Roboto font-bold">
                Are you sure you want to reject the Sync Request?
              </h1>
              <div className="flex flex-row items-center justify-center my-4 space-x-4 w-full">
                <button
                  onClick={() => rejectSync(syncResponseModal.syncId)}
                  className="bg-green-500 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                >
                  Yes
                </button>
                <button
                  onClick={() => closeSyncResponseModal()}
                  className="bg-red-600 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ReceivedSyncs;
