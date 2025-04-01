import express from "express"
import {getSavedPlaylists, removePlaylistIds, savePlaylistIds } from "../controllers/playlist.controller.js"
import { protect } from "../middleware/authMiddleware.js";

const playlistRouter = express.Router()

playlistRouter.post('/save-playlist',protect,savePlaylistIds);
playlistRouter.delete('/remove-playlist',protect,removePlaylistIds);
playlistRouter.get('/get-saved-playlists',protect,getSavedPlaylists);

export default playlistRouter;