    import dotenv from 'dotenv';
    import express from 'express';
    import cors from 'cors';
    import connectDB from './config/mongoDB.js'; // Assuming this is your DB config
    import authRouter from './routes/auth.routes.js'; // Assuming this is your auth routes file
    import cookieParser from 'cookie-parser';
    import userRouter from './routes/user.routes.js';
    import connectCloudinary from './config/cloudinary.js';
    import moodRouter from './routes/mood.routes.js';
    import spotifyRouter from './routes/spotify.routes.js';
    import historyRouter from './routes/history.routes.js';
import playlistRouter from './routes/playlist.routes.js';


    dotenv.config();

    const app = express();

    // Middleware to parse JSON request bodies
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    const allowedOrigins = ['http://localhost:5173'];
    app.use(cors({
        origin: allowedOrigins,
        credentials: true,  // Allow credentials (cookies, auth headers)
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Use auth router for authentication routes
    app.use('/api/auth', authRouter);
    app.use('/api/user', userRouter);
    // app.use('/api/mood', moodRouter);

    app.use("/api/auth/spotify", spotifyRouter);
    app.use("/api/mood",moodRouter);
    app.use("/api/",historyRouter);
    app.use("/api/user/playlist",playlistRouter);

    // Connect to the MongoDB database
    connectDB();
    connectCloudinary();

    // Define the port (use the environment variable or fallback to 3000)
    const port = process.env.PORT || 3000;

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
        // console.log(process.env.CLOUDINARY_NAME);
        // console.log(process.env.CLOUDINARY_API_KEY);
        // console.log(process.env.CLOUDINARY_API_SECRET);
        
    });
