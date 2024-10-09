import React, { useState, useEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";

const DisplayPosts = ({ rawPosts, turnOnSyncModal }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    formatPosts(rawPosts);
  }, [rawPosts]);

  const formatPosts = (rawPosts) => {
    const formattedPosts = rawPosts.map((post) => {
      let shorterDescription = post.description;
      let showingAll = true;
      const formattedTime = post.createdAt + "Z";
      if (post.description.length > 200) {
        shorterDescription = post.description.substring(0, 300) + "...";
        showingAll = false;
      }
      if (typeof post.skills === "string") {
        if (post.skills === "") {
          post.skills = [];
        } else {
          post.skills = post.skills.split(",");
        }
      }
      return {
        ...post,
        createdAt: formatDistanceToNow(parseISO(formattedTime), {
          addSuffix: true,
        }),
        shorterDescription,
        showingAll,
      };
    });
    setPosts(formattedPosts);
  };

  const handleShowMore = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          post.showingAll = true;
        }
        return post;
      })
    );
  };

  return (
    <div className="w-full">
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
            {turnOnSyncModal && (
              <button
                onClick={() => turnOnSyncModal(post.username)}
                className="text-sm text-black font-Roboto font-bold bg-primary px-4 py-1 rounded-lg hover:scale-105 hover:brightness-110"
              >
                Sync
              </button>
            )}
          </div>
          <div className="text-xl text-secondary font-Roboto font-bold break-words mb-1">
            {post.title}
          </div>

          <div className="mb-3 font-Noto text-sm text-secondary break-words">
            {post.showingAll ? post.description : post.shorterDescription}
            {!post.showingAll && (
              <button
                onClick={() => handleShowMore(post.id)}
                className="text-primary font-Roboto font-semibold"
              >
                Show more
              </button>
            )}
          </div>
          {post.skills.length > 0 && (
            <div className="flex flex-wrap items-center">
              {post.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex justify-center text-xs items-center bg-neutral-900 text-secondary mb-1 font-Noto px-2 mr-2 rounded-xl border border-primary"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DisplayPosts;
