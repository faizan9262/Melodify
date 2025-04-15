import React, { useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import { useLocation, useParams } from "react-router-dom";
import SongsCard from "../components/SongsCard";
import Loader from "./Loader";

const PlaylistSongs = () => {
  const {
    backendUrl,
    token,
    setPlayUri,
    getPlaylistTracks,
    songsData,
    loading,
    playlistData,
    trackQueue,
    setCurrentIndex,
    setPlay
  } = useContext(AppContext);

 const { state } = useLocation();
  const { name, image, total } = state || {};
  const { id } = useParams();

useEffect(() => {
    if (id && image && name) {
      getPlaylistTracks(id, image, name);
    }
  }, [id, token, backendUrl, image, name]);

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
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Loader - Absolutely Centered */}
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader />
          </div>
        )}

        {/* Header Section (Image & Name) - Only Show After Loading */}
        {!loading && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-center w-full gap-5 mt-5 mb-3">
              {/* Left Column (Image) */}
              <div className="flex justify-center gap-5 sm:w-auto w-full sm:max-w-[10rem]">
                <img
                  src={image || playlistData.image}
                  alt="playlist"
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-md"
                />
              </div>
              {/* Right Column (Name) */}
              <div className="flex flex-col items-center sm:items-start justify-center gap-3 w-full sm:w-auto sm:max-w-[25rem] px-4">
                <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold text-center sm:text-left">
                  {name || playlistData.name}
                </h1>
              </div>
            </div>

            {/* hr (Only Show After Content Loads) */}
            <hr className="text-white border-2 w-full sm:w-3/4 rounded-full my-4" />
          </>
        )}

        {/* Playlist Songs Section */}
        <div className="flex flex-col w-full sm:w-4/5 mb-28 items-center justify-center">
          {!loading && songsData.length > 0
            ? songsData.map((item, id) => (
                <SongsCard
                  key={id}
                  name={item.name}
                  artists={item.artists}
                  onClick={() => chooseTrack(item.track_uri)}
                  image={item.image}
                  duration={msToMinutesAndSeconds(item.duration)}
                />
              ))
            : !loading && <p className="text-white">No songs available</p>}
        </div>
      </div>
    </div>
  );
};

export default PlaylistSongs;
