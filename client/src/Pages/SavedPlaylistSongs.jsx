import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useLocation, useParams } from "react-router-dom";
import SongsCard from "../components/SongsCard";
import { MdLibraryAdd, MdLibraryAddCheck } from "react-icons/md";
import Loader from "../components/Loader";
import { toast } from "sonner";

const SavedPlaylistSongs = () => {
  const {
    backendUrl,
    token,
    getSavedPlaylistTracks,
    setPlayUri,
    songsData,
    playlistData,
    loading, 
    setCurrentIndex,
    setPlay,
    trackQueue
  } = useContext(AppContext);
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { state } = useLocation();
  const { name, image, total } = state || {};
  const { id } = useParams();
  const [selectedPlaylist, setSelectedPlaylist] = useState(id);

  useEffect(() => {
    if (id && image && name) {
      getSavedPlaylistTracks(id, image, name);
    }
  }, [id, token, backendUrl, image, name]);
  const savePlaylist = async () => {
    if (!selectedPlaylist) return;
    setIsSaving(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/playlist/save-playlist`,
        { playlistId: selectedPlaylist }
      );

      if (response.data.success) {
        setIsSaved(true);
        toast.success("Playlist Saved!")
      } else {
        toast.error("Failed to save playlist:", response.data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const removePlaylist = async () => {
    if (!selectedPlaylist) return;
    setIsSaving(true);

    try {
      const response = await axios.delete(
        `${backendUrl}/api/user/playlist/remove-playlist`,
        {
          data: { playlistId: selectedPlaylist },
        }
      );

      if (response.data.success) {
        setIsSaved(false);
        toast.success("Playlist Removed!")
      } else {
        toast.error("Failed to remove playlist:", response.data.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const chooseTrack = (uri) => {
    const index = trackQueue.indexOf(uri);
    if (index !== -1) {
      setCurrentIndex(index);
      setPlayUri(uri);
      setPlay(true);  // trigger manual play
    }
  };

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080]">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 relative">
        {/* Loader - Absolutely Centered */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {/* Header Section - Only Show After Loading */}
        {!loading && (
          <div className="grid grid-cols-2 md:flex md:items-center md:justify-center w-full gap-5 mt-5 mb-3">
            {/* Left Column (Image) */}
            <div className="flex items-center justify-center">
              <img
                src={image || playlistData.image}
                alt="playlist"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-md"
              />
            </div>
            {/* Right Column (Name & Save/Remove Button in column layout) */}
            <div className="flex flex-col items-center justify-center gap-3">
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold text-center">
                {name || playlistData.name}
              </h1>
              <div
                className="flex gap-2 text-white cursor-pointer bg-[#7B3F00] border-white border-2 py-1 px-2 rounded-lg items-center text-base sm:text-xl hover:scale-105 transition-all duration-300 justify-center"
                onClick={isSaved ? removePlaylist : savePlaylist}
              >
                {isSaved ? (
                  <>
                    <MdLibraryAddCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="whitespace-nowrap font-semibold">
                      {isSaving ? "Removing..." : "Remove Playlist"}
                    </span>
                  </>
                ) : (
                  <>
                    <MdLibraryAdd className="w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="whitespace-nowrap font-semibold">
                      {isSaving ? "Saving..." : "Add Playlist"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Only show the HR after loading */}
        {!loading && (
          <hr className="text-white border-2 w-full rounded-full my-4" />
        )}

        {/* Playlist Songs Section */}
        <div className="flex flex-col w-full sm:w-4/5 items-center mb-48 sm:mb-32 justify-center">
          {loading ? (
            <Loader width="100" color="#ffffff" />
          ) : songsData.length > 0 ? (
            songsData.map((item, id) => (
              <SongsCard
                key={id}
                name={item.name}
                artists={item.artists}
                onClick={() => chooseTrack(item.track_uri)}
                image={item.image}
                duration={msToMinutesAndSeconds(item.duration)}
              />
            ))
          ) : (
            <p className="text-white">No songs available</p>
          )}

          {/* Spotify Player */}
          {/* <Player trackUri={playUri} /> */}
        </div>
      </div>
    </div>
  );
};

export default SavedPlaylistSongs;
