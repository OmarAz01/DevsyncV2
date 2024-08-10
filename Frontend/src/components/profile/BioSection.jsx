import React from "react";
import { useState, useEffect } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useCookies } from "react-cookie";
import axios from "axios";
import { SettingsBrightnessOutlined } from "@mui/icons-material";

const BioSection = ({
  userDetails,
  createAlert,
  currUserProfile,
  handleUserDetailsChange,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookie.token;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const [bio, setBio] = useState("");
  const [newBio, setNewBio] = useState("");
  const [edit, setEdit] = useState(false);
  const [editUserLink, setEditUserLink] = useState(false);
  const [newUserLink, setNewUserLink] = useState(userDetails.userLink);

  useEffect(() => {
    if (userDetails.bio) {
      setBio(userDetails.bio);
      setNewBio(userDetails.bio);
    }
  }, [userDetails]);

  const saveNewUserLink = () => {
    if (!newUserLink) {
      createAlert("Link cannot be empty", "error");
      setNewUserLink(userDetails.userLink);
      return;
    }
    const regex =
      /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    if (regex.test(newUserLink)) {
      setEditUserLink(false);
      if (userDetails.userLink !== newUserLink) {
        axios
          .put(
            `${BASE_URL}/api/user/profile/userlink/${userDetails.username}`,
            {
              newUserLink: newUserLink,
            },
            { headers: headers }
          )
          .then((response) => {
            createAlert("Link updated successfully", "success");
            setNewUserLink(newUserLink);
            handleUserDetailsChange(response.data);
          })
          .catch((error) => {
            console.log(error);
            createAlert("An error occurred", "error");
            setNewUserLink(userDetails.userLink);
          });
      }
    } else {
      createAlert("Invalid URL", "error");
      setNewUserLink(userDetails.userLink);
    }
  };

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
        <div>
          {editUserLink && (
            <>
              <input
                type="text"
                className="bg-neutral-800 border-black rounded-md text-secondary p-2 m-2 w-[300px]"
                defaultValue={userDetails.userLink}
                value={newUserLink}
                onChange={(e) => setNewUserLink(e.target.value)}
                maxLength={150}
              />
              <button
                onClick={(e) => saveNewUserLink()}
                className="bg-primary text-background hover:scale-110 text-lg hover:brightness-110 font-Roboto font-bold w-20 py-1 m-2 rounded-md"
              >
                Save
              </button>
              <button
                onClick={(e) => setEditUserLink(false)}
                className="bg-primary text-background hover:scale-110 text-lg hover:brightness-110 font-Roboto font-bold w-20 py-1 m-2 rounded-md"
              >
                Cancel
              </button>
            </>
          )}
          {userDetails.userLink && !editUserLink && currUserProfile && (
            <div className="flex flex-row items-center justify-center relative text-center">
              <a
                href={userDetails.userLink}
                target="_blank"
                rel="noreferrer"
                className="text-primary w-fit font-Roboto px-8 font-bold text-lg hover:underline"
              >
                {userDetails.username}'s personal website
              </a>
              <div
                className="w-fit h-fit absolute right-0"
                onClick={(e) => {
                  setEdit(setEditUserLink(true));
                }}
              >
                <ModeEditIcon className="text-primary pb-1 hover:brightness-110 hover:scale-110 hover:cursor-pointer" />
              </div>
            </div>
          )}
          {currUserProfile && !userDetails.userLink && !editUserLink && (
            <button
              onClick={(e) => {
                setEditUserLink(true);
              }}
              className="text-primary font-Roboto font-bold text-lg hover:scale-105 hover:underline"
            >
              Add a Link to your personal website
            </button>
          )}
          {!currUserProfile && userDetails.userLink && !editUserLink && (
            <a
              href={userDetails.userLink}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-Roboto font-bold text-lg hover:underline"
            >
              {userDetails.username}'s personal website
            </a>
          )}
        </div>
        <div className="flex flex-row space-x-4 items-center justify-center mt-2">
          <button className="bg-primary font-Roboto w-fit font-bold hover:brightness-110 hover:scale-105 text-lg py-1 px-8 rounded-md">
            Sync
          </button>
          <button className="bg-red-600 font-Roboto w-fit font-bold hover:brightness-110 hover:scale-105 text-lg py-1 px-8 rounded-md">
            Report
          </button>
        </div>

        <div className="flex flex-col min-w-[300px] mt-8 p-2 border rounded-3xl items-center bg-neutral-900 border-primary">
          <div className="flex flex-row items-center justify-center relative">
            <h3 className="text-secondary text-xl sm:text-2xl px-8 font-Roboto font-medium py-2">
              Bio
            </h3>
            {currUserProfile && (
              <div
                className="w-fit h-fit absolute right-0"
                onClick={(e) => {
                  setEdit(!edit);
                }}
              >
                <ModeEditIcon className="text-primary pb-1 sm:pb-0 hover:brightness-110 ml-3 hover:scale-110 hover:cursor-pointer" />
              </div>
            )}
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
