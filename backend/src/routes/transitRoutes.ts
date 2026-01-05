import express from 'express';
import { getStopsTre, getAllStops } from '../models/transitData.js';


const transitAPIRouter = express.Router();

transitAPIRouter.get("/", getAllStops);
transitAPIRouter.get("/tre", getStopsTre);


export default transitAPIRouter;