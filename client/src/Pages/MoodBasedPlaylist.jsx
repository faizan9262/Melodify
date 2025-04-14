import axios from "axios";
import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import SongsCard from "../components/SongsCard";
import Navbar from "../components/Navbar";
import { MdLibraryAdd, MdLibraryAddCheck } from "react-icons/md";
import Loader from "../components/Loader";
import { toast } from "sonner";

const MoodBasedPlaylist = () => {
  const {
    songsData,
    playlists,
    backendUrl,
    mood,
    inputMood,
    getTracksForMoodBasedPlaylist,
    isLoading,
    isLoadingSongs,
    selectedPlaylist,
    playlistData,
    setPlayUri,
    trackQueue,
    setCurrentIndex,
    setPlay
  } = useContext(AppContext);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPlaylists, setSavedPlaylists] = useState({});

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  
  const chooseTrack = (uri) => {
    const index = trackQueue.indexOf(uri);
    if (index !== -1) {
      setCurrentIndex(index);
      setPlayUri(uri);
      setPlay(true);  // trigger manual play
    }
  };

  const savePlaylist = async (playlistId) => {
    setIsSaving(true);
    if (!playlistId) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/playlist/save-playlist`,
        { playlistId }
      );

      if (response.data.success) {
        setSavedPlaylists((prev) => ({
          ...prev,
          [playlistId]: !prev[playlistId],
        }));
        toast.success("Playlist Saved!")
      } else {
        toast.error("Failed to save playlist:", response.data.message);
      }
      setIsSaving(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const removePlaylist = async (playlistId) => {
    if (!playlistId) return;
    setIsSaving(true);

    try {
      const response = await axios.delete(
        `${backendUrl}/api/user/playlist/remove-playlist`,
        { data: { playlistId } }
      );

      if (response.data.success) {
        setSavedPlaylists((prev) => {
          const updatedPlaylists = { ...prev };
          delete updatedPlaylists[playlistId];
          return updatedPlaylists;
        });
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080]">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_4fr] gap-4 h-screen overflow-hidden">
          {/* Left Sidebar */}
          <div className="flex flex-col gap-4 text-white font-medium px-3 text-xl h-full overflow-y-auto hide-scrollbar">
            <h1 className="font-bold text-center mt-2 text-2xl">
              Mood :{" "}
              {mood.charAt(0).toUpperCase() + mood.slice(1) ||
                inputMood.charAt(0).toUpperCase() + inputMood.slice(1)}
            </h1>
            {isLoading ? (
              <Loader />
            ) : playlists.length > 0 ? (
              playlists.map((item) => (
                <div
                  key={item.id}
                  className={`cursor-pointer px-2 py-1 transition-all duration-300 rounded-lg ${
                    selectedPlaylist === item.id
                      ? "bg-[rgba(5,10,20,0.5)] text-white"
                      : "hover:bg-[rgba(5,10,20,0.5)] text-white"
                  }`}
                  onClick={() =>
                    getTracksForMoodBasedPlaylist(
                      item.id,
                      item.name,
                      item.image
                    )
                  }
                >
                  {item.name}
                </div>
              ))
            ) : (
              <p>No playlists available</p>
            )}
          </div>

          {/* Right Content */}
          <div className="px-4 w-full h-full overflow-y-auto mx-auto">
            {playlistData ? (
              <div className="flex items-center justify-around gap-2 my-3 px-2">
                <img
                  src={playlistData.playlistIamge}
                  alt="playlist"
                  className="w-36 h-36 rounded-lg"
                />
                <h1 className="text-2xl font-bold text-white">
                  {playlistData.playlistName}
                </h1>
                <div
                  className="flex gap-2 text-white bg-[#7B3F00] border-white border-2 py-1 px-2 rounded-lg items-center text-xl hover:scale-105 transition-all duration-300 justify-center w-full sm:w-auto"
                  onClick={() =>
                    savedPlaylists[selectedPlaylist]
                      ? removePlaylist(selectedPlaylist)
                      : savePlaylist(selectedPlaylist)
                  }
                >
                  {savedPlaylists[selectedPlaylist] ? (
                    <>
                      <MdLibraryAddCheck className="w-7 h-7" />
                      <span className="whitespace-nowrap font-semibold">
                        {isSaving ? "Removing..." : "Remove Playlist"}
                      </span>
                    </>
                  ) : (
                    <>
                      <MdLibraryAdd className="w-7 h-7" />
                      <span className="whitespace-nowrap font-semibold">
                        {isSaving ? "Saving..." : "Add Playlist"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : null}
            <hr className="text-white border-2 rounded-full my-4 mx-2" />
            {isLoadingSongs ? (
              <div className="flex items-center justify-center w-full h-full">
                <Loader />
              </div>
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
            {/* <Player trackUri={playUri} /> */}
            <img
              src={songsData.image}
              alt="playlist-img"
              className="w-36 h-36"
            />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col gap-4 h-screen overflow-hidden">
          {/* Horizontal Sidebar on Top */}
          <div className="flex flex-row gap-4 text-white font-medium px-3 text-xl overflow-x-auto hide-scrollbar items-center min-h-[80px]">
            <h1 className="hidden sm:block whitespace-nowrap font-bold text-center mt-2 text-2xl">
              Mood :{" "}
              {mood.charAt(0).toUpperCase() + mood.slice(1) ||
                inputMood.charAt(0).toUpperCase() + inputMood.slice(1)}
            </h1>
            {isLoading ? (
              <Loader />
            ) : playlists.length > 0 ? (
              playlists.map((item) => (
                <div
                  key={item.id}
                  className={`whitespace-nowrap cursor-pointer px-3 py-2 transition-all border-white border-2 duration-300 rounded-lg ${
                    selectedPlaylist === item.id
                      ? "bg-blue-600 text-white"
                      : "bg-[#7B3F00] text-white hover:bg-gray-700"
                  } text-lg`}
                  onClick={() =>
                    getTracksForMoodBasedPlaylist(
                      item.id,
                      item.name,
                      item.image
                    )
                  }
                >
                  {item.name}
                </div>
              ))
            ) : (
              <p className="whitespace-nowrap">No playlists available</p>
            )}
          </div>

          {/* Songs List and Player */}
          <div className="px-2 w-full flex-1 overflow-y-auto overflow-x-hidden mx-auto">
            {playlistData ? (
              <div className="flex flex-row gap-4 my-3 px-2 items-center">
                <div className="flex-shrink-0">
                  <img
                    src={playlistData.playlistIamge}
                    alt="playlist"
                    className="w-36 h-36 rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl font-bold text-white">
                    {playlistData.playlistName}
                  </h1>
                  <div
                    className="flex gap-2 text-white bg-[#7B3F00] border-white border-2 py-1 px-2 rounded-lg items-center text-xl hover:scale-105 transition-all duration-300 justify-center"
                    onClick={() =>
                      savedPlaylists[selectedPlaylist]
                        ? removePlaylist(selectedPlaylist)
                        : savePlaylist(selectedPlaylist)
                    }
                  >
                    {savedPlaylists[selectedPlaylist] ? (
                      <>
                        <MdLibraryAddCheck className="w-7 h-7" />
                        <span className="whitespace-nowrap font-semibold">
                          {isSaving ? "Removing..." : "Remove Playlist"}
                        </span>
                      </>
                    ) : (
                      <>
                        <MdLibraryAdd className="w-7 h-7" />
                        <span className="whitespace-nowrap font-semibold">
                          {isSaving ? "Saving..." : "Add Playlist"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            <hr className="text-white border-2 rounded-full my-4 mx-2" />
            <div className="flex flex-col items-center w-full">
              {isLoadingSongs ? (
                <div className="flex items-center justify-center w-full h-full">
                  <Loader />
                </div>
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
            </div>
            {/* <Player trackUri={playUri} /> */}
            <img
              src={songsData.image}
              alt="playlist-img"
              className="w-36 h-36"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodBasedPlaylist;
