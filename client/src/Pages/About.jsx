import React from "react";
import Navbar from "../components/Navbar";
import { FaMusic, FaSpotify, FaHeadphonesAlt } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080] min-h-screen w-full text-white">
      <Navbar />
      
      <div className="text-center py-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-5">About Melodify</h1>
        <p className="text-base sm:text-lg md:text-2xl max-w-4xl mx-auto px-4">
          Melodify is your go-to music app for discovering, managing, and sharing your favorite playlists. 
          Whether you're a fan of Phonk, Pop, Rock, or Classical, Melodify connects seamlessly with Spotify to
          give you access to all your favorite tracks in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-5 py-10">
        <div className="text-center p-5 bg-[rgba(5,10,20,0.5)] rounded-lg shadow-lg flex flex-col items-center">
          <FaMusic className="text-5xl sm:text-6xl mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Music Discovery</h2>
          <p className="text-sm sm:text-lg">
            Explore new tracks and playlists tailored to your taste. With Melodify, discovering new music is easier than ever!
          </p>
        </div>

        <div className="text-center p-5 bg-[rgba(5,10,20,0.5)] rounded-lg shadow-lg flex flex-col items-center">
          <FaSpotify className="text-5xl sm:text-6xl mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Spotify Integration</h2>
          <p className="text-sm sm:text-lg">
            Sync your Spotify account with Melodify to access all your playlists, favorite tracks, and albums in one place.
          </p>
        </div>

        <div className="text-center p-5 bg-[rgba(5,10,20,0.5)] rounded-lg shadow-lg flex flex-col items-center">
          <FaHeadphonesAlt className="text-5xl sm:text-6xl mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">Listen Anywhere</h2>
          <p className="text-sm sm:text-lg">
            With Melodify, you can listen to your playlists and music on any device. Your music, your way, all the time.
          </p>
        </div>
      </div>

      <div className="text-center py-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">Join the Melodify Community!</h2>
        <p className="text-base sm:text-xl max-w-3xl mx-auto px-4">
          Whether you're a music enthusiast or just looking for a new way to enjoy your favorite songs, Melodify offers you a rich, interactive experience. 
          Sign up today and start curating your playlists, discovering new music, and sharing your favorite tracks with the world!
        </p>
      </div>
    </div>
  );
};

export default About;
