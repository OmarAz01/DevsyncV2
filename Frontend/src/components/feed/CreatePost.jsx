import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const CreatePost = ({ createAlert }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie] = useCookies(["token"]);
  const textAreaRef = useRef(null);
  const [description, setDescription] = useState("");
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
    const profanityMatcher = new RegExpMatcher({
      ...englishDataset.build(),
      ...englishRecommendedTransformers,
    });
    const formValues = new FormData(e.target);
    const skillsArray = formValues
      .get("skills")
      .split(",")
      .map((skill) => skill.trim());
    if (profanityMatcher.hasMatch(formValues.get("title"))) {
      createAlert("Title contains profanity", "error");
      return;
    }
    if (profanityMatcher.hasMatch(formValues.get("description"))) {
      createAlert("Description contains profanity", "error");
      return;
    }
    if (skillsArray.length > 5) {
      createAlert("You can only add up to 5 skills", "error");
      return;
    }
    for (const skill of skillsArray) {
      if (profanityMatcher.hasMatch(skill)) {
        createAlert("Skills contain profanity", "error");
        return;
      }
    }
    if (
      formValues.get("title") === "" ||
      formValues.get("description") === ""
    ) {
      createAlert("Title and description are required", "error");
      return;
    }
    if (cookie.token === undefined || cookie.token === null) {
      createAlert("You must be logged in to create a post", "error");
      return;
    }
    const headers = {
      Authorization: `Bearer ${cookie.token}`,
    };
    axios
      .post(
        `${BASE_URL}/api/post`,
        {
          title: formValues.get("title"),
          description: formValues.get("description"),
          skills: formValues.get("skills"),
        },
        { headers: headers }
      )
      .then((response) => {
        if (response.status === 201) {
          createAlert("Post created successfully", "success");
          e.target.reset();
          setDescription("");
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
        createAlert("An error occurred while creating the post", "error");
      });
  };

  return (
    <div className="border rounded-2xl border-black bg-neutral-800 w-full max-w-[700px] p-2 md:p-4">
      <div className="flex items-center justify-between my-1 md:mt-1 md:mb-1 px-1">
        <h1 className="sm:text-2xl text-xl font-semibold text-primary">
          Create Post
        </h1>
        <button
          className="text-primary w-max pl-4 pr-2 text-right scale-125 hover:cursor-pointer hover:scale-150"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </button>
      </div>

      {!isCollapsed && (
        <form onSubmit={handleCreatePost} className="flex flex-col mt-6">
          <input
            type="text"
            name="title"
            placeholder="*Title"
            maxLength={100}
            className="text-base border text-secondary font-Roboto rounded-md border-black bg-neutral-700 p-2"
          />
          <h4 className="text-xs lg:text-sm text-right w-full pr-1 italic font-Roboto text-neutral-500 mb-3">
            Max 100 characters
          </h4>
          <input
            type="text"
            name="skills"
            maxLength={250}
            placeholder="Skills seperated by a comma (e.g., MySQL, React, Java)"
            className="text-sm border text-secondary rounded-md font-Noto border-black bg-neutral-700 p-2"
          />
          <h4 className="text-xs lg:text-sm text-right w-full pr-1 italic font-Roboto text-neutral-500 mb-3">
            Max 5 skills
          </h4>
          <textarea
            className="border text-sm rounded-md text-secondary font-Noto border-black bg-neutral-700 p-2"
            name="description"
            placeholder="*A brief description of your project and the type of collaborator you are looking for."
            ref={textAreaRef}
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            maxLength={6000}
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
