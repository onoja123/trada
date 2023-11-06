import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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