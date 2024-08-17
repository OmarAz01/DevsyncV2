import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow, parseISO } from "date-fns";

const GetAllPosts = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastPost, setLastPost] = useState(false);

  useEffect(() => {
    getNewPosts();
  }, []);

  const getNewPosts = async () => {
    await axios
      .get(BASE_URL + "/api/posts")
      .then((response) => {
        formatPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setLastPost(true);
        }
        console.log(error);
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
    setPosts(formattedPosts);
  };

  return (
    <div className="flex flex-col w-full mt-8 max-w-[700px]">
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-2xl border-black mb-4 bg-neutral-800 w-full max-w-[700px] px-2 pt-3 pb-1 md:pt-4 md:px-4"
          >
            <div className="flex justify-between my-1 md:mt-1 md:mb-1 px-1">
              <h1 className="text-xl text-secondary font-Roboto font-bold break-words w-full">
                {post.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center my-1 md:mt-1 md:mb-1">
              {post.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-center my-1 items-center bg-neutral-900 text-secondary font-Noto px-3 py-0.5 mr-2 rounded-3xl border border-primary"
                >
                  {skill}
                </div>
              ))}
            </div>
            <div className="mt-2 mb-4 font-Noto text-sm text-secondary break-words">
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
            <div className="text-right text-sm text-neutral-500 w-full italic font-Roboto">
              Posted by{" "}
              <a
                href={`${window.location.origin}/profile/${post.username}`}
                className="hover:underline hover:text-primary"
              >
                {post.username}
              </a>{" "}
              {post.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetAllPosts;
