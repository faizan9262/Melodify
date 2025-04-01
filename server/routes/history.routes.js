import express from 'express'
import { userHistory } from '../controllers/hostory.controller.js'
import { protect } from '../middleware/authMiddleware.js'

const historyRouter = express.Router()

historyRouter.get('/log-play',protect,userHistory)


export default historyRouter