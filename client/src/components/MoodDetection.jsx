import React, { useContext, useRef, useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const inputRef = useRef();
  const [debouncedMood, setDebouncedMood] = useState(null);

  const {
    backendUrl,
    token,
    playlists,
    setPlaylists,
    setSongsData,
    mood,
    setMood,
    inputMood,
    setInputMood,
  } = useContext(AppContext);

  const navigate = useNavigate();

  // Load models when the component mounts
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]);
        console.log("FaceAPI models loaded");
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };
    loadModels();
  }, []);

  const startVideo = async () => {
    setLoading(true);
    setCameraOn(true);
    setInputMood("");
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
  
      videoRef.current.onloadedmetadata = () => {
        setLoading(false);
  
        // Set canvas size dynamically
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
  
        detectMood(); // Start detection after video loads
      };
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setLoading(false);
    }
  };
  

  const stopVideo = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const detectMood = async () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
  
    faceapi.matchDimensions(canvas, displaySize);
  
    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
  
      // Clear canvas before drawing new detections
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      if (!detections.length) {
        console.warn("No face detected!");
        return;
      }
  
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
  
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  
      console.log("Detected expressions:", detections[0].expressions);
  
      // Get the most dominant expression
      const expressions = detections[0].expressions;
      const detectedMood = Object.entries(expressions).reduce(
        (prev, curr) => (curr[1] > prev[1] ? curr : prev),
        ["neutral", 0]
      )[0];
  
      if (detectedMood !== debouncedMood) {
        setDebouncedMood(detectedMood);
        setTimeout(() => {
          if (detectedMood !== mood) {
            setMood(detectedMood);
          }
        }, 500);
      }
    }, 1000);
  };

  const fetchRecommendations = async () => {
    setLoadingPlaylist(true);
    const selectedMood = inputMood || mood;

    if (!selectedMood) {
      console.error("No mood available to fetch recommendations!");
      setLoadingPlaylist(false);
      return;
    }

    if (!token) {
      console.error("No Spotify token available!");
      setLoadingPlaylist(false);
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
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  // const getPlaylistTracks = async (id) => {
  //   try {
  //     const response = await axios.get(
  //       `${backendUrl}/api/auth/spotify/playlists/${id}/tracks`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     setSongsData(
  //       response.data.items.map((item) => ({
  //         name: item.track.name,
  //         artists: item.track.artists.map((artist) => artist.name),
  //         image: item.track.album.images?.[2]?.url || "",
  //         duration: item.track.duration_ms,
  //         track_uri: item.track.uri,
  //       }))
  //     );

  //     navigate(`/playlist/${id}`);
  //   } catch (error) {
  //     console.error("Error fetching playlist tracks:", error);
  //   }
  // };

  return (
    <>
      {/* Video Feed */}
      <div className={`relative flex items-center justify-center z-30 ${cameraOn ? "rounded-xl" : "hidden"}`}>
        {loading ? null : (
          <button
            className={`absolute top-4 left-5 z-20 p-2 rounded-full flex items-center justify-center ${
              mood ? "bg-[#7B3F00]" : "bg-[#ff2c2c]"
            } transition-all duration-300 hover:scale-105 text-white hover:text-black`}
            onClick={stopVideo}
            disabled={loading}
          >
            {mood ? (
              <button onClick={fetchRecommendations} className="flex items-center  text-white px-2">
                See Recommendations <FaMusic />
              </button>
            ) : (
              <FaVideoSlash className="w-6 h-6" />
            )}
          </button>
        )}

        <video ref={videoRef} width="720" height="560" className="rounded-xl" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>

      {/* UI Elements */}
      <div className="flex w-full flex-col gap-3 items-center mt-24 px-4 md:px-8">
        <h2 className="text-2xl lg:text-3xl font-semibold text-white text-center">
          Your Mood, Your Melody!
        </h2>

        <div className="flex md:flex-row items-center justify-center gap-2 w-full md:w-3/4 h-10">
          <input
            type="text"
            className="w-full md:w-1/2 bg-white rounded-full px-5 py-2 text-lg outline-none shadow-lg"
            placeholder="Your Mood"
            ref={inputRef}
            onChange={(e) => setInputMood(e.target.value)}
            value={inputMood}
          />
          <button className="bg-[#7B3F00] flex gap-2 px-2 py-2 rounded-full text-white" onClick={fetchRecommendations}>
            Get <GiMusicalNotes className="w-5 h-5" />
          </button>
          <button className="bg-white p-2 rounded-full hover:bg-[#7B3F00]" onClick={startVideo} disabled={loading}>
            {loading ? <CircularLoader /> : <FaVideo className="w-6 h-6" />}
          </button>
        </div>

        {loadingPlaylist ? <Loader /> : <div className="grid grid-cols-2 gap-5">{/* Playlists here */}</div>}
      </div>
    </>
  );
};

export default MoodDetection;
