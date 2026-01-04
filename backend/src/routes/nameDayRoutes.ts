import express from 'express';
import { getNameDays } from '../models/nameDayData.js';

const nameDayAPIRouter = express.Router();

nameDayAPIRouter.get("/", getNameDays);

export default nameDayAPIRouter;
