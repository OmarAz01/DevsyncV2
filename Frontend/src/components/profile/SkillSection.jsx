import React, { useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useCookies } from "react-cookie";
import axios from "axios";

const SkillSection = ({ userDetails, createAlert, currUserProfile }) => {
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    if (userDetails.skills) {
      setSkills(userDetails.skills.split(", "));
    }
  }, [userDetails]);

  return (
    <>
      <div className="flex flex-row items-center justify-center relative text-center mb-2">
        <h2 className="text-secondary text-xl px-8 sm:text-2xl border-b border-neutral-700 pb-1 font-Roboto font-medium">
          Skills
        </h2>
      </div>
      <div className="flex flex-wrap justify-center items-center pb-8 pt-2">
        {skills &&
          skills.map((skill, index) => (
            <div
              key={index}
              className="flex justify-center items-center bg-neutral-900 text-secondary font-Noto text-sm sm:text-base px-4 py-2 m-2 rounded-3xl border border-primary"
            >
              {skill}
            </div>
          ))}
      </div>
    </>
  );
};

export default SkillSection;
