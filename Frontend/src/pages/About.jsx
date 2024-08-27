import React from "react";

const About = () => {
  return (
    <div className="flex flex-col justify-center text-center items-center mb-12 mt-8">
      <h1 className="sm:text-4xl text-2xl font-Roboto pb-1 text-secondary border-b border-neutral-500 px-4 font-bold">
        About devsync
      </h1>
      <div className="flex flex-col w-full max-w-4xl mt-2">
        <h2 className="sm:text-lg  font-Roboto font-bold text-primary px-4">
          Welcome to devsync a platform for developers to connect and work on
          different projects together.
        </h2>
        <h3 className="sm:text-lg font-Roboto font-bold text-primary px-4 pt-2">
          Goal
        </h3>
        <p className="text-gray-400 font-Roboto pr-4 pl-8 pt-1">
          Our goal is to provide a platform for developers to connect and work
          on different projects together.
        </p>
      </div>
    </div>
  );
};

export default About;
