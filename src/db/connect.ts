import mongoose from "mongoose";

const DB_URL: string = 'mongodb://localhost:27017/trada';

const connectToDatabase = async () =>{
    try {
        await mongoose.connect(DB_URL)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);  

    if (error instanceof mongoose.Error) {
        console.error('MongoDB Connection Error:', error.message);
  
        setTimeout(() => {
          console.log('Retrying connection...');
          connectToDatabase();
        }, 3000);
      } else {

        console.error('Other Error:', error);

      }  
    }
}

export default connectToDatabase;