import { BadRequestException } from "@/exceptions";
import Wallet from "@/models/wallet";
import { generateQRCode } from "./generateQR";
import { IWallet } from "@/interfaces";

export const createWallet = async (userId: string): Promise<IWallet> => {
    try {
        const wallet = new Wallet({
            balance: 0,
            user: userId,
        });

        await wallet.save();

        if (!wallet._id) {
            throw new BadRequestException("Failed to create wallet");
        }

        return wallet;
    } catch (error) {
        throw new BadRequestException(`Failed to create wallet: ${error.message}`);
    }
};
