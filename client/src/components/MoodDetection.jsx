import React, { useContext, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FaMusic } from "react-icons/fa";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import Loader from "./Loader";
import PlaylistCard from "./PlaylistCard";
import { useNavigate } from "react-router-dom";
import { GiMusicalNotes } from "react-icons/gi";
import CircularLoader from "./CircularLoader";

const MoodDetection = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  // const [search, setSearch] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const inputRef = useRef();

  const [trackId, setTrackId] = useState("");

  const {
    backendUrl,
    token,
    playlists,
    setPlaylists,
    songsData,
    setSongsData,
    mood,
    setMood,
    inputMood,
    setInputMood,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const startVideo = async () => {
    setLoading(true);
    setCameraOn(true);

    try {
      setInputMood("");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);

      videoRef.current.play();
      setLoading(false);

      intervalRef.current = setInterval(() => {
        detectMood();
      }, 1000);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setLoading(false);
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const detectMood = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    const canvas = canvasRef.current;
    const displaySize = {
      width: videoRef.current.width,
      height: videoRef.current.height,
    };

    faceapi.matchDimensions(canvas, displaySize);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
      const detectedMood = sorted[0][0];

      if (detectedMood !== mood) {
        setMood(detectedMood);
        // fetchRecommendations(detectedMood);
      }
    }
  };

  const fetchRecommendations = async () => {
    setLoadingPlaylist(true);
    const selectedMood = inputMood || mood;
    if (!selectedMood) {
      console.error("No mood available to fetch recommendations!");
      return;
    }

    if (!token) {
      console.error("No Spotify token available!");
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/api/mood/recommendations`,
        {
          params: { mood: selectedMood },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const playlistsData = response.data
        .filter((item) => item.type === "playlist" && item.id)
        .map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          image: playlist.image,
        }));

      setPlaylists(playlistsData);
      setLoadingPlaylist(false);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
      setLoadingPlaylist(false);
    }
  };

  const getPlaylistTracks = async (id) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/auth/spotify/playlists/${id}/tracks`,
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
      // console.log(songsData);

      // console.log(id);

      navigate(`/playlist/${id}`);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  return (
    <>
      <div
        className={`absolute items-center justify-center z-30 ${
          cameraOn ? "rounded-xl" : "hidden"
        }`}
      >
        {loading ? (
          ""
        ) : (
          <button
            className={`relative top-14 left-5 z-20 hover:bg-white p-2 rounded-full h-full flex items-center justify-center ${
              mood ? "bg-[#2A9D8F]" : "bg-[#ff2c2c]"
            } transition-all duration-300 hover:scale-105 text-white hover:text-black`}
            onClick={stopVideo}
            disabled={loading}
          >
            {mood ? (
              <div>
                <button
                  onClick={fetchRecommendations}
                  className="flex items-center bg-[#7B3F00] text-white justify-center gap-2 px-2"
                >
                  See Recommendations
                  <FaMusic />
                </button>
              </div>
            ) : (
              <FaVideoSlash className="w-6 h-6" />
            )}
          </button>
        )}
        <video ref={videoRef} width="720" height="560" className="rounded-xl" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
        />
      </div>

      <div className="flex w-full flex-col gap-3 items-center mt-24 px-4 md:px-8">
        <h2 className="text-2xl  lg:text-3xl flex items-center justify-center gap-3 font-semibold text-white text-center">
          Your Mood, Your Melody!
        </h2>

        <div className="flex md:flex-row sm:flex-row items-center sticky top-16 z-20 justify-center gap-2 w-full md:w-3/4 h-10">
          <input
            type="text"
            className="w-full md:w-1/2 bg-white hover:scale-105 transition-all duration-300 rounded-full h-full text-lg font-medium px-5 py-2 outline-none shadow-lg text-[#7B3F00] placeholder:text-[#7B3F00]"
            placeholder="Your Mood"
            ref={inputRef}
            onChange={(e) => setInputMood(e.target.value)}
            value={inputMood}
          />
          <button
            className="bg-[#7B3F00] flex gap-2 items-center justify-center border-2 border-white rounded-full px-2 py-2 whitespace-nowrap text-white font-medium hover:scale-105 transition-all duration-300"
            onClick={fetchRecommendations}
          >
            Get
            <GiMusicalNotes className="w-5 h-5" />
          </button>
          <button
            className="bg-white p-2 rounded-full h-full flex items-center justify-center hover:bg-[#7B3F00] border-2 hover:border-white transition-all duration-300 hover:scale-105 hover:text-white text-black"
            onClick={startVideo}
            disabled={loading}
          >
            {loading ? <CircularLoader /> : <FaVideo className="w-6 h-6" />}
          </button>
        </div>

        {loadingPlaylist ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <Loader />
        </div>
        
        ) : (
          <div className="grid grid-cols-2 mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full md:w-4/5 gap-5 justify-items-center mx-auto">
            {playlists && playlists.length > 0
              ? playlists.map((item, id) =>
                  item ? (
                    <PlaylistCard
                      key={id}
                      onClick={() => getPlaylistTracks(item.id)}
                      name={
                        item.name.length > 20
                          ? `${item.name.slice(0, 20)}...`
                          : item.name
                      }
                      img_src={item.image}
                    />
                  ) : null
                )
              : null}
          </div>
        )}
      </div>
    </>
  );
};

export default MoodDetection;
