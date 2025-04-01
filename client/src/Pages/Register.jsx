import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, setIsLoggedIn, getUserData } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/register", { username, email, password });
      if (data.success) {
        setIsLoggedIn(true);
        await getUserData();
        navigate("/");
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (isLoggedIn) {
    navigate("/");
  }

  return (
    <div className="w-full h-screen flex bg-gradient-to-b from-[#7B3F00] via-[#2F4F4F] to-[#000080] items-center justify-center">
      <div className="bg-[rgba(5,10,20,0.5)] w-11/12 sm:w-2/3 md:w-1/3 rounded-2xl flex flex-col items-center justify-center shadow-2xl h-auto sm:h-2/3 gap-4 p-6">
        <h2 className="text-center text-2xl font-bold text-white">
          Create An Account
        </h2>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col w-full items-center gap-6 justify-center"
        >
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
            placeholder="Username"
            className="w-full py-2 px-4 rounded-full text-[#7B3F00] outline-none font-medium border-2 placeholder:text-[#7B3F00] hover:scale-105 transition-all duration-300"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            className="w-full py-2 px-4 rounded-full text-[#7B3F00] outline-none font-medium border-2 placeholder:text-[#7B3F00] hover:scale-105 transition-all duration-300"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="w-full py-2 px-4 rounded-full text-[#7B3F00] outline-none font-medium border-2 placeholder:text-[#7B3F00]  hover:scale-105 transition-all duration-300"
          />
          <button
            type="submit"
            className="w-full bg-[#7B3F00] rounded-full py-2 text-xl font-medium text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
          >
            Sign Up
          </button>
          <span
            onClick={() => navigate("/login")}
            className="text-[14px] text-white underline cursor-pointer"
          >
            Already have an Account?
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
