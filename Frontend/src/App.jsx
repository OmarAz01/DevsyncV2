import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { SignUp, SignIn, Feed, Profile } from "./pages/index";
import { useCookies } from "react-cookie";
import axios from "axios";
import "./index.css";

const App = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (cookie.token) {
      const token = cookie.token;
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .post(`${BASE_URL}/api/auth/validate`, null, {
          headers: headers,
        })
        .then((response) => {
          if (response.status === 200) {
            setCookie("token", response.data.jwt, { path: "/" });
            setCookie("user", response.data.id, { path: "/" });
            setLoggedIn(true);
            console.log("User is logged in");
          }
        })
        .catch((error) => {
          removeCookie("token");
          console.log("User is not logged in");
          if (error.response.status === 404 || error.response.status === 403) {
            setLoggedIn(false);
          } else {
            console.log(error);
          }
        });
    } else {
      setLoggedIn(false);
      console.log("User is not logged in");
    }
  }, []);

  const signOut = () => {
    removeCookie("token");
    removeCookie("user");
    removeCookie("username");
    window.location.href = "/signin";
  };

  return (
    <BrowserRouter>
      <header className="flex flex-row justify-end md:text-lg">
        <Link to="/">
          <h4 className="p-4 absolute left-0 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-xl sm:text-2xl">
            {" "}
            devsync{" "}
          </h4>
        </Link>
        {loggedIn ? (
          <>
            <Link to={`/profile/${cookie.username}`}>
              <h4 className="p-4 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-xl sm:text-2xl">
                {" "}
                Profile
              </h4>
            </Link>
            <h4
              className="p-4 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-xl sm:text-2xl"
              onClick={() => signOut()}
            >
              {" "}
              Sign Out
            </h4>
          </>
        ) : (
          <>
            <Link to="/signin">
              <h4 className="p-4 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-xl sm:text-2xl">
                {" "}
                Sign In
              </h4>
            </Link>
          </>
        )}
      </header>
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </main>
      <footer>
        <div className="p-4 mt-4 relative inset-x-0 bottom-0 h-fit border-t border-zinc-700 items-center justify-center text-center">
          <div className="w-full items-center flex flex-col">
            <p className="text-gray-400 pb-2">Created by Omar Alzoubi</p>
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
};

export default App;
