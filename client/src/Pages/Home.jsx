import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { FaMusic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MoodDetection from "../components/MoodDetection";
import SpotifyLogin from "./SpotifyLogin";
import axios from "axios";

const Home = () => {
  const { isLoggedIn, backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  // Check if the Spotify access token has expired.
  const isTokenExpired = () => {
    const expiry = localStorage.getItem("spotifyTokenExpiry");
    if (expiry && Date.now() > parseInt(expiry, 10)) {
      return true;
    }
    return false;
  };

  // Effect to clear token if it has expired.
  useEffect(() => {
    if (token && isTokenExpired()) {
      console.log("Token expired. Removing token.");
      setToken("");
      localStorage.removeItem("spotifyToken");
      localStorage.removeItem("spotifyTokenExpiry");
    }
  }, [token, setToken]);

  // Log play if token exists and is valid.
  useEffect(() => {
    const logPlay = async () => {
      try {
        await axios.get(`${backendUrl}/api/log-play`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error logging play:", error);
      }
    };

    if (token && !isTokenExpired()) {
      logPlay();
    }
  }, [token, backendUrl]);

  // Extract token from URL hash or localStorage.
  useEffect(() => {
    const extractToken = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", "?"));
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in"); // expires_in in seconds

      if (accessToken) {
        setToken(accessToken);
        localStorage.setItem("spotifyToken", accessToken);
        if (expiresIn) {
          // Store token expiry timestamp in local storage
          localStorage.setItem(
            "spotifyTokenExpiry",
            Date.now() + parseInt(expiresIn, 10) * 1000
          );
        }
        // Optionally, clear the URL hash.
        window.history.replaceState(null, "", window.location.pathname);
        console.log("Access Token:", accessToken);
      } else {
        // If no token in URL, try to restore from localStorage if valid.
        const storedToken = localStorage.getItem("spotifyToken");
        const expiry = localStorage.getItem("spotifyTokenExpiry");
        if (storedToken && expiry && Date.now() < parseInt(expiry, 10)) {
          setToken(storedToken);
        } else {
          console.log("No valid access token found.");
        }
      }
    };

    extractToken();
  }, [setToken]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080]">
      <Navbar />
      {token && !isTokenExpired() ? (
        <div className="flex flex-col items-center px-4 py-6">
          <MoodDetection />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-screen">
          <section className="px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-4 w-11/12 sm:w-2/3 text-center">
            <h2 className="text-2xl sm:text-3xl flex flex-col sm:flex-row gap-3 items-center justify-center text-white font-bold mb-4">
              <FaMusic />
              <span>Start Your Journey with Melodify</span>
              <FaMusic />
            </h2>
            <p className="text-base sm:text-lg text-black font-semibold mb-6">
              Melodify is where your emotions meet the perfect melody. Whether
              you're joyful, reflective, or in between, we curate music that
              understands you. Let your mood guide the tunes and discover a
              companion for every moment. Start your journey with Melodify today!
            </p>
            <SpotifyLogin />
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
