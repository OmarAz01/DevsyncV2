import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CreatePost = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie] = useCookies(["token"]);
  const textAreaRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        textAreaRef.current.scrollHeight + 2 + "px";
    }
  }, [description]);

  const handleCreatePost = (e) => {
    e.preventDefault();
  };

  return (
    <div className="border rounded-2xl border-black bg-neutral-800 w-full max-w-[700px] p-2">
      <div className="flex items-center justify-between mt-2 mb-4 px-1">
        <h1 className="sm:text-2xl text-xl font-semibold text-primary">
          Create Post
        </h1>
        <button
          className="text-primary scale-125 hover:cursor-pointer hover:scale-150"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </button>
      </div>

      {!isCollapsed && (
        <form onSubmit={handleCreatePost} className="flex flex-col">
          <input
            type="text"
            placeholder="*Title"
            maxLength={100}
            className="text-base border text-secondary font-Roboto rounded-md border-black bg-neutral-700 p-2"
          />
          <h4 className="text-xs lg:text-sm text-right w-full pr-1 italic font-Roboto text-neutral-500 mb-3">
            Max 100 characters
          </h4>
          <input
            type="text"
            placeholder="Skills (e.g., MySQL, React, Java)"
            className="text-sm border text-secondary rounded-md font-Noto border-black bg-neutral-700 p-2"
            onChange={(e) => setSkills(e.target.value)}
            value={skills}
          />
          <h4 className="text-xs lg:text-sm text-right w-full pr-1 italic font-Roboto text-neutral-500 mb-3">
            Max 5 skills
          </h4>
          <textarea
            className="border text-sm rounded-md text-secondary font-Noto border-black bg-neutral-700 p-2"
            placeholder="*A brief description of your project and the type of person you are looking for."
            ref={textAreaRef}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows={2}
          />
          <div className="w-full pr-1">
            <button
              className="bg-primary float-end text-black hover:scale-105 hover:brightness-110 ml-1 font-Roboto font-bold w-fit px-4 py-1 rounded-md my-3"
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
