import bcryptjs from "bcryptjs";
import { Usermodel } from "../models/user.models.js";
import transporter from "../config/nodemailer.js";

export const profile = async (req, res) => {
  try {
    const user = await Usermodel.findById(req.user.id);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        moodprefrences: user.moodPrefrences,
        playlists: user.playlists,
        isUserVerified:user.isUserVerified
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const requestForPasswordResetOtp = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not found",
      });
    }


    const passwordResetopt = String(
      Math.floor(100000 + Math.random() * 900000)
    );

    user.passwordResetOtp = passwordResetopt;
    user.passwordResetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP!",
      text: `Use this otp to reset your password!, Your Otp is : ${passwordResetopt}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Password Reset OTP Successfully Sent to email!",
    });
  } catch (error) {
    res,
      json({
        success: false,
        message: error.message,
      });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { newUsername, newPassword, passwordResetOtp } = req.body;
    const userId = req.user.id;

    const user = await Usermodel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found!",
      });
    }

    // Update username regardless
    if (newUsername) {
      user.username = newUsername;
    }

    // Only update password if newPassword is provided.
    if (newPassword) {
      if (!passwordResetOtp) {
        return res.json({
          success: false,
          message: "OTP is required for password reset!",
        });
      }
      if (
        user.passwordResetOtp !== passwordResetOtp ||
        user.passwordResetOtpExpireAt < Date.now()
      ) {
        return res.json({
          success: false,
          message: "Invalid or expired OTP!",
        });
      }
      const newHashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = newHashedPassword;
      user.passwordResetOtp = "";
      user.passwordResetOtpExpireAt = null;
    }

    // Update profile picture if file is provided
    if (req.file) {
      user.profile = req.file.path;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export const resetPassword = async (req, res) => {
  const { newPassword, passwordResetOtp } = req.body;
  try {
    if (!passwordResetOtp) {
      return res.json({
        success: false,
        message: "OTP is requied for password reset!",
      });
    }

    if (!newPassword) {
      return res.json({
        success: false,
        message: "New Password is reqired!",
      });
    }
    const userId = req.user.id;

    const user = await Usermodel.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User Not Found!",
      });
    }

    if (
      user.passwordResetOtp !== passwordResetOtp ||
      user.passwordResetOtpExpireAt < Date.now()
    ) {
      return res.json({
        success: false,
        message: "Invalid or expired OTP!",
      });
    }

    const newHashedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = newHashedPassword;
    user.passwordResetOtp = "";
    user.passwordResetOtpExpireAt = null;

    await user.save();

    res.json({
      success: true,
      message: "Passswrod Reset Successfully!",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
