import { Request, Response, NextFunction } from 'express';

export const verifyWebhookSignature = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const SECRET_HASH: string = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH!;
    const SIGNATURE = req.headers['verif-hash'];

    if (!SIGNATURE || (SIGNATURE as string) !== SECRET_HASH) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid signature',
      });
    }

    return next();
  } catch (error) {
    console.error('Error in verifyWebhookSignature:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during webhook signature verification',
    });
  }
};
