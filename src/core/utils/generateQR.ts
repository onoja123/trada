import QRCode from "qrcode";
import { cloudinary } from '../config';

export const generateQRCode = async (data: string): Promise<string> => {
    const code = await QRCode.toDataURL(data);

    const response = await cloudinary.uploader.upload(code, {
        folder: 'qrcodes',
    });

    const result = response.secure_url

    return result;
};