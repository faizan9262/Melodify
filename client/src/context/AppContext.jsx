import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  axios.defaults.withCredentials = true;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState("");
  const [token, setToken] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [songsData, setSongsData] = useState([]);
  const [mood, setMood] = useState("");
  const [inputMood, setInputMood] = useState("");
  const [playlistImg, setPlaylistImg] = useState(null);
  const [playlistName, setPlaylistName] = useState(null);
  const [playUri, setPlayUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistData, setPlaylistsData] = useState({});
  const [playSource, setPlaySource] = useState(null);
  const [trackQueue, setTrackQueue] = useState([]); // all URIs
  const [currentIndex, setCurrentIndex] = useState(0);
  const [play, setPlay] = useState(false);


  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`);
      if (data.success) {
        setUserData(data.user);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAuthStatus();
    getUserData();
  }, []);

  const getPlaylistTracks = async (playlistId, image, name) => {
    setLoading(true);
    setPlaySource(`/my-spotify-playlists/${playlistId}`);
    
    try {
      const response = await axios.get(
        `${backendUrl}/api/auth/spotify/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setPlaylistsData({ name, image });
  
      const items = response.data.items;
      const uris = items.map((song) => song.track.uri);  // fix here to ensure correct Spotify URI
      setTrackQueue(uris);
      setCurrentIndex(0);
      setPlayUri(uris[0]);
      setSongsData(
        items.map((item) => ({
          name: item.track.name,
          artists: item.track.artists.map((artist) => artist.name),
          image: item.track.album.images.length > 2 ? item.track.album.images[2].url : "",
          duration: item.track.duration_ms,
          track_uri: item.track.uri,
        }))
      );
  
      setPlay(true);  // <<< Add this to trigger playback after loading.
  
    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const getSavedPlaylistTracks = async (playlistId, image, name) => {
    setLoading(true);
    setPlayUri(`spotify:playlist:${playlistId}`);
    setPlaySource(`/my-playlist/${playlistId}`);

    try {
      const response = await axios.get(
        `${backendUrl}/api/auth/spotify/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlaylistsData({
        name: name,
        image: image,
      });

      const items = response.data.items;
      const uris = items.map((song) => song.track.uri);  // fix here to ensure correct Spotify URI
      setTrackQueue(uris);
      setCurrentIndex(0);
      setPlayUri(uris[0]);
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

      setPlay(true);

    } catch (error) {
      console.error("Error fetching playlist tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAuthStatus = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  const getTracksForMoodBasedPlaylist = async (id, name, image, total) => {
    setIsLoadingSongs(true);
    setSelectedPlaylist(id);
    setPlayUri(`spotify:playlist:${id}`);
    setPlaySource(`/playlist/${id}`);

    setPlaylistsData({
      playlistName: name,
      playlistIamge: image,
      playlistTotal: total,
    });

    try {
      const response = await axios.get(
        `${backendUrl}/api/auth/spotify/playlists/${id}/tracks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        }
      );

      const items = response.data.items;
      const uris = items.map((song) => song.track.uri);  // fix here to ensure correct Spotify URI
      setTrackQueue(uris);
      setCurrentIndex(0);
      setPlayUri(uris[0]);
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

      setPlay(true);

      setIsLoadingSongs(false);
      navigate(`/playlist/${id}`, { replace: true });
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out. Please try again.");
      } else {
        console.error("Error fetching playlist tracks:", error);
      }
    }
  };

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      console.log("Stored Token:", storedToken);
      setToken(storedToken);
    }
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    getUserData,
    userData,
    setUserData,
    token,
    setToken,
    playlists,
    setPlaylists,
    songsData,
    setSongsData,
    mood,
    setMood,
    inputMood,
    setInputMood,
    playlistImg,
    setPlaylistImg,
    playlistName,
    setPlaylistName,
    playUri,
    setPlayUri,
    getPlaylistTracks,
    loading,
    setLoading,
    getTracksForMoodBasedPlaylist,
    isLoading,
    setIsLoading,
    isLoadingSongs,
    setIsLoadingSongs,
    selectedPlaylist,
    setSelectedPlaylist,
    playlistData,
    setPlaylistsData,
    playSource,
    setPlaySource,
    getSavedPlaylistTracks,
    trackQueue, 
    setTrackQueue,
    currentIndex, 
    setCurrentIndex
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
