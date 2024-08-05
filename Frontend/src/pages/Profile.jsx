import React, { useEffect, useState } from "react";
import SkillSection from "../components/profile/SkillSection";
import BioSection from "../components/profile/BioSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Profile = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [userDetails, setUserDetails] = useState({});
  const [currentView, setCurrentView] = useState("Posts");

  const createAlert = (title, variant) => {
    if (variant === "success") {
      return toast.success(title);
    } else {
      return toast.error(title);
    }
  };

  useEffect(() => {
    // Fetch user data
    const username = location.pathname.split("/")[2];
    if (username) {
      axios
        .get(`${BASE_URL}/api/user/profile/${username}`)
        .then((response) => {
          console.log(response.data);
          setUserDetails(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  return (
    <div className="flex justify-center items-center sm:mt-12">
      <div className="flex lg:flex-row flex-col p-4 w-full max-w-screen-2xl justify-center items-center">
        <div className="flex flex-col lg:left-0 w-fit h-fit pb-4 pt-12 lg:px-6 items-center max-w-md">
          <BioSection userDetails={userDetails} createAlert={createAlert} />
        </div>
        <div className="sm:max-w-[650px] flex flex-col lg:ml-4 xl:ml-16">
          <div className="flex flex-col h-fit mt-8 pb-4 sm:mt-102 items-center border-neutral-700 border-b w-full">
            <SkillSection userDetails={userDetails} createAlert={createAlert} />
          </div>
          <div className="flex flex-row justify-center text-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentView("Posts")}
              className={`${
                currentView === "Posts"
                  ? "text-primary underline"
                  : "text-secondary"
              } hover:text-primary text-2xl sm:text-3xl font-Roboto font-bold`}
            >
              Posts
            </button>
            <h4 className="text-secondary text-2xl sm:text-3xl font-Roboto font-bold">
              |
            </h4>
            <button
              onClick={() => setCurrentView("Syncs")}
              className={`${
                currentView === "Syncs"
                  ? "text-primary underline"
                  : "text-secondary"
              } hover:text-primary text-2xl sm:text-3xl font-Roboto font-bold`}
            >
              Syncs
            </button>
            <h4 className="text-secondary text-2xl sm:text-3xl font-Roboto font-bold">
              |
            </h4>
            <button
              onClick={() => setCurrentView("Settings")}
              className={`${
                currentView === "Settings"
                  ? "text-primary underline"
                  : "text-secondary"
              } hover:text-primary text-2xl sm:text-3xl font-Roboto font-bold`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default Profile;
