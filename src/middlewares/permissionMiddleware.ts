import { ForbiddenException } from '../exceptions';
import { Request, Response, NextFunction } from 'express';

const permit = function (allowedRoles: Array<string>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const payload = req['tokenPayload'];
    if (allowedRoles.includes(payload['role'])) {
      next();
    } else {
      next(
        new ForbiddenException('Access Forbidden'),
      );
    }
  };
};
export default permit;
