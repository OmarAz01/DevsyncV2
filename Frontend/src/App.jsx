import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import {
  SignUp,
  SignIn,
  Feed,
  Profile,
  PrivacyPolicy,
  TOS,
  Home,
} from "./pages/index";
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
            const currentDate = new Date();
            const expirationDate = new Date(
              currentDate.getTime() + 3 * 24 * 60 * 60 * 1000
            );
            setCookie("token", response.data.jwt, {
              path: "/",
              expires: expirationDate,
            });
            setCookie("user", response.data.id, {
              path: "/",
              expires: expirationDate,
            });
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
    setLoggedIn(false);
    window.location.href = "/signin";
  };

  const getYear = () => {
    return new Date().getFullYear();
  };

  return (
    <BrowserRouter>
      <header className="flex flex-row justify-end md:text-lg">
        <Link to="/">
          <h4 className="p-4 absolute left-0 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-lg sm:text-xl">
            {" "}
            devsync{" "}
          </h4>
        </Link>
        <Link to="/feed">
          <h4 className="p-4 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-lg sm:text-xl">
            {" "}
            Feed
          </h4>
        </Link>
        {loggedIn ? (
          <>
            <Link to={`/profile/myprofile`}>
              <h4 className="p-4 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-lg sm:text-xl">
                {" "}
                Profile
              </h4>
            </Link>
            <h4
              className="p-4 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-lg sm:text-xl"
              onClick={() => signOut()}
            >
              {" "}
              Sign Out
            </h4>
          </>
        ) : (
          <>
            <Link to="/signin">
              <h4 className="p-4 text-primary hover:cursor-pointer hover:font-bold font-Roboto text-lg sm:text-xl">
                {" "}
                Sign In
              </h4>
            </Link>
          </>
        )}
      </header>
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/myprofile" element={<Profile />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/tos" element={<TOS />} />
        </Routes>
      </main>
      <footer className="sticky bottom-0 bg-background">
        <div className="p-4 mt-4 relative bottom-0 inset-x-0 h-fit border-t border-zinc-700 items-center justify-center text-center">
          <div className="w-full items-center flex flex-col">
            <p className="text-gray-400 py-1 text-sm font-Roboto">
              Copyright © {getYear()} devsync
            </p>
            <div className="flex flex-row justify-center items-center">
              <a href="/tos">
                <p className="text-gray-400 hover:underline hover:text-primary text-sm font-Roboto">
                  Terms of Use
                </p>
              </a>
              <p className="text-gray-400 text-sm font-Roboto px-2">|</p>
              <a href="/privacy-policy">
                <p className="text-gray-400 hover:underline hover:text-primary text-sm font-Roboto">
                  Privacy Policy
                </p>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
};

export default App;
