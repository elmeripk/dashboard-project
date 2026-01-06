import express from 'express';
import { getStopsTre, getAllStops, getStopsMatchingPattern } from '../models/transitData.js';


const transitAPIRouter = express.Router();

transitAPIRouter.get("/", getAllStops);
transitAPIRouter.get("/tre", getStopsTre);
transitAPIRouter.get("/stops", getStopsMatchingPattern);


export default transitAPIRouter;