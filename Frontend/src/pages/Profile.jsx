import React, { useEffect, useState } from "react";
import SkillSection from "../components/profile/SkillSection";
import BioSection from "../components/profile/BioSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Profile = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [userDetails, setUserDetails] = useState({});

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
        .get(`${BASE_URL}/api/user/${username}`)
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
      <div className="flex lg:flex-row flex-col p-4 w-full justify-center items-center lf:items-start max-w-screen-2xl">
        <div className="flex flex-col lg:left-0 w-fit h-fit pb-4 pt-12 lg:px-6 items-center max-w-md">
          <BioSection userDetails={userDetails} createAlert={createAlert} />
        </div>
        <div className="sm:w-3/5 flex flex-col items-center justify-center">
          <div className="flex flex-col h-fit py-12 items-center w-full">
            <SkillSection userDetails={userDetails} createAlert={createAlert} />
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
