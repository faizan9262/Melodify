import express from "express";
import { isAuthenticated, loginUser, logoutUser, registerUser, sendUserVerificationOtp, verifyEmail } from "../controllers/auth.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login',loginUser)
authRouter.post('/logout',protect,logoutUser)
authRouter.post('/email-verifcation-otp',protect,sendUserVerificationOtp)
authRouter.post('/verify-email',protect,verifyEmail)
authRouter.get('/is-auth',protect,isAuthenticated)

export default authRouter;