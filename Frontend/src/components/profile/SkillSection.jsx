import React, { useEffect, useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { useCookies } from "react-cookie";
import axios from "axios";

const SkillSection = ({ userDetails, createAlert, currUserProfile }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const token = cookie.token;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (userDetails.skills) {
      setSkills(userDetails.skills.split(", "));
      setBaseSkills(userDetails.skills.split(", "));
    }
  }, [userDetails]);

  const [skills, setSkills] = useState([]);
  const [baseskills, setBaseSkills] = useState([]);
  const [edit, setEdit] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  // Save new skills to profile by comparing base skills with current skills to check if there are any changes
  const saveNewSkills = () => {
    setEdit(false);
    if (baseskills !== skills) {
      axios
        .put(
          `${BASE_URL}/api/user/profile/skills/${userDetails.username}`,
          {
            newSkills: skills.join(", "),
          },
          { headers: headers }
        )
        .then(() => {
          createAlert("Skills updated successfully", "success");
          setBaseSkills(skills);
        })
        .catch((error) => {
          console.log(error);
          createAlert("An error occurred", "error");
          setSkills(baseskills);
        });
    }
  };
  return (
    <>
      <div className="flex flex-row items-center justify-center relative text-center mb-2">
        <h2 className="text-secondary text-xl px-8 sm:text-2xl font-Roboto font-medium">
          Skills
        </h2>
        {currUserProfile && (
          <div
            className="w-fit h-fit absolute right-0"
            onClick={(e) => {
              setEdit(!edit);
            }}
          >
            <ModeEditIcon className="text-primary pb-1 sm:pb-0 hover:brightness-110 ml-4 hover:scale-110 hover:cursor-pointer" />
          </div>
        )}
      </div>
      {edit && (
        <div className="flex flex-col w-[300px] sm:w-[500px] items-center justify-center text-center">
          <div className="w-full flex-col md:flex-row flex items-center justify-center">
            <input
              type="text"
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              maxLength={20}
              className="border w-full text-secondary bg-neutral-800 border-black rounded-md p-2"
            />
            <div className="flex sm:flex-row my-2 lg:my-0">
              <button
                onClick={(e) => addSkill()}
                className="bg-primary text-background hover:scale-110 text-lg hover:brightness-110 font-Roboto font-bold w-20 py-1 m-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={(e) => saveNewSkills()}
                className="bg-primary text-background hover:scale-110 text-lg hover:brightness-110 font-Roboto font-bold w-20 py-1 m-2 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center items-center pb-8 pt-2">
        {skills &&
          skills.map((skill, index) =>
            edit ? (
              <div
                onClick={(e) => {
                  setSkills(skills.filter((item) => item !== skill));
                }}
                key={index}
                className="flex justify-center hover:bg-red-600 hover:cursor-pointer hover:border-black items-center bg-neutral-900 text-secondary font-Noto text-md sm:text-lg px-4 py-2 m-2 rounded-3xl border border-primary"
              >
                {skill}
              </div>
            ) : (
              <div
                key={index}
                className="flex justify-center items-center bg-neutral-900 text-secondary font-Noto text-md sm:text-lg px-4 py-2 m-2 rounded-3xl border border-primary"
              >
                {skill}
              </div>
            )
          )}
      </div>
    </>
  );
};

export default SkillSection;
