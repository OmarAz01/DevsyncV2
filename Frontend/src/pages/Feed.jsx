import React from "react";
import CreatePost from "../components/feed/CreatePost";
import GetAllPosts from "../components/feed/GetAllPosts";

const Feed = () => {
  return (
    <div className="flex sm:mt-12 justify-center items-center">
      <div className="flex flex-row max-w-screen-2xl w-full p-4">
        <div className="flex flex-col items-center justify-center p-2 sm:p-4 lg:border-r border-neutral-700 w-full lg:w-2/3">
          <CreatePost />
        </div>
        <div className="hidden lg:flex flex-col text-center items-center sticky top-0 w-1/3">
          <h1 className="text-4xl font-bold text-primary">Syncs</h1>
        </div>
      </div>
    </div>
  );
};

export default Feed;
