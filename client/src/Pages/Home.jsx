import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import { FaMusic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import MoodDetection from "../components/MoodDetection";
import SpotifyLogin from "./SpotifyLogin";
import axios from "axios";
import { toast } from "sonner";

const Home = () => {
  const { isLoggedIn, backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  // ✅ Function to check if the token is expired
  const isTokenExpired = () => {
    const expiry = localStorage.getItem("spotifyTokenExpiry");
    return expiry && Date.now() > parseInt(expiry, 10);
  };

  // ✅ Function to extract and store the Spotify token
  const extractToken = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Extract from hash
    const accessToken = hashParams.get("access_token");
    const expiresIn = hashParams.get("expires_in");

    if (accessToken) {
      setToken(accessToken);
      localStorage.setItem("spotifyToken", accessToken);
      if (expiresIn) {
        localStorage.setItem(
          "spotifyTokenExpiry",
          Date.now() + parseInt(expiresIn, 10) * 1000
        );
      }
      window.history.replaceState(null, "", window.location.pathname); // Clean URL
      // console.log("Extracted Access Token:", accessToken);
    } else {
      const storedToken = localStorage.getItem("spotifyToken");
      if (storedToken && !isTokenExpired()) {
        setToken(storedToken);
      } else {
        toast.error("No valid access token found.");
      }
    }
  };

  // ✅ Clear token if expired
  useEffect(() => {
    if (token && isTokenExpired()) {
      // console.log("Token expired. Removing token.");
      setToken("");
      localStorage.removeItem("spotifyToken");
      localStorage.removeItem("spotifyTokenExpiry");
    }
  }, [token, setToken]);

  // ✅ Extract token from URL on mount
  useEffect(() => {
    extractToken();
  }, []);

  // ✅ Log play if token exists
  useEffect(() => {
    const logPlay = async () => {
      try {
        await axios.get(`${backendUrl}/api/log-play`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        toast.error("Error logging play:", error);
      }
    };

    if (token && !isTokenExpired()) {
      logPlay();
    }
  }, [token, backendUrl]);
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
              companion for every moment. Start your journey with Melodify
              today!
            </p>
            <SpotifyLogin />
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
