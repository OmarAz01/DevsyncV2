import React from "react";
import { useState, useEffect } from "react";

const BioSection = ({ userDetails }) => {
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

        <div className="flex flex-col mt-8 p-2 border rounded-3xl bg-neutral-900 border-primary">
          <h3 className="text-secondary text-xl sm:text-2xl font-Noto font-bold p-2">
            Bio -
          </h3>
          <p className="text-secondary text-md sm:text-lg font-Noto p-2">
            Hi, I am a full-stack developer with experience in JavaScript,
            React, Node.js, Express, and MongoDB. I am passionate about building
            scalable applications and collaborating with other developers. On my
            profile, you can find my projects and connect with me.
          </p>
        </div>
      </div>
    </>
  );
};

export default BioSection;
