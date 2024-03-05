import mongoose, { ConnectOptions } from 'mongoose';
import { DB_HOST } from './config';
import Logging from '@/core/utils/logging';

export const connectToDatabase = async function () {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
        } as ConnectOptions);
        Logging.info('Connected to MongoDB.');
    } catch (error) {
        Logging.error('Unable to connect.');
        Logging.error(error);
        process.exit(1);
    }
}
