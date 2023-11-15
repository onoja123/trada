import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoute from '../src/routes/auth.route';
import userRoute from '../src/routes/user.route';
import walletRoute from '../src/routes/wallet.route'
import billRoute from '../src/routes/bill.route'
import bankRoute from '../src/routes/bank.route';
import globalErrorHandler from './controllers/error.controller';

dotenv.config();
const app: Application = express();

// Middleware
app.use(express.json());

// Use CORS middleware
  /* cors is used to allow cross origin requests */
app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  origin: '*',
  credentials: true,
}));

// Use the  routes

app.use('/api/v1/auth', authRoute);

app.use('/api/v1/bank', bankRoute);

app.use('/api/v1/user', userRoute);

app.use('/api/v1/bill', billRoute);

app.use('/api/v1/wallet', walletRoute);



app.use(globalErrorHandler)

app.get('/', (req:Request, res:Response) => {
  res.send('Server live ⚡️');
});

app.all('*', (req: Request, res:Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    messsage: `${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
});

export default app;