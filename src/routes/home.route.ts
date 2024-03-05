import * as path from 'path';
import { Router, type Request, type Response } from 'express';

const HomeRoute: Router = Router();

HomeRoute.get('/', (_req: Request, res: Response) => {
    try {
        res.sendFile(path.join(__dirname, '../../public/home.html'));
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.toString(),
        });
    }
});

export default HomeRoute;