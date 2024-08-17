import React from "react";
import CreatePost from "../components/feed/CreatePost";
import GetAllPosts from "../components/feed/GetAllPosts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feed = () => {
  const createAlert = (title, variant) => {
    if (variant === "success") {
      return toast.success(title);
    } else {
      return toast.error(title);
    }
  };

  return (
    <div className="flex sm:mt-12 justify-center items-center">
      <div className="flex flex-row max-w-screen-2xl w-full p-4">
        <div className="flex flex-col items-center justify-center p-2 sm:p-4 lg:border-r border-primary w-full lg:w-2/3">
          <CreatePost createAlert={createAlert} />
          <GetAllPosts createAlert={createAlert} />
        </div>
        <div className="hidden lg:flex flex-col text-center items-center sticky top-0 w-1/3">
          <h1 className="text-4xl font-bold text-primary">Syncs</h1>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Feed;
