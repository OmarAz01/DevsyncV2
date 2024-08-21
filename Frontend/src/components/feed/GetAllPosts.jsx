import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow, parseISO, set } from "date-fns";

const GetAllPosts = ({ createAlert, turnOnSyncModal }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);
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
        formatPosts(response.data);
        setLoading(false);
        setLastPostDate(response.data[response.data.length - 1].createdAt);
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

  const formatPosts = (data) => {
    const formattedPosts = data.map((post) => {
      let shorterDescription = post.description;
      let showingAll = true;
      const formattedTime = post.createdAt + "Z";
      if (post.description.length > 200) {
        shorterDescription = post.description.substring(0, 300) + "...";
        showingAll = false;
      }
      return {
        ...post,
        skills: (post.skills = post.skills.split(",")),
        createdAt: formatDistanceToNow(parseISO(formattedTime), {
          addSuffix: true,
        }),
        shorterDescription,
        showingAll,
      };
    });
    setPosts((prevPosts) => [...prevPosts, ...formattedPosts]);
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
    <div className="flex flex-col w-full mt-8 max-w-[700px]">
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-b border-neutral-500 mb-4 w-full max-w-[700px] px-4 pt-2 pb-3"
          >
            <div className="flex justify-between items-center mb-1 pt-2">
              <div className="flex items-center">
                <a
                  href={`${window.location.origin}/profile/${post.username}`}
                  className="text-lg font-Roboto font-bold text-primary hover:underline"
                >
                  {post.username}
                </a>
                <span className="ml-2 text-sm text-neutral-500 italic">
                  {post.createdAt}
                </span>
              </div>
              <button
                onClick={(e) => turnOnSyncModal(post.username)}
                className="text-sm text-black font-Roboto font-bold bg-primary px-4 py-1 rounded-lg hover:scale-105 hover:brightness-110"
              >
                Sync
              </button>
            </div>
            <div className="text-xl text-secondary font-Roboto font-bold break-words mb-2">
              {post.title}
            </div>

            <div className="mb-4 font-Noto text-sm text-secondary break-words">
              {post.showingAll ? post.description : post.shorterDescription}
              {!post.showingAll && (
                <button
                  onClick={() => {
                    setPosts((prevPosts) =>
                      prevPosts.map((p) => {
                        if (p.id === post.id) {
                          p.showingAll = true;
                        }
                        return p;
                      })
                    );
                  }}
                  className="text-primary font-Roboto font-semibold"
                >
                  Show more
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center pb-1">
              {post.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-center items-center bg-neutral-900 text-secondary mb-1 font-Noto px-2 mr-2 rounded-xl border border-primary"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
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
