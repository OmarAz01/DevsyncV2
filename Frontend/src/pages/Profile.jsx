import axios from "axios";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [userDetails, setUserDetails] = useState({});

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
    <div className="flex justify-center items-center mt-12">
      <div className="flex lg:flex-row flex-col p-4 w-full justify-center items-center lf:items-start max-w-screen-2xl">
        <div className="flex flex-col lg:left-0 w-fit lg:border-r border-primary h-fit py-12 px-6 items-center max-w-md">
          <img
            src={userDetails.imageUri}
            alt="avatar"
            className="sm:w-48 sm:h-48 w-36 h-36 rounded-3xl border-black"
          />
          <div className="p-2 flex flex-col items-center text-center">
            <h1 className="sm:text-3xl mt-2 text-2xl text-secondary font-Roboto font-bold">
              {userDetails.username}
            </h1>
            <button className="bg-primary font-Roboto w-fit font-bold hover:brightness-110 text-lg py-1 px-8 rounded-md mt-2">
              Sync
            </button>
            <div className="flex flex-col mt-4 p-2 brightness-105">
              <h3 className="text-secondary text-xl sm:text-2xl font-Noto font-bold p-2">
                Bio -
              </h3>
              <p className="text-secondary text-md sm:text-lg font-Noto p-2">
                {userDetails.bio}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:border-b border-primary h-fit py-12 items-center w-full lg:w-1/2 mx-4">
          <h2 className="text-3xl font-Roboto text-primary pb-4">Skills</h2>
          <div className="flex flex-row space-x-4">
            <h3 className="text-secondary rounded-md px-4 bg-neutral-800 text-lg font-Noto font-bold p-2">
              React
            </h3>
            <h3 className="text-secondary rounded-md px-4 bg-neutral-800 text-lg font-Noto font-bold p-2">
              React
            </h3>
            <h3 className="text-secondary rounded-md px-4 bg-neutral-800 text-lg font-Noto font-bold p-2">
              React
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
