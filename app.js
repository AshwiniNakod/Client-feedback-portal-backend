import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { router } from './router/index.js';
import { ErrorHandlingMiddleware } from './assets/ErrorHandling/ErrorManagamentController.js';
import connectDb from './DB/connectionDb.js';
dotenv.config();
const app = express()
app.use(cors())
app.use(express.json())
await connectDb(process.env.DATABASE_URL)
app.use('/api',router)
app.use(ErrorHandlingMiddleware);
console.log(process.env.NODE_ENV)
app.listen(process.env.PORT,()=>console.log(`App started at port ${process.env.PORT}`))