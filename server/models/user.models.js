import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetOtp: {
      type: String,
      default: "",
    },
    passwordResetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    emailVerificationOtp: {
      type: String,
      default: "",
    },
    emailVerificationOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isUserVerified: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    moodPrefrences: {
      type: [String],
      default: [],
    },
    savedPlaylists: [String],
    spotifyHistory: {
      recentlyPlayed: [
        {
          trackId: String,
          playedAt: Date,
          artist: String,
          genre: String,
        },
      ],
      topArtists: [String],
      topGenres: [String],
    },
  },
  { timestamps: true }
);

export const Usermodel = mongoose.model("Usermodel", userSchema);
