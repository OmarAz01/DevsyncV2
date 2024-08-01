import React from "react";
import { useState, useEffect } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useCookies } from "react-cookie";
import axios from "axios";
import { SettingsBrightnessOutlined } from "@mui/icons-material";

const BioSection = ({ userDetails, createAlert }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookie.token;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const [bio, setBio] = useState("");
  const [newBio, setNewBio] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (userDetails.bio) {
      setBio(userDetails.bio);
      setNewBio(userDetails.bio);
    }
  }, [userDetails]);

  const saveNewBio = () => {
    setEdit(false);
    if (bio !== newBio) {
      axios
        .put(
          `${BASE_URL}/api/user/profile/bio/${userDetails.username}`,
          {
            newBio: newBio,
          },
          { headers: headers }
        )
        .then(() => {
          createAlert("Bio updated successfully", "success");
          setBio(newBio);
        })
        .catch((error) => {
          console.log(error);
          createAlert("An error occurred", "error");
          setNewBio(bio);
        });
    }
  };
  return (
    <>
      <img
        src={userDetails.imageUri}
        alt="avatar"
        className="sm:w-48 sm:h-48 w-36 h-36 rounded-3xl border-black"
      />
      <div className="p-2 flex flex-col items-center text-center">
        <h1 className="sm:text-3xl mt-2 text-2xl text-secondary font-Roboto font-bold">
          {userDetails.username}
        </h1>
        <h2 className="text-primary font-Roboto font-bold text-lg">
          www.myprofile.com
        </h2>
        <div className="flex flex-row space-x-4 items-center justify-center mt-2">
          <button className="bg-primary font-Roboto w-fit font-bold hover:brightness-110 hover:scale-105 text-lg py-1 px-8 rounded-md">
            Sync
          </button>
          <button className="bg-red-600 font-Roboto w-fit font-bold hover:brightness-110 hover:scale-105 text-lg py-1 px-8 rounded-md">
            Report
          </button>
        </div>

        <div className="flex flex-col min-w-[300px] mt-8 p-2 border rounded-3xl items-center  bg-neutral-900 border-primary">
          <div className="flex flex-row items-center justify-center">
            <h3 className="text-secondary text-xl sm:text-2xl font-Noto font-bold py-2">
              Bio
            </h3>
            <div
              className="w-fit h-fit"
              onClick={(e) => {
                setEdit(!edit);
              }}
            >
              <ModeEditIcon className="text-primary hover:brightness-110 ml-3 hover:scale-110 hover:cursor-pointer" />
            </div>
          </div>
          {edit ? (
            <>
              <textarea
                minLength={20}
                maxLength={250}
                type="text"
                onChange={(e) => setNewBio(e.target.value)}
                value={newBio}
                className="border text-wrap resize-none sm:w-[350px] w-[290px] h-[250px] sm:h-[300px] text-secondary font-Noto text-md sm:text-lg bg-neutral-800 border-black rounded-md p-2 m-2"
              />
              <button
                onClick={(e) => saveNewBio()}
                className="bg-primary text-background hover:scale-110 text-lg hover:brightness-110 font-Roboto font-bold w-20 py-1 m-2 rounded-md"
              >
                Save
              </button>
            </>
          ) : (
            <p className="text-secondary text-md sm:text-lg font-Noto p-2">
              {bio ? bio : "This is devsync's bio. Nothing to see here."}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default BioSection;
