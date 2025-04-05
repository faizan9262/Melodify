import React, { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdSmsFailed, MdVerified } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { toast } from "sonner";

const Profile = () => {
  const { userData, backendUrl, setIsLoggedIn, setToken, setUserData } =
    useContext(AppContext);
  const navigate = useNavigate();

  // Local state for edit mode and form fields
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newUsername, setNewUsername] = useState(userData.username);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setNewUsername(userData.username);
  }, [userData.username]);

  const logout = async () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/logout");
        if (data.success) {
          setIsLoggedIn(false);
          setUserData("");
          setToken("");
          localStorage.removeItem("spotifyToken");
          navigate("/");
          toast.success("Logged Out!");
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  // When in edit mode, clicking the profile image triggers file selection.
  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.info("New Profile Picture Selected");
    }
  };

  // Save updated username and profile picture without OTP verification.
  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("newUsername", newUsername);
    // Not updating password, so we pass an empty string.
    formData.append("newPassword", "");
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        backendUrl + "/api/user/edit-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (data.success) {
        // alert(data.message);
        // Update userData with new username and new profile picture preview if available.
        setUserData((prev) => ({
          ...prev,
          username: newUsername,
          profile: selectedFile
            ? URL.createObjectURL(selectedFile)
            : prev.profile,
        }));
        setIsEditing(false);
        setSelectedFile(null);
        toast.success(data.message)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/email-verifcation-otp`,
        {},
        { withCredentials: true } // Ensures cookies (like JWT) are sent
      );

      // console.log(response.data);
      if (response.data.success) {
        toast.success("OTP sent to your email!");
        navigate("/verify-email");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // toast.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080]">
      <Navbar />
      <div className="h-screen w-full flex gap-5 flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-y-hidden">
        <div className="relative">
          <img
            src={
              selectedFile
                ? URL.createObjectURL(selectedFile)
                : userData.profile
            }
            alt="profile"
            onClick={handleImageClick}
            className={`w-24 h-24 rounded-full object-cover border-4 border-white ${
              isEditing ? "cursor-pointer" : ""
            }`}
          />
          {isEditing && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          )}
        </div>
        <h1 className="text-xl md:text-3xl flex gap-2 items-center justify-center text-white font-semibold text-center">
          Welcome to Melodify,{" "}
          {userData?.username
            ? userData.username.charAt(0).toUpperCase() +
              userData.username.slice(1)
            : "User"}
        </h1>
        <div className="flex flex-col gap-3 w-full sm:w-2/3 md:w-1/2 items-start">
          <div className="flex w-full items-center">
            <label
              htmlFor="username"
              className="text-white font-medium text-lg sm:text-base md:text-lg w-1/3"
            >
              Username
            </label>
            {isEditing ? (
              <input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="rounded-xl w-2/3 text-lg sm:text-base md:text-lg font-medium text-[#7B3F00] outline-none px-5 py-2"
              />
            ) : (
              <input
                id="username"
                type="text"
                value={newUsername}
                readOnly
                className="rounded-xl bg-[rgba(5,10,20,0.5)] w-2/3 text-lg sm:text-base md:text-lg font-medium  text-white outline-none px-5 py-2"
              />
            )}
          </div>
          <div className="flex w-full items-center">
            <label
              htmlFor="email"
              className="text-white flex gap-2 items-center font-medium text-lg sm:text-base md:text-lg w-1/3"
            >
              Email
              {userData.isUserVerified ? (
                <MdVerified color="green" className="w-6 h-6" />
              ) : (
                <MdSmsFailed color="red" className="w-6 h-6" />
              )}
            </label>
            <input
              id="email"
              type="email"
              value={userData.email}
              readOnly
              className="rounded-xl w-2/3 text-lg sm:text-base md:text-lg bg-[rgba(5,10,20,0.5)] font-medium text-white outline-none px-5 py-2"
            />
          </div>
        </div>
        <div className="flex justify-center w-full sm:w-2/3 md:w-1/2 items-center gap-4">
          <button
            onClick={logout}
            className="bg-[#7B3F00] text-white text-lg sm:text-base md:text-lg py-1 w-full sm:w-1/2 rounded-lg font-medium hover:scale-105 hover:bg-white hover:text-black transition-all duration-300"
          >
            Log Out
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className={`bg-[#7B3F00] text-white text-lg sm:text-base md:text-lg py-1 w-full sm:w-1/2 rounded-lg font-medium transition-all duration-300 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105 hover:bg-white hover:text-black"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#7B3F00] text-white text-lg sm:text-base md:text-lg py-1 w-full sm:w-1/2 rounded-lg font-medium hover:scale-105 hover:bg-white hover:text-black transition-all duration-300"
            >
              Edit Profile
            </button>
          )}
          {!userData.isUserVerified && (
            <button
              onClick={sendOtp}
              className="bg-[#7B3F00] text-white text-lg sm:text-base md:text-lg py-1 w-full sm:w-1/2 rounded-lg font-medium hover:scale-105 hover:bg-white hover:text-black transition-all duration-300"
            >
              Verify Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
