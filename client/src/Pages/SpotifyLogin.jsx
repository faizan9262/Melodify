import React from "react";
import { FaSpotify } from "react-icons/fa";

const SpotifyLogin = () => {
  const loginWithSpotify = () => {
    // Redirect to Spotify login endpoint.
    window.location.href = "http://localhost:3000/api/auth/spotify/login";
  };

  return (
    <div className="flex justify-center items-center p-4">
      <button
        onClick={loginWithSpotify}
        className="flex items-center justify-center whitespace-nowrap gap-2 bg-[#1DB954] text-white rounded-full 
                   px-4 sm:px-6 md:px-8 py-2 text-base sm:text-xl md:text-2xl font-semibold"
      >
        <FaSpotify className="w-6 h-6 sm:w-8 sm:h-8" />
        Connect to Spotify to Continue
      </button>
    </div>
  );
};

export default SpotifyLogin;
