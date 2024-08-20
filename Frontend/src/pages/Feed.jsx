import React, { useEffect, useState } from "react";
import CreatePost from "../components/feed/CreatePost";
import GetAllPosts from "../components/feed/GetAllPosts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyncModal from "../components/feed/SyncModal";

const Feed = () => {
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
      <div
        className={`flex sm:mt-12 justify-center items-center ${
          syncing ? "overflow-hidden pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-row max-w-screen-2xl w-full p-4">
          <div className="flex flex-col items-center justify-center p-2 sm:p-4 lg:border-r border-neutral-500 w-full lg:w-2/3">
            <CreatePost createAlert={createAlert} />
            <GetAllPosts
              createAlert={createAlert}
              turnOnSyncModal={turnOnSyncModal}
            />
          </div>
          <div className="hidden lg:flex flex-col text-center items-center sticky top-0 w-1/3">
            <h1 className="text-4xl font-bold text-secondary">Syncs</h1>
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
