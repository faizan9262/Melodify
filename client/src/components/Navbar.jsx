import React, { useContext } from "react";
import logo from "../assets/logo.png";
import Button from "./Button";
import { AppContext } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { FaCircleInfo } from "react-icons/fa6";
import { AiFillHome } from "react-icons/ai";
import { FaMusic } from "react-icons/fa";
import { FaSpotify } from "react-icons/fa";
import { BiSolidPlaylist } from "react-icons/bi";

const Navbar = () => {
  const { isLoggedIn, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current location

  // Function to check if the current route matches the provided path
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full bg-[#7B3F00] z-10 py-1 shadow-2xl sticky top-0 flex items-center justify-between px-4 md:px-8">
      <img src={logo} alt="logo" className="w-12 h-12 cursor-pointer" />
      {isLoggedIn ? (
        <>
          <ul className="flex gap-4 md:gap-10 text-xl font-medium text-white">
            <li
              onClick={() => navigate('/')}
              className={`flex cursor-pointer rounded-lg items-center justify-center gap-1 w-10 md:w-28 ${isActive('/') ? 'border-2' : ''}`}
            >
              <AiFillHome className="p-1 w-7 h-7" />
              <p className="hidden md:block">Home</p>
            </li>
            <li
              onClick={() => navigate('/my-playlist')}
              className={`flex cursor-pointer rounded-lg items-center justify-center gap-1 w-10 md:w-28 ${isActive('/my-playlist') ? 'border-2' : ''}`}
            >
              <BiSolidPlaylist className="p-1 w-7 h-7" />
              <p className="hidden md:block">Playlists</p>
            </li>
            <li
              onClick={() => navigate('/my-spotify-playlists')}
              className={`flex cursor-pointer rounded-lg items-center justify-center gap-1 w-10 md:w-28 ${isActive('/my-spotify-playlists') ? 'border-2' : ''}`}
            >
              <FaSpotify className="p-1 w-7 h-7" />
              <p className="hidden md:block">Spotify</p>
            </li>
            <li
            onClick={() => navigate('/about')}
              className={`flex cursor-pointer rounded-lg items-center justify-center gap-1 w-10 md:w-28 ${isActive('/about') ? 'border-2' : ''}`}
            >
              <FaCircleInfo className="p-1 w-7 h-7" />
              <p className="hidden md:block">About</p>
            </li>
          </ul>
          <div className="flex gap-3 items-center">
            <span className="text-lg font-medium text-white hidden md:block">
              Hey, {userData?.username ? userData.username.charAt(0).toUpperCase() + userData.username.slice(1) : "User"}
            </span>
            <img
              src={userData.profile}
              alt="userProfile"
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              onClick={() => navigate("/profile")}
            />
          </div>
        </>
      ) : (
        <Button onClick={() => navigate("/register")} text="Sign Up" />
      )}
    </div>
  );
};

export default Navbar;
