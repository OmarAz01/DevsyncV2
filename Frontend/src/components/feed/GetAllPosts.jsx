import React, { useState, useEffect } from "react";
import axios from "axios";
import DisplayPosts from "../posts/DisplayPosts";

const GetAllPosts = ({ createAlert, turnOnSyncModal }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [rawPosts, setRawPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPost, setLastPost] = useState(false);
  const [lastPostDate, setLastPostDate] = useState("");

  useEffect(() => {
    getNewPosts();
  }, []);

  const getNewPosts = () => {
    setLoading(true);
    let url = BASE_URL + "/api/posts";
    if (lastPostDate) {
      url += "?lastPostDate=" + lastPostDate;
    }
    axios
      .get(url)
      .then((response) => {
        if (response.data.length < 10) {
          setLastPost(true);
        }
        setRawPosts((prevPosts) => [...prevPosts, ...response.data]);
        setLoading(false);
        setLastPostDate(response.data[response.data.length - 1]?.createdAt);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setLastPost(true);
          createAlert("No more posts", "error");
          setLoading(false);
          return;
        }
        createAlert("Failed to get posts", "error");
        console.log(error);
        setLoading(false);
      });
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (
      !loading &&
      !lastPost &&
      scrollTop + clientHeight >= scrollHeight - 200
    ) {
      getNewPosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className={`flex flex-col w-full mt-8 max-w-[700px]`}>
      <DisplayPosts rawPosts={rawPosts} turnOnSyncModal={turnOnSyncModal} />
      {loading && (
        <p className="text-center font-Roboto text-secondary font-bold italic">
          Loading...
        </p>
      )}
      {lastPost && (
        <p className="text-center font-Roboto text-secondary font-bold italic">
          No more posts
        </p>
      )}
    </div>
  );
};

export default GetAllPosts;
