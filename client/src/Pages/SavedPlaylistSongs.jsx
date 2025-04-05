import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useLocation, useParams } from "react-router-dom";
import SongsCard from "../components/SongsCard";
import { InfinitySpin } from "react-loader-spinner";
import Player from "../components/Player";
import { MdLibraryAdd, MdLibraryAddCheck } from "react-icons/md";
import Loader from "../components/Loader";
import { toast } from "sonner";

const SavedPlaylistSongs = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [songsData, setSongsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [playUri, setPlayUri] = useState(null);
  const { name, image, total } = location.state || {};
  const { id } = useParams();
  const [selectedPlaylist, setSelectedPlaylist] = useState(id);

  useEffect(() => {
    const getPlaylistTracks = async (playlistId) => {
      setLoading(true);
      setPlayUri(`spotify:playlist:${playlistId}`);

      try {
        const response = await axios.get(
          `${backendUrl}/api/auth/spotify/playlists/${playlistId}/tracks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const items = response.data.items;
        setSongsData(
          items.map((item) => ({
            name: item.track.name,
            artists: item.track.artists.map((artist) => artist.name),
            image:
              item.track.album.images.length > 2
                ? item.track.album.images[2].url
                : "",
            duration: item.track.duration_ms,
            track_uri: item.track.uri,
          }))
        );
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getPlaylistTracks(id);
  }, [id, token, backendUrl]);

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
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.log(error.message);
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
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const chooseTrack = (track_uri) => {
    if (track_uri) {
      setPlayUri(track_uri);
    } else {
      toast.warning("Invalid track URI:", track_uri);
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
                src={image}
                alt="playlist"
                className="w-32 h-32 sm:w-36 sm:h-36 rounded-md"
              />
            </div>
            {/* Right Column (Name & Save/Remove Button in column layout) */}
            <div className="flex flex-col items-center justify-center gap-3">
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold text-center">
                {name}
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
        <div className="flex flex-col w-full sm:w-4/5 items-center justify-center">
          {loading ? (
            <InfinitySpin width="100" color="#ffffff" />
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
          <Player trackUri={playUri} />
        </div>
      </div>
    </div>
  );
};

export default SavedPlaylistSongs;
