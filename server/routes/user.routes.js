import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { editProfile, profile, requestForPasswordResetOtp, resetPassword } from '../controllers/user.controller.js'
import upload from '../middleware/multer.js'

const userRouter = express.Router()

userRouter.get('/profile',protect,profile)
userRouter.post('/password-reset-otp',protect,requestForPasswordResetOtp)
userRouter.post('/reset-password',protect,resetPassword)
userRouter.post('/edit-profile',protect,upload.single('file'),editProfile)

export default userRouter;