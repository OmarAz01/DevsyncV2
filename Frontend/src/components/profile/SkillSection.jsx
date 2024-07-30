import React, { useState } from "react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const SkillSection = ({ userDetails, createAlert }) => {
  const [skills, setSkills] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
  ]);
  const [baseskills, setBaseSkills] = useState([
    "JavaScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
  ]);
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
      createAlert("Skills updated successfully", "success");
      setBaseSkills(skills);
    }
  };
  return (
    <>
      <div className="flex flex-row items-center justify-center text-center mb-2">
        <h2 className="text-secondary text-2xl sm:text-3xl font-Roboto font-bold">
          Skills
        </h2>
        <div
          className="w-fit h-fit"
          onClick={(e) => {
            setEdit(!edit);
          }}
        >
          <ModeEditIcon className="text-primary hover:brightness-110 ml-4 hover:scale-110 hover:cursor-pointer" />
        </div>
      </div>
      {edit && (
        <div className="flex flex-col w-[300px] sm:w-[500px] md:flex-row items-center justify-center text-center">
          <input
            type="text"
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            maxLength={20}
            className="border w-full border-black rounded-md p-2 m-2"
          />
          <div className="flex sm:flex-row sm:mb-1 mb-4">
            <button
              onClick={(e) => addSkill()}
              className="bg-primary text-background hover:scale-110 text-lg hover:brightness-110 font-Roboto font-bold py-1 px-4 m-2 rounded-md"
            >
              Add
            </button>
            <button
              onClick={(e) => saveNewSkills()}
              className="bg-primary text-background hover:scale-110 text-lg hover:brightness-110 font-Roboto font-bold py-1 px-4 m-2 rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-wrap justify-center items-center">
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
