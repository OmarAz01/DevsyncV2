import React, { useEffect, useState, useCallback } from "react";
import SkillSection from "../components/profile/SkillSection";
import BioSection from "../components/profile/BioSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Helmet } from "react-helmet";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";
import ReceivedSyncs from "../components/feed/ReceivedSyncs";
import DisplayPosts from "../components/posts/DisplayPosts";
import { set } from "date-fns";

const Profile = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [userDetails, setUserDetails] = useState({});
  const [currentView, setCurrentView] = useState("Posts");
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [currUserProfile, setCurrUserProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState({});
  const [clickCount, setClickCount] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Date.now());
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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
  }, [location.pathname]);

  const handleProfileUpdate = () => {
    if (!updatedUserDetails.bio) {
      createAlert("Bio cannot be empty", "error");
      return;
    }
    if (!updatedUserDetails.skills) {
      createAlert("Skills cannot be empty", "error");
      return;
    }
    if (updatedUserDetails === userDetails) {
      setEditProfile(false);
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

  const verifyProfileDetails = (userDetails) => {
    const userLinkRegex =
      /^https:\/\/([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    // Only check for valid user link if user has entered one
    if (userDetails.userLink && !userLinkRegex.test(userDetails.userLink)) {
      createAlert("Invalid user link", "error");
      return false;
    }
    const skills = userDetails.skills.split(", ");
    if (skills.length < 3) {
      createAlert("Skills must be atleast 3 and separated by commas", "error");
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

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    const password = passwordForm.oldPassword;
    const newPassword = passwordForm.newPassword;
    const confirmPassword = passwordForm.confirmPassword;
    if (!password || !newPassword || !confirmPassword) {
      createAlert("All fields are required", "error");
      return;
    }
    if (!passwordRegex.test(password)) {
      createAlert(
        "Password must be atleast 8 characters long and contain one uppercase letter, one lowercase letter, one number and one special character",
        "error"
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      createAlert("Passwords do not match", "error");
      return;
    }
    if (password === newPassword) {
      createAlert("New password cannot be the same as old password", "error");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      createAlert(
        "New password must be atleast 8 characters long and contain one uppercase letter, one lowercase letter, one number and one special character",
        "error"
      );
      return;
    }
    const token = cookie.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .put(
        `${BASE_URL}/api/auth/password`,
        {
          oldPassword: password,
          newPassword: newPassword,
        },
        { headers: headers }
      )
      .then((response) => {
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        createAlert("Password changed successfully", "success");
      })
      .catch((error) => {
        createAlert("Password change failed", "error");
      });
  };

  const handleDeleteAccount = () => {
    const token = cookie.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .delete(`${BASE_URL}/api/user`, { headers: headers })
      .then((response) => {
        createAlert("Account deleted successfully", "success");
        removeCookie("token");
        removeCookie("user");
        removeCookie("username");
        window.location.href = "/signin";
      })
      .catch((error) => {
        createAlert("Account deletion failed", "error");
      });
  };

  return (
    <>
      <Helmet>
        <title>{location.pathname.split("/")[2]} | devsync</title>
      </Helmet>
      <div
        className={`flex sm:mt-12 justify-center items-center ${
          editProfile ? "overflow-hidden pointer-events-none" : ""
        }`}
      >
        <div className="flex lg:flex-row flex-col p-4 w-full max-w-screen-2xl justify-center lg:items-start items-center">
          <div className="flex flex-col lg:border-r border-neutral-500 lg:left-0 w-full h-fit pb-4 pt-2 font-Roboto lg:px-6 items-center max-w-md">
            <BioSection
              userDetails={userDetails}
              createAlert={createAlert}
              currUserProfile={currUserProfile}
              handleUserDetailsChange={handleUserDetailsChange}
              changeEditProfile={changeEditProfile}
            />
            <SkillSection
              userDetails={userDetails}
              createAlert={createAlert}
              currUserProfile={currUserProfile}
              handleUserDetailsChange={handleUserDetailsChange}
            />
          </div>
          <div className="sm:max-w-[650px] w-full flex flex-col lg:ml-4 xl:ml-16">
            {currUserProfile ? (
              <div className="flex flex-row w-full justify-center text-center font-Roboto items-center mt-4 space-x-2">
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
              <div className="w-full">
                <h4 className="text-center mt-6 text-secondary text-xl sm:text-2xl font-Roboto font-medium">
                  Posts
                </h4>
                {userDetails.posts && userDetails.posts.length > 0 ? (
                  <div className="flex w-full items-center justify-center">
                    <DisplayPosts
                      rawPosts={userDetails.posts}
                      turnOnSyncModal={null}
                    />
                  </div>
                ) : (
                  <p className="text-secondary w-full text-center italic text-lg font-Roboto mt-4">
                    No posts yet
                  </p>
                )}
              </div>
            )}
            {currUserProfile && currentView === "Posts" && (
              <div className="flex flex-col w-full items-center justify-center mt-4">
                {userDetails.posts && userDetails.posts.length > 0 ? (
                  <div className="w-full flex items-center justify-center">
                    <DisplayPosts
                      rawPosts={userDetails.posts}
                      turnOnSyncModal={null}
                    />
                  </div>
                ) : (
                  <p className="text-secondary italic w-full text-center text-lg font-Roboto mt-4">
                    No posts yet
                  </p>
                )}
              </div>
            )}
            {currUserProfile && currentView === "Syncs" && (
              <div className="flex flex-col items-center justify-center mt-4">
                <ReceivedSyncs createAlert={createAlert} />
              </div>
            )}
            {currUserProfile && currentView === "Settings" && (
              <div className="flex flex-col text-start items-start justify-center mt-6">
                <h4 className="text-secondary text-lg sm:text-xl font-Roboto font-medium">
                  Change Password
                </h4>
                <form
                  onSubmit={(e) => handlePasswordChange(e)}
                  className="flex flex-col w-full"
                >
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => {
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      });
                    }}
                    className="w-full p-2 mt-2 bg-background text-secondary rounded-md border border-neutral-400"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      });
                    }}
                    className="w-full p-2 mt-2 bg-background text-secondary rounded-md border border-neutral-400"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => {
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      });
                    }}
                    className="w-full p-2 mt-2 bg-background text-secondary rounded-md border border-neutral-400"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg w-20 py-0.5 rounded-md mt-3"
                  >
                    Save
                  </button>
                </form>
                <h4 className="text-secondary text-lg sm:text-xl font-Roboto font-medium mt-6">
                  Delete Account
                </h4>
                <h4 className="text-neutral-400 text-sm sm:text-base font-Roboto">
                  This action cannot be undone. All your data will be lost.
                </h4>
                <button
                  onClick={(e) => setDeleteConfirmation(true)}
                  className="bg-red-600 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg w-20 py-0.5 rounded-md mt-3"
                >
                  Delete
                </button>
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
      {deleteConfirmation && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 pointer-events-none"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="w-4/5 sm:w-[600px] max-h-[90vh] overflow-y-auto bg-background border-2 border-primary shadow-xl shadow-black rounded-3xl">
              <div className="px-2 pt-2 sm:px-8 sm:pt-8">
                <div className="flex flex-col">
                  <h1 className="text-secondary text-center text-xl sm:text-2xl border-b pb-2 px-4 sm:mt-0 mt-2 border-neutral-700 font-Roboto font-bold">
                    Are you sure you want to delete your account?
                  </h1>
                  <div className="flex-col flex justify-start w-full p-2 md:p-4 items-start">
                    <div className="flex flex-row items-center justify-center my-4 space-x-4 w-full">
                      <button
                        onClick={() => handleDeleteAccount()}
                        className="bg-red-500 hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmation(false)}
                        className="bg-primary hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg py-1 w-20 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {editProfile && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 pointer-events-none"></div>
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="w-4/5 sm:w-[600px] max-h-[90vh] bg-background border-2 border-primary shadow-xl shadow-black rounded-3xl overflow-hidden">
              <div className="flex flex-col h-full">
                <h1 className="text-secondary text-center text-xl sm:text-2xl border-b pb-2 px-4 sm:mt-0 mt-2 border-neutral-700 font-Roboto font-bold">
                  Edit Profile
                </h1>
                <div className="flex flex-col overflow-y-auto p-2 sm:p-8">
                  <div className="flex-col mt-2 sm:mt-6 flex justify-start w-full items-start">
                    <h2 className="text-secondary text-lg sm:text-xl font-Roboto font-medium">
                      User Header Link
                    </h2>
                    <h3 className="text-neutral-400 text-xs sm:text-sm font-Roboto ">
                      This link will be displayed on your profile header. Use it
                      to show off a project, personal website, or your preferred
                      social media.
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
                      Add some skills to your profile. Make sure to separate
                      each skill with a comma and a space. Minimum of three
                      skills required.
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
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
