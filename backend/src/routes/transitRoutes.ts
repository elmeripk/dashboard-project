import express from 'express';
import { getStopsTre, getAllStops, getStopsMatchingPattern, getNextDeparturesForStop } from '../models/transitData.js';


const transitAPIRouter = express.Router();

transitAPIRouter.get("/", getAllStops);
transitAPIRouter.get("/tre", getStopsTre);
transitAPIRouter.get("/stops", getStopsMatchingPattern);
transitAPIRouter.get("/schedule", getNextDeparturesForStop);


export default transitAPIRouter;