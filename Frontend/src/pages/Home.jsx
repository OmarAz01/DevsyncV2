import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex justify-center items-center flex-col w-full">
      <div className="min-h-screen bg-background text-secondary font-Roboto max-w-screen-2xl">
        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center text-center py-20">
          <h1 className="text-5xl font-bold text-primary px-1">
            Sync with Developers. Build Amazing Projects.
          </h1>
          <p className="font-Noto mt-4 text-xl max-w-xl px-3">
            Collaborate with developers from around the world. Share ideas,
            start projects, and build something extraordinary together.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              to="/signup"
              className="bg-primary text-background px-5 py-3 rounded-md font-bold hover:bg-opacity-70 transition"
            >
              Join Now
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <h2 className="text-4xl font-bold text-primary text-center mb-6">
            Why Use devsync?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="text-center p-6 hover:cursor-default">
              <h3 className="text-2xl font-bold mb-4">
                Share Ideas and Collaborate
              </h3>
              <p className="font-Noto font-[500]">
                devsync makes it easy to share ideas and collaborate on projects
                with other developers, no matter where they are.
              </p>
            </div>
            <div className="text-center p-6 hover:cursor-default">
              <h3 className="text-2xl font-bold mb-4">
                Find Like-Minded Developers
              </h3>
              <p className="font-Noto font-[500]">
                Sync with developers who share your interests and goals, making
                collaboration more effective and enjoyable.
              </p>
            </div>
            <div className="text-center p-6 hover:cursor-default">
              <h3 className="text-2xl font-bold mb-4 font-Roboto">
                Build Projects Faster
              </h3>
              <p className="font-Noto font-[500]">
                Finding the right developers to work with can be time-consuming.
                devsync makes it easy to connect with the right people and start
                building right away.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 text-center px-2">
          <h2 className="text-4xl font-bold text-primary mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-background w-12 h-12 font-bold flex items-center justify-center rounded-full mb-4">
                1
              </div>
              <h3 className="text-2xl font-bold mb-2">Sign Up</h3>
              <p className="font-Noto font-[500]">
                Create an account and customize your profile
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-background w-12 h-12 flex font-bold items-center justify-center rounded-full mb-4">
                2
              </div>
              <h3 className="text-2xl font-bold mb-2">Post Your Idea</h3>
              <p className="font-Noto font-[500]">
                Share your project ideas and the type of collaborator you're
                looking for
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-background w-12 h-12 flex font-bold items-center justify-center rounded-full mb-4">
                3
              </div>
              <h3 className="text-2xl font-bold mb-2">Sync with Developers</h3>
              <p className="font-Noto font-[500]">
                Sync with developers and start collaborating on your projects
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="flex mt-16 flex-col justify-center items-center py-16 px-3 bg-primary text-background">
          <h2 className="text-4xl font-bold text-center">Ready to Sync?</h2>
          <p className="mt-4 text-xl text-center max-w-2xl font-Noto">
            Whether you’re looking to start something new or join an ongoing
            project, devsync is the perfect place to connect with other
            developers.
          </p>
          <div className="mt-8">
            <Link
              href="/feed"
              to="/feed"
              className="bg-background text-primary px-6 py-3 rounded-md font-bold hover:bg-opacity-90 transition"
            >
              Discover Projects
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
