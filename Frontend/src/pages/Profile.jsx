import React, { useEffect, useState } from "react";
import SkillSection from "../components/profile/SkillSection";
import BioSection from "../components/profile/BioSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import axios from "axios";

const Profile = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [userDetails, setUserDetails] = useState({});
  const [currentView, setCurrentView] = useState("Posts");
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [currUserProfile, setCurrUserProfile] = useState(false);

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
      if (username === "myprofile") {
        setCurrUserProfile(true);
        const token = cookie.token;
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        axios
          .get(`${BASE_URL}/api/user/profile/${username}`, { headers: headers })
          .then((response) => {
            console.log(response.data);
            setUserDetails(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
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
    }
  }, []);

  const handleUserDetailsChange = (newUserDetails) => {
    setUserDetails(newUserDetails);
  };
  return (
    <div className="flex sm:mt-12 justify-center items-center">
      <div className="flex lg:flex-row flex-col p-4 w-full max-w-screen-2xl justify-center lg:items-start items-center ">
        <div className="flex flex-col lg:left-0 w-fit h-fit pb-4 pt-12 font-Roboto lg:px-6 items-center max-w-md">
          <BioSection
            userDetails={userDetails}
            createAlert={createAlert}
            currUserProfile={currUserProfile}
            handleUserDetailsChange={handleUserDetailsChange}
          />
        </div>
        <div className="sm:max-w-[650px] flex flex-col lg:ml-4 xl:ml-16">
          <div className="flex flex-col h-fit mt-8 pb-4 sm:mt-102 items-center font-Roboto border-neutral-700 border-b w-full">
            <SkillSection
              userDetails={userDetails}
              createAlert={createAlert}
              currUserProfile={currUserProfile}
              handleUserDetailsChange={handleUserDetailsChange}
            />
          </div>
          {currUserProfile ? (
            <div className="flex flex-row justify-center text-center font-Roboto items-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentView("Posts")}
                className={`${
                  currentView === "Posts"
                    ? "text-primary underline"
                    : "text-secondary"
                } hover:text-primary text-xl sm:text-2xl font-Roboto font-medium`}
              >
                Posts
              </button>
              <h4 className="text-secondary text-xl sm:text-2xl font-Roboto font-bold">
                |
              </h4>
              <button
                onClick={() => setCurrentView("Syncs")}
                className={`${
                  currentView === "Syncs"
                    ? "text-primary underline"
                    : "text-secondary"
                } hover:text-primary text-xl sm:text-2xl font-Roboto font-medium`}
              >
                Syncs
              </button>
              <h4 className="text-secondary text-xl sm:text-2xl font-Roboto font-bold">
                |
              </h4>
              <button
                onClick={() => setCurrentView("Settings")}
                className={`${
                  currentView === "Settings"
                    ? "text-primary underline"
                    : "text-secondary"
                } hover:text-primary text-xl sm:text-2xl font-Roboto font-medium`}
              >
                Settings
              </button>
            </div>
          ) : (
            <>
              <h4 className="text-center mt-6 text-secondary text-xl sm:text-2xl font-Roboto font-medium">
                Posts
              </h4>
              <p className="text-secondary text-lg font-Roboto mt-4">
                Not curr user posts
              </p>
            </>
          )}
          {currUserProfile && currentView === "Posts" && (
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="text-secondary text-lg font-Roboto mt-4">
                Current user's posts
              </p>
            </div>
          )}
          {currUserProfile && currentView === "Syncs" && (
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="text-secondary text-lg font-Roboto mt-4">
                No syncs yet
              </p>
            </div>
          )}
          {currUserProfile && currentView === "Settings" && (
            <div className="flex flex-col items-center justify-center mt-4">
              <p className="text-secondary text-lg font-Roboto mt-4">
                No settings yet
              </p>
            </div>
          )}
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
