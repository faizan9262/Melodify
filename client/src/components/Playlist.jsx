import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import PlaylistCard from "../components/PlaylistCard";
import { BiSolidPlaylist } from "react-icons/bi";
import { FaPlay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "sonner";

const Playlist = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedPlaylists = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/auth/spotify/playlists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlaylist(response.data.items);
      } catch (error) {
        toast.error("Error fetching saved playlists:", error.message);
      }
      setLoading(false);
    };
    fetchSavedPlaylists();
  }, [backendUrl, token]);

  return (
    <div className="bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080] min-h-screen w-full">
      <Navbar />

      {loading ? (
        // Centered Loader
        <div className="flex justify-center items-center h-screen w-full">
          <Loader />
        </div>
      ) : (
        // Content only appears after loading
        <>
          <div className="flex items-center justify-center gap-5">
            <h1 className="text-xl whitespace-nowrap md:text-3xl flex items-center justify-center gap-2 text-center text-white m-5 font-semibold">
              <BiSolidPlaylist /> My Playlists
            </h1>
            <h1 className="text-xl md:text-3xl whitespace-nowrap flex items-center justify-center gap-2 text-white m-5 font-semibold">
              <FaPlay /> Total : {playlist.length}
            </h1>
          </div>

          <div className="flex items-center justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-4/5 gap-5">
              {playlist.length > 0 ? (
                playlist.map((pl, index) => (
                  <PlaylistCard
                    key={index}
                    name={
                      pl.name.length > 20 ? `${pl.name.slice(0, 20)}...` : pl.name
                    }
                    img_src={pl.images[0]?.url}
                    onClick={() => {
                      navigate(`/my-spotify-playlists/${pl.id}`, {
                        state: { name: pl.name, image: pl.images[0]?.url, total: pl.length },
                      });
                    }}
                  />
                ))
              ) : (
                <p className="text-white text-center text-lg">
                  No saved playlists found.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Playlist;
