import express from "express";
import { moodBasedRecommendations } from "../controllers/mood.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const moodRouter = express.Router();

// POST route to send mood and get recommendations
// moodRouter.post("/recommendations",async(req,res)=>{
//   const {mood} = req.body
//   if(mood){
//     res.json({
//       success:true,
//       message:`mood detected: ${mood}`
//     })
//   }else{
//     res.json({
//       success:false,
//       message:`mood is not detected`
//     })
//   }
// });

moodRouter.get("/recommendations",protect,moodBasedRecommendations)

export default moodRouter;
