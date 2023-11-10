import http from 'http';
import app from './app'
require('dotenv').config();

console.log(process.env.TWILIO_ACCOUNT_SID)
const port = process.env.PORT || 4000;

import connectToDatabase from './db/connect';

const server = http.createServer(app);


// Connect to MongoDB and start the server
connectToDatabase()
  .then(() => {
    console.log('MongoDB connected');
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    console.error('Failed to start server:', err);
});