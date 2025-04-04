import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

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

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`,{
        withCredentials:true
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        // console.log(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthStatus();
    getUserData();
  }, []);

  // useEffect(()=>{
  //   const savedToken = localStorage.getItem("access_token")
  //   setToken(() => savedToken)
  //   console.log(savedToken);
  // },[])

  const getAuthStatus = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
        withCredentials: true, // <-- this is important
      });
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      toast.error("Auth status check failed:", error.message);
      setIsLoggedIn(false);
    }
  };
  

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");
    if (storedToken) {
      // console.log("Stored Token:", storedToken);
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
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
