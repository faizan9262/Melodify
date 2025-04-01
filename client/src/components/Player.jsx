import { useContext, useEffect, useState } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import { AppContext } from "../context/AppContext";

const Player = ({ trackUri }) => {
  const { token } = useContext(AppContext);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (trackUri) {
      setPlay(true); // Ensure auto-play on track change
    }
  }, [trackUri]);

  if (!token) return null;

  return (
    <div className="fixed bottom-2 inset-x-0 mx-auto z-50 w-[90%] sm:w-[85%] md:w-[80%] lg:w-[70%] xl:w-[60%] h-auto rounded-md shadow-md border-2 border-white bg-[#7B3F00] cursor-pointer p-3 text-black flex items-center justify-center">
      <div className="w-full">
        <SpotifyPlayer
          token={token}
          showSaveIcon
          play={play}
          uris={trackUri ? [trackUri] : []}
          callback={(state) => {
            if (!state) {
              console.error("Spotify Player state is null!");
              return;
            }

            // Automatically handle play/pause state
            if (!state.isPlaying) {
              setPlay(false);
            } else {
              setPlay(true);
            }

            // Prevent auto-pausing on next/previous track
            if (state.track.position === 0 && state.track.nextTrack) {
              setPlay(true);
            }
          }}
          styles={{
            bgColor: "#7B3F00",
            color: "#ffffff",
            trackNameColor: "#000",
            sliderColor: "#1ed760",
            sliderHandleColor: "#ffffff",
            loaderColor: "#ffffff",
            sliderTrackColor: "#ffffff",
            sliderHeight: 6, // Reduced slider height for small screens
            trackNameSize: "0.9rem", // Smaller text size for track name
            trackArtistSize: "0.8rem", // Smaller text size for artist name
            height: 45, // Reduce overall height for small screens
          }}
        />
      </div>
    </div>
  );
};

export default Player;
