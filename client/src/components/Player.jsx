import { useContext, useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Player = ({ trackUri, source }) => {
  const { token, trackQueue, currentIndex,setCurrentIndex } = useContext(AppContext);
  const [play, setPlay] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (trackUri) {
      setPlay(true); // Ensure auto-play on track change
    }
  }, [trackUri]);

  useEffect(() => {
    if (trackQueue.length > 0) {
      setPlay(true); // Auto-play when trackQueue updates
    }
  }, [trackQueue, currentIndex]);

  const handleClick = (e) => {
    if (source) {
      navigate(source);
    }
  };

  if (!token) return null;

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-2 inset-x-0 mx-auto z-50 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-auto rounded-md shadow-md border-2 border-white bg-[#7B3F00] cursor-pointer p-3 text-black flex items-center justify-center transition-transform duration-500 pointer-events-none"
    >
      <div className="w-full pointer-events-auto">
        <SpotifyPlayer
          token={token}
          showSaveIcon
          play={play}
          uris={trackQueue}
          callback={(state) => {
            if (!state) return;
            setPlay(state.isPlaying);
          
            if (state.track && state.track.uri) {
              const index = trackQueue.indexOf(state.track.uri);
              if (index !== -1) {
                setCurrentIndex(index);  // Update the global state
              }
            }
          }}
          offset={currentIndex}
          styles={{
            bgColor: "#7B3F00",
            color: "#ffffff",
            trackNameColor: "#000",
            sliderColor: "#1ed760",
            sliderHandleColor: "#ffffff",
            loaderColor: "#ffffff",
            sliderTrackColor: "#ffffff",
            sliderHeight: 3,
            trackNameSize: "0.75rem",
            trackArtistSize: "0.65rem",
            height: 38,
          }}
        />
      </div>
    </div>
  );
};

export default Player;
