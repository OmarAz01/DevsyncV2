import React from "react";
import { useState, useEffect } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useCookies } from "react-cookie";
import axios from "axios";
import SyncModal from "../modals/SyncModal";
import ReportModal from "../modals/ReportModal";

const BioSection = ({
  userDetails,
  createAlert,
  currUserProfile,
  handleUserDetailsChange,
  changeEditProfile,
}) => {
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [syncing, setSyncing] = useState({ syncing: false, syncingWith: "" });
  const [reportModal, setReportModal] = useState(false);

  const turnOffReportModal = () => {
    setReportModal(false);
  };

  const turnOnSyncModal = () => {
    setSyncing({ syncing: true, syncingWith: userDetails.username });
  };

  const turnOffSyncModal = () => {
    setSyncing({ syncing: false, syncingWith: "" });
  };

  return (
    <>
      {syncing.syncing && (
        <SyncModal
          syncingWith={syncing.syncingWith}
          turnOffSyncModal={turnOffSyncModal}
          createAlert={createAlert}
        />
      )}
      {reportModal && (
        <ReportModal
          turnOffReportModal={turnOffReportModal}
          createAlert={createAlert}
          reportedUser={userDetails.username}
        />
      )}
      <div className="p-2 flex flex-col items-center text-center w-full">
        <div className="flex flex-row items-end justify-center w-full h-full pb-1">
          <h1 className="sm:text-5xl text-4xl text-secondary font-Roboto px-4 font-bold break-words">
            {userDetails.username}
          </h1>
          {currUserProfile && (
            <button
              onClick={changeEditProfile}
              className="bg-primary hover:brightness-110 hover:scale-105 mb-1 text-background font-Roboto font-bold p-1 rounded-full"
            >
              <ModeEditIcon />
            </button>
          )}
        </div>

        {userDetails.userLink && (
          <div className="flex flex-row items-center justify-center w-full mt-2">
            <a
              href={userDetails.userLink}
              target="_blank"
              rel="noreferrer"
              className="text-primary w-fit font-Roboto px-4 font-bold text-lg hover:underline break-words"
            >
              {userDetails.userLink.substring(0, 30) + "..."}
            </a>
          </div>
        )}
        {!currUserProfile && (
          <div className="flex flex-row space-x-4 items-center justify-center mt-3 w-full">
            <button
              onClick={(e) => turnOnSyncModal()}
              className="bg-primary font-Roboto w-24 font-bold hover:brightness-110 hover:scale-105 text-lg py-1 rounded-md"
            >
              Sync
            </button>
            <button
              onClick={(e) => setReportModal(true)}
              className="bg-red-600 font-Roboto w-24 font-bold hover:brightness-110 hover:scale-105 text-lg py-1  rounded-md"
            >
              Report
            </button>
          </div>
        )}

        <div className="flex flex-col mt-4 w-full px-3 py-4 border rounded-2xl items-center bg-neutral-900 border-primary space-y-2">
          <h3 className="text-secondary text-2xl font-Roboto font-medium border-b border-neutral-700 pb-2">
            Bio
          </h3>
          <p className="text-secondary text-sm sm:text-base font-Noto px-4 break-words">
            {userDetails.bio || "This user has not set up a bio yet."}
          </p>
        </div>
      </div>
    </>
  );
};

export default BioSection;
