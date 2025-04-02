import axios from "axios";
import querystring from "querystring";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;


export const getSpotifyLogin =  (req, res) => {
  // const clientId = CLIENT_ID;
  // const redirectUrl = REDIRECT_URI; // Fixed
  // const apiUrl = "https://accounts.spotify.com/authorize"; // Fixed to HTTPS
  // const scope = encodeURIComponent([
  //   "user-read-email",
  //   "user-read-private",
  //   "user-read-playback-state",
  //   "user-modify-playback-state",
  //   "user-read-currently-playing",
  //   "user-read-playback-position",
  //   "user-top-read",
  //   "user-read-recently-played",
  //   "playlist-read-private",
  //   "playlist-read-collaborative",
  //   "streaming"
  // ].join(" "));
  
  

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: [
      "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-playback-position",
    "user-top-read",
    "user-read-recently-played",
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming"
    ].join(" "),
    show_dialog: "true"
  })}`;

  res.redirect(authUrl);
};

export const getSpotifyCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token, refresh_token } = response.data;

    // ✅ Redirect to frontend with tokens as query parameters
    const FRONTEND_URL ="https://melodify-mood-hta3xutxp-faizan-shaikhs-projects-f4141c53.vercel.app/";
    res.redirect(`${FRONTEND_URL}/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error("Error getting Spotify token:", error.message);
    
    // Redirect to error page on frontend
    const FRONTEND_URL = "https://melodify-mood-hta3xutxp-faizan-shaikhs-projects-f4141c53.vercel.app/";
    res.redirect(`${FRONTEND_URL}/error?message=${encodeURIComponent(error.message)}`);
  }
};



export const getPlaylistData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract actual token

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure Bearer token format
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data); // Send JSON response
  } catch (error) {
    console.log(error.message);
  }
};

export const getPlaylistTrack = async (req, res) => {
  const { playlistId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!playlistId) {
    return res.json({ message: "Playlist is requied!" });
  }
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log(error.messsage)
  }
};


// export const refreshAccessToken = async (req,res) =>{
//   const {refreshToken} = req.body

//   if(!refreshToken){
//     return res.json({
//       message:"Refresh Token is required!"
//     })
//   }

//   const params = querystring.stringify({
//     grant_type:"refresh_token",
//     refresh_token:refreshToken,
//     client_id:CLIENT_ID,
//     client_secret:CLIENT_SECRET
//   })

//   try {
//     const response = await axios.post("https://accounts.spotify.com/api/token",params,{
//       headers:{"Content-Type": "application/x-www-form-urlencoded"},
//     })

//     res.json({
//       access_token: response.data.access_token,
//       expires_in: response.data.expires_in,
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// }