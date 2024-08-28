import React, { useEffect, useState } from "react";
import CreatePost from "../components/feed/CreatePost";
import GetAllPosts from "../components/feed/GetAllPosts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReceivedSyncs from "../components/feed/ReceivedSyncs";
import { useCookies } from "react-cookie";
import SyncModal from "../components/modals/SyncModal";
import { Helmet } from "react-helmet";
import { TroubleshootTwoTone } from "@mui/icons-material";

const Feed = () => {
  const [cookie] = useCookies(["token"]);
  const [syncing, setSyncing] = useState(false);
  const [syncingWith, setSyncingWith] = useState("");

  const createAlert = (title, variant) => {
    if (variant === "success") {
      return toast.success(title);
    } else {
      return toast.error(title);
    }
  };

  const turnOnSyncModal = (username) => {
    setSyncing(true);
    setSyncingWith(username);
  };

  const turnOffSyncModal = () => {
    setSyncing(false);
    setSyncingWith("");
  };

  useEffect(() => {
    if (syncing) {
      document.body.style.overflow = "hidden";
      document.querySelector("header").style.pointerEvents = "none";
    } else {
      document.body.style.overflow = "auto";
      document.querySelector("header").style.pointerEvents = "auto";
    }
  }, [syncing]);

  return (
    <>
      <Helmet>
        <title>Feed | devsync</title>
      </Helmet>
      <div
        className={`flex sm:mt-12 justify-center items-center ${
          syncing ? "overflow-hidden pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-row max-w-screen-xl w-full p-4 ">
          <div className="flex flex-col lg:items-start items-center justify-center p-2 sm:p-4 lg:border-r border-neutral-500 w-full lg:w-8/12">
            <CreatePost createAlert={createAlert} />
            <GetAllPosts
              createAlert={createAlert}
              turnOnSyncModal={turnOnSyncModal}
            />
          </div>
          <div className="hidden lg:flex flex-col text-center items-center h-fit w-4/12">
            <h2 className="text-2xl mt-8 font-semibold font-Roboto text-secondary">
              Received Syncs
            </h2>
            {cookie.token ? (
              <ReceivedSyncs createAlert={createAlert} />
            ) : (
              <a
                href="/signin"
                className="text-lg mt-8 font-Noto text-primary italic hover:underline"
              >
                Sign in to see your syncs
              </a>
            )}
          </div>
        </div>
      </div>
      {syncing && (
        <SyncModal
          syncingWith={syncingWith}
          turnOffSyncModal={turnOffSyncModal}
          createAlert={createAlert}
        />
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Feed;
