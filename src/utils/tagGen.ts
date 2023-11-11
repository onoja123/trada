import User from '../models/user.model';
import { Iuser } from "../types/interfaces/user.inter";

declare global {
    namespace Express {
      interface Request {
        user?: Iuser;
      }
    }
  }


async function generateTagNumber(): Promise<String> {
    const lastUser = await User.findOne({}, {}, { sort: { 'createdAt': -1 } });
  
    let count = 1;
    if (lastUser && lastUser.tagNumber) {
        const lastTagNumber = lastUser.tagNumber.slice(3);
        count = parseInt(lastTagNumber, 10) + 1;
    }
  
    const formattedCount = count.toString().padStart(3, '0');
    const tagNumber = `TRA${formattedCount}`;
  
    return tagNumber;
  }

  export default generateTagNumber;