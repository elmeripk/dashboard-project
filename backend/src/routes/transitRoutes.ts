import express from 'express';
import { getAllRoutes } from '../models/transitData.js';


const transitAPIRouter = express.Router();

transitAPIRouter.get("/", getAllRoutes);

export default transitAPIRouter;