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
  changeEditProfile,
}) => {
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);

  return (
    <>
      <img
        src={userDetails.imageUri}
        alt="avatar"
        className="sm:w-48 sm:h-48 w-36 h-36 rounded-3xl border-black"
      />
      <div className="p-2 flex flex-col items-center text-center w-full">
        <div className="flex flex-row items-center mt-2 justify-center relative text-center w-full">
          <h1 className="sm:text-3xl text-2xl text-secondary font-Roboto px-4 font-bold break-words">
            {userDetails.username}
          </h1>
          {currUserProfile && (
            <button
              onClick={changeEditProfile}
              className="bg-primary hover:brightness-110 hover:scale-105 text-background font-Roboto font-bold text-lg px-1 rounded-md"
            >
              <ModeEditIcon />
            </button>
          )}
        </div>
        {userDetails.userLink && (
          <div className="flex flex-row items-center justify-center w-full mt-2">
            <a
              href={userDetails.userLink}
              target="_blank"
              rel="noreferrer"
              className="text-primary w-fit font-Roboto px-4 font-bold text-lg hover:underline break-words"
            >
              {userDetails.username}'s showcase website
            </a>
          </div>
        )}
        <div className="flex flex-row space-x-4 items-center justify-center mt-2 w-full">
          <button className="bg-primary font-Roboto w-fit font-bold hover:brightness-110 hover:scale-105 text-lg py-1 px-4 rounded-md">
            Sync
          </button>
          <button className="bg-red-600 font-Roboto w-fit font-bold hover:brightness-110 hover:scale-105 text-lg py-1 px-4 rounded-md">
            Report
          </button>
        </div>

        <div className="flex flex-col w-full mt-8 p-2 border rounded-3xl items-center bg-neutral-900 border-primary">
          <div className="flex flex-row items-center justify-center">
            <h3 className="text-secondary text-xl sm:text-2xl px-4 border-b border-neutral-700 font-Roboto font-medium pt-2 pb-1 mb-2 text-center break-words">
              Bio
            </h3>
          </div>
          <p className="text-secondary text-md sm:text-lg font-Noto px-4 pb-4 w-full text-center break-words">
            {userDetails.bio
              ? userDetails.bio
              : "This is devsync's bio. Nothing to see here."}
          </p>
        </div>
      </div>
    </>
  );
};

export default BioSection;
