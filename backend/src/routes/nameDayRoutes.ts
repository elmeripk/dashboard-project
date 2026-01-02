import express from 'express';
import { getNameDays } from '../models/nameDayData';

const nameDayAPIRouter = express.Router();

nameDayAPIRouter.get("/", getNameDays);

export default nameDayAPIRouter;
