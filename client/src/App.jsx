import React, { useContext, useState } from "react";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Profile from "./Pages/Profile";
import VerifyEmail from "./Pages/VerifyEmail";
import SpotifyLogin from "./Pages/SpotifyLogin";
import SpotifyPlaylist from "./Pages/SpotifyPlaylist";
import MoodBasedPlaylist from "./Pages/MoodBasedPlaylist";
import SavedPlaylists from "./Pages/SavedPlaylists";
import SavedPlaylistSongs from "./Pages/SavedPlaylistSongs";
import Playlist from "./components/Playlist";
import PlaylistSongs from "./components/PlaylistSongs";
import About from "./Pages/About";
import Player from "./components/Player";
import { AppContext } from "./context/AppContext";

const App = () => {
  const { playUri,playSource } = useContext(AppContext);
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/spotify-playlist" element={<SpotifyPlaylist />} />
        <Route path="/my-spotify-playlists" element={<Playlist />} />
        <Route path="/my-spotify-playlists/:id" element={<PlaylistSongs />} />
        <Route path="/my-playlist" element={<SavedPlaylists />} />
        <Route path="/my-playlist/:id" element={<SavedPlaylistSongs />} />
        <Route path="/playlist/:id" element={<MoodBasedPlaylist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/spotify-login" element={<SpotifyLogin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
        <Player trackUri={playUri} source={playSource}/>
    </div>
  );
};

export default App;

// bg-gradient-to-r from-green-900 via-teal-800 via-blue-800 via-purple-800 to-indigo-900
