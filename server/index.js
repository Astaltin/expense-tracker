import cors from 'cors';
import express from "express";
import helmet from 'helmet';

import apiRouter from './apiRouter.js';

const app = express()

app.use(helmet())
app.use(cors({
   allowedHeaders: ['Content-Type'],
   credentials: true,
   methods: ['GET', 'POST', 'PATCH', 'DELETE'],
   origin: process.env.CORS_ORIGIN
}))
app.use(express.json())

app.use('/api', apiRouter)

export default app