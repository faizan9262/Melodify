import React, { useContext, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { FaMusic } from "react-icons/fa";
import { FaVideo, FaVideoSlash } from "react-icons/fa6";
import Loader from "./Loader";
import PlaylistCard from "./PlaylistCard";
import { GiMusicalNotes } from "react-icons/gi";
import CircularLoader from "./CircularLoader";
import { toast } from 'sonner';
import mapDetectedMood from '../utils/moodMap.js'

const MoodDetection = () => {
  const [loading, setLoading] = useState(false);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [debouncedMood, setDebouncedMood] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const inputRef = useRef();


  const {
    backendUrl,
    token,
    playlists,
    setPlaylists,
    mood,
    setMood,
    inputMood,
    setInputMood,
    getTracksForMoodBasedPlaylist,
    convertedMood,
    setConvertedMood
  } = useContext(AppContext);

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
        if (canvasRef.current) {
          const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
          canvasRef.current.width = videoRef.current.clientWidth;
          canvasRef.current.height = canvasRef.current.width / aspectRatio;
        }
        detectMood(); // Start detecting after video loads
      };
    } catch (error) {
      toast.error("Error accessing webcam:", error);
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

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!detections.length) return;

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

      const expressions = detections[0].expressions;
      const detectedMood = Object.entries(expressions).reduce(
        (prev, curr) => (curr[1] > prev[1] ? curr : prev),
        ["neutral", 0]
      )[0];

      // toast.success("Detected Mood:", detectedMood);

      if (detectedMood !== debouncedMood) {
        setDebouncedMood(detectedMood);
        setTimeout(() => {
          if (detectedMood !== mood) {
            setMood(detectedMood);
          }
        }, 500);
      }
    }, 1500);
  };

  const fetchRecommendations = async (selectedMood = convertedMood || mood) => {
    setLoadingPlaylist(true);

    if (!selectedMood) {
      toast.warning("No mood selected for recommendations.");
      setLoadingPlaylist(false);
      return;
    }

    if (!token) {
      toast.warning("No Spotify token found.");
      setLoadingPlaylist(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/api/mood/recommendations`, {
        params: { mood: selectedMood },
        headers: { Authorization: `Bearer ${token}` },
      });

      const playlistsData = response.data
        .filter((item) => item.type === "playlist" && item.id)
        .map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          image: playlist.image,
        }));

      setPlaylists(playlistsData);
    } catch (error) {
      toast.error("Error fetching recommendations:", error.message);
    } finally {
      setLoadingPlaylist(false);
    }
  };

  

  return (
    <>
      <div
        className={`absolute items-center justify-center z-30 ${cameraOn ? "rounded-xl" : "hidden"}`}
      >
        {loading ? (
          ""
        ) : (
          <button
            className={`relative top-14 left-5 z-20 hover:bg-white p-2 rounded-full h-full flex items-center justify-center ${
              mood ? "bg-[#7B3F00]" : "bg-[#ff2c2c]"
            } transition-all duration-300 hover:scale-105 text-white hover:text-black`}
            onClick={stopVideo}
            disabled={loading}
          >
            {mood ? (
              <div>
                <button
                  onClick={() => fetchRecommendations()}
                  className="flex items-center  text-white justify-center gap-2 px-2"
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
        <h2 className="text-2xl lg:text-3xl flex items-center justify-center gap-3 font-semibold text-white text-center">
          Your Mood, Your Melody!
        </h2>

        <div className="flex md:flex-row sm:flex-row items-center sticky top-16 z-20 justify-center gap-2 w-full md:w-3/4 h-10">
          <input
            type="text"
            className="w-full md:w-1/2 bg-white hover:scale-105 transition-all duration-300 rounded-full h-full text-lg font-medium px-5 py-2 outline-none shadow-lg text-[#7B3F00] placeholder:text-[#7B3F00]"
            placeholder="Your Mood"
            ref={inputRef}
            onChange={(e) => {
              const userInput = e.target.value;
              setInputMood(userInput);
              const mood = mapDetectedMood(userInput);
              setConvertedMood(mood); // Detect mood, but don't overwrite input
            }}
            value={inputMood}
          />
          <button
            className="bg-[#7B3F00] flex gap-2 items-center justify-center border-2 border-white rounded-full px-2 py-2 whitespace-nowrap text-white font-medium hover:scale-105 transition-all duration-300"
            onClick={() => fetchRecommendations()}
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
          <div className="grid grid-cols-2 mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full md:w-4/5 gap-5 justify-items-center mb-32 mx-auto">
            {playlists && playlists.length > 0
              ? playlists.map((item, id) =>
                  item ? (
                    <PlaylistCard
                      key={id}
                      onClick={() => getTracksForMoodBasedPlaylist(item.id,item.name, item.image, item.length)}
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
