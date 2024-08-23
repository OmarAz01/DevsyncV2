import React, { useEffect, useState } from "react";
import SkillSection from "../components/profile/SkillSection";
import BioSection from "../components/profile/BioSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const Profile = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [userDetails, setUserDetails] = useState({});
  const [currentView, setCurrentView] = useState("Posts");
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [currUserProfile, setCurrUserProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState({});

  const createAlert = (title, variant) => {
    if (variant === "success") {
      return toast.success(title);
    } else {
      return toast.error(title);
    }
  };

  const changeEditProfile = () => {
    setEditProfile(true);
  };

  useEffect(() => {
    // Fetch user data
    const username = location.pathname.split("/")[2];
    if (username) {
      if (username === "myprofile") {
        if (!cookie.token) {
          window.location.href = "/signin";
          return;
        }
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
            setUpdatedUserDetails(response.data);
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

  const verifyProfileDetails = (userDetails) => {
    const userLinkRegex =
      /^https:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    if (!userLinkRegex.test(userDetails.userLink)) {
      createAlert("Invalid user link", "error");
      return false;
    }
    const skills = userDetails.skills.split(", ");
    if (skills.length < 3) {
      createAlert(
        "You must have atleast three skills seperated by a comma and a space",
        "error"
      );
      return false;
    }
    // Profanity check
    const profanityMatcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });
    if (profanityMatcher.hasMatch(userDetails.bio)) {
      createAlert("Bio contains profanity", "error");
      return false;
    }
    for (const s of skills) {
      if (profanityMatcher.hasMatch(s)) {
        createAlert("Skills contain profanity", "error");
        return false;
      }
    }

    return true;
  };

  const handleProfileUpdate = () => {
    if (!updatedUserDetails.userLink) {
      createAlert("User link cannot be empty", "error");
      return;
    }
    if (!updatedUserDetails.bio) {
      createAlert("Bio cannot be empty", "error");
      return;
    }
    if (!updatedUserDetails.skills) {
      createAlert("Skills cannot be empty", "error");
      return;
    }
    if (!verifyProfileDetails(updatedUserDetails)) {
      return;
    }

    const token = cookie.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const username = location.pathname.split("/")[2];
    axios
      .put(
        `${BASE_URL}/api/user/profile/${username}/update`,
        updatedUserDetails,
        { headers: headers }
      )
      .then((response) => {
        createAlert("Profile updated successfully", "success");
        setUserDetails(updatedUserDetails);
        setEditProfile(false);
      })
      .catch((error) => {
        console.log(error);
        createAlert("Profile update failed", "error");
      });
  };

  const handleUserDetailsChange = (newUserDetails) => {
    setUserDetails(newUserDetails);
  };

  useEffect(() => {
    if (editProfile) {
      document.body.style.overflow = "hidden";
      document.querySelector("header").style.pointerEvents = "none";
    } else {
      document.body.style.overflow = "auto";
      document.querySelector("header").style.pointerEvents = "auto";
    }
  }, [editProfile]);

  return (
    <>
      <div
        className={`flex sm:mt-12 justify-center items-center ${
          editProfile ? "overflow-hidden pointer-events-none" : ""
        }`}
      >
        <div className="flex lg:flex-row flex-col p-4 w-full max-w-screen-2xl justify-center lg:items-start items-center">
          <div className="flex flex-col lg:left-0 w-full h-fit pb-4 pt-12 font-Roboto lg:px-6 items-center max-w-md">
            <BioSection
              userDetails={userDetails}
              createAlert={createAlert}
              currUserProfile={currUserProfile}
              handleUserDetailsChange={handleUserDetailsChange}
              changeEditProfile={changeEditProfile}
            />
          </div>
          <div className="sm:max-w-[650px] flex flex-col lg:ml-4 xl:ml-16">
            <div className="flex flex-col h-fit mt-8 lg:mt-12 pb-4 sm:mt-102 items-center font-Roboto border-neutral-700 border-b w-full">
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
      {editProfile && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 pointer-events-none"></div>
          <div className="fixed max-h-[750px] h-4/5 w-4/5 sm:w-[600px] top-1/2 left-1/2 transform -translate-x-1/2 rounded-3xl -translate-y-1/2 bg-background border-2 border-primary shadow-xl shadow-black p-2 sm:p-8 z-50">
            <div className="flex flex-col h-full">
              <h1 className="text-secondary text-center text-xl sm:text-2xl border-b pb-2 px-4 sm:mt-0 mt-2 border-neutral-700 font-Roboto font-bold">
                Edit Profile
              </h1>
              <div className="flex flex-col h-full overflow-y-auto pb-2 mt-2 px-4">
                <div className="flex-col mt-2 sm:mt-6 flex justify-start w-full items-start">
                  <h2 className="text-secondary text-lg sm:text-xl font-Roboto font-medium">
                    User Header Link
                  </h2>
                  <h3 className="text-neutral-400 text-xs sm:text-sm font-Roboto ">
                    This link will be displayed on your profile header. Use it
                    to show off a project or personal website.
                  </h3>
                  <input
                    type="text"
                    placeholder="User Link"
                    value={updatedUserDetails.userLink}
                    maxLength={100}
                    onChange={(e) =>
                      setUpdatedUserDetails({
                        ...updatedUserDetails,
                        userLink: e.target.value,
                      })
                    }
                    className="w-full p-2 mt-2 bg-background text-secondary rounded-md border border-neutral-400"
                  />
                </div>
                <div className="flex-col mt-4 flex justify-start w-full items-start">
                  <h2 className="text-secondary text-lg sm:text-xl font-Roboto font-medium">
                    Bio
                  </h2>
                  <h3 className="text-neutral-400 text-xs sm:text-sm font-Roboto ">
                    Tell us about yourself. This will be displayed on your
                    profile.
                  </h3>
                  <textarea
                    type="text"
                    placeholder="Bio"
                    value={updatedUserDetails.bio}
                    maxLength={300}
                    onChange={(e) =>
                      setUpdatedUserDetails({
                        ...updatedUserDetails,
                        bio: e.target.value,
                      })
                    }
                    className="w-full p-2 font-Noto mt-2 resize-none h-[200px] bg-background text-secondary rounded-md border border-neutral-400"
                  />
                </div>
                <div className="flex-col mt-4 flex justify-start w-full items-start">
                  <h2 className="text-secondary text-lg sm:text-xl font-Roboto font-medium">
                    Skills
                  </h2>
                  <h3 className="text-neutral-400 text-xs sm:text-sm font-Roboto ">
                    Add some skills to your profile. Make sure to separate each
                    skill with a comma and a space. Minimum of three skills
                    required.
                  </h3>
                  <input
                    type="text"
                    placeholder="Skills"
                    value={updatedUserDetails.skills}
                    maxLength={75}
                    onChange={(e) =>
                      setUpdatedUserDetails({
                        ...updatedUserDetails,
                        skills: e.target.value,
                      })
                    }
                    className="w-full p-2 mt-2 bg-background text-secondary rounded-md border border-neutral-400"
                  />
                </div>

                <div className="flex flex-row items-center justify-center mt-10 space-x-4">
                  <button
                    onClick={() => {
                      handleProfileUpdate();
                    }}
                    className="bg-primary hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg w-20 py-1 rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditProfile(false)}
                    className="bg-red-600 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
