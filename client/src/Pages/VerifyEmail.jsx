import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyEmail = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { backendUrl, userData, getUserData } = useContext(AppContext);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el.value);
    const emailVerificationOtp = otpArray.join("");
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/verify-email", {
        emailVerificationOtp,
      });
      if (data.success) {
        getUserData();
        navigate("/profile");
        toast.success("Email verified Successfully.")
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080] px-4 sm:px-6 md:px-8">
      <form
        onSubmit={onSubmitHandler}
        className="bg-[#7B3F00] w-full sm:w-3/4 md:w-1/3 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-md p-6"
      >
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <img src={logo} alt="logo" className="w-10 h-10" />
          <p className="text-base sm:text-xl text-white font-bold">Melodify</p>
        </div>
        <h1 className="text-base sm:text-xl font-semibold text-white">
          Email Verification OTP
        </h1>
        <p className="text-sm sm:text-base font-medium text-white">
          Enter the 6-digit code sent to your email.
        </p>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                required
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-[rgba(5,10,20,0.5)] text-white outline-none text-center text-lg sm:text-xl rounded-lg"
              />
            ))}
        </div>
        <button
          type="submit"
          className="bg-white text-black text-base sm:text-xl py-1 w-2/3 rounded-lg font-medium hover:scale-105 transition-all duration-300 mt-3"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
