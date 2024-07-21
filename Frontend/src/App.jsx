import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { SignUp, SignIn } from "./pages/index";
import "./index.css";

const App = () => {
  return (
    <BrowserRouter>
      <header className="flex flex-row justify-end md:text-lg">
        <Link to="/">
          <h4 className="p-4 absolute left-0 text-primary hover:font-bold font-Roboto text-2xl">
            {" "}
            devsync{" "}
          </h4>
        </Link>
      </header>
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
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
