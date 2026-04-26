import 'dotenv/config';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';

import bookingRoutes from './routes/bookingRoutes.js';
import trainroutes from './routes/trainRoutes.js';
import seatroutes from './routes/seatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app=express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/api/booking',bookingRoutes);
app.use('/api/trains',trainroutes);
app.use('/api/seats',seatroutes);
app.use('/api/auth',authRoutes);

app.use(errorHandler);

const Port=8000;

app.listen(Port,()=>console.log(`Server started at port :${Port}`));
