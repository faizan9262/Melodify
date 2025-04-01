import { Usermodel } from "../models/user.models.js";
import axios from "axios";

export const userHistory = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.json("No token available!");
    }

    const headers = { Authorization: `Bearer ${token}` };

    const [recentPlays, topArtists] = await Promise.all([
      axios.get("https://api.spotify.com/v1/me/player/recently-played", {
        headers,
      }),
      axios.get(
        "https://api.spotify.com/v1/me/top/artists?time_range=short_term",
        { headers }
      ),
    ]);

    const userId = req.user._id;
    // console.log("User Id:",userId);

    await Usermodel.findByIdAndUpdate(userId, {
      spotifyHistory: {
        recentlyPlayed: recentPlays.data.items.map((item) => ({
          trackId: item.track.id,
          playedAt: item.played_at,
          artist: item.track?.artists?.[0]?.name || "unknown",
          genre: item.track?.artists?.[0]?.genres?.[0] || "unknown",
        })),
        topArtists: topArtists.data.items.slice(0, 5).map(a => a.name || 'unknown'),
        topGenres: [
          ...new Set( // Get unique genres
            topArtists.data.items.flatMap((a) => a.genres).filter((g) => g)
          ),
        ].slice(0, 5),
      },
    });

    res.json({
      success: true,
      message: "History Updated",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
