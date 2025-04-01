import bcryptjs from "bcryptjs";
import { Usermodel } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/sendMail.js";

export const registerUser = async (req, res) => {
  const { username, email, password, moodPrefrences } = req.body;

  try {
    if (!email || !password || !username) {
      return res.json({
        success: false,
        message: "Email, username, and password are required!",
      });
    }

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already Exist With Email!",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new Usermodel({
      username,
      email,
      password: hashedPassword,
      moodPrefrences: moodPrefrences || [],
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "User Registered Successfully!",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await Usermodel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    

    if (!user) {
      return res.json({
        success: false,
        message: "User Does Not Exist!",
      });
    }

    const matchPassword = bcryptjs.compare(password, user.password);

    if (!matchPassword) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "User logged In Sueccssfuly",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({
    success: true,
    message: "User Logged Out Successfully!",
  });
};

export const sendUserVerificationOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const emailVerificationOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedOtp = await bcryptjs.hash(emailVerificationOtp, 10);

    user.emailVerificationOtp = hashedOtp;
    user.emailVerificationOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailSubject = "Email Verification OTP!";
    const mailText = `Your OTP for verifying your email is: ${emailVerificationOtp}. This OTP is valid for 24 hours.`;
    await sendMail(user.email, mailSubject, mailText);

    res.json({
      success: true,
      message: "OTP sent to your email for verification.",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    }); 
  }
};

export const verifyEmail = async (req, res) => {
  const { emailVerificationOtp } = req.body;

  try {
    if (!emailVerificationOtp) {
      return res.json({ success: false, message: "OTP is required!" });
    }

    const userId = req.user.id;
    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const isOtpValid = await bcryptjs.compare(
      emailVerificationOtp,
      user.emailVerificationOtp
    );

    if (!isOtpValid || user.emailVerificationOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP!" });
    }

    user.isUserVerified = true;
    user.emailVerificationOtp = null;
    user.emailVerificationOtpExpireAt = null;

    await user.save();

    res.json({ success: true, message: "Email verified successfully!" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    }); 
  }
};

export const isAuthenticated = async (req,res) =>{
  try {
    res.json({
      success:true
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    }); 
  }
}
