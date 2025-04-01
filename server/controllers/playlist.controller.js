import { Usermodel } from "../models/user.models.js";
import axios from "axios";

export const savePlaylistIds = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.user._id;
    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.savedPlaylists.includes(playlistId)) {
      user.savedPlaylists.push(playlistId);
      await user.save();
    }

    res.json({
      success: true,
      message: "Playlist Saved Succesfully.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const removePlaylistIds = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.user._id;
    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const index = user.savedPlaylists.indexOf(playlistId);

    if (index !== -1) {
      user.savedPlaylists.splice(index, 1);
      await user.save();
      return res.json({
        success: true,
        message: "Playlist Removed Successfully.",
      });
    }

    res.json({
      success: false,
      message: "Playlist not found in saved list.",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getSavedPlaylists = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = req.user._id;

    const user = await Usermodel.findById(userId);

    if (!user || !user.savedPlaylists.length) {
      return res.json({ success: false, message: "No saved playlists found" });
    }

    if (!token) {
      return res.json({ success: false, message: "Spotify token missing." });
    }

    const playlistDetails = await Promise.all(
      user.savedPlaylists.map(async (playlistId) => {
        try {
            // console.log(playlistId);
            
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return {
            id: response.data.id,
            name: response.data.name,
            image: response.data.images.length > 0 ? response.data.images[0].url : null,
          };
        } catch (error) {
          console.error(
            `Error fetching playlist ${playlistId}:`,
            error.message
          );
          return null;
        }
      })
    );
    res.json({
      success: true,
      playlists: playlistDetails
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};