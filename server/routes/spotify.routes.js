import express from "express";
import { getPlaylistData, getPlaylistTrack, getSpotifyLogin } from "../controllers/spotify.controller.js";

const spotifyRouter = express.Router();

// Define routes
spotifyRouter.get("/login", getSpotifyLogin);
spotifyRouter.get("/playlists", getPlaylistData);
spotifyRouter.get("/playlists/:playlistId/tracks", getPlaylistTrack);

// spotifyRouter.post("/refresh", refreshAccessToken);    


export default spotifyRouter;
