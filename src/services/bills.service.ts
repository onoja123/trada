import { BadRequestException, ConflictException } from "@/exceptions";
import Transaction from "@models/transaction";
import Wallet from "@models/wallet";
import { BillProduct, BillResponse, FlwPay, FlwValidate } from "@/interfaces";
import { FlwService } from "@/core/services/flutterwave";
import { BillType } from "@/enums";
import { compare } from "bcrypt";
import generateReference from "@/core/utils/reference";

export class BillService {
    private flw = new FlwService();

    public async getBills(categoryName: BillType): Promise<BillProduct[]> {
        if (!Object.values(BillType).includes(categoryName)) {
            throw new BadRequestException("Invalid category name");
        }

        const response = await this.flw.getBills(categoryName);

        const bills = response.data.data;

        return bills;
    }

    public async validateBill(data: FlwValidate): Promise<any> {
        const response = await this.flw.validateBill(data);

        const result = response.data.data;

        return result;
    }

    public async payBill(userId: number, data: FlwPay): Promise<BillResponse> {
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet || !wallet.pin) {
            throw new BadRequestException("Please Set a PIN");
        }

        const isPinMatching: boolean = await compare(data.pin, wallet.pin);

        if (!isPinMatching) {
            throw new ConflictException("Incorrect PIN");
        }

        if (wallet.balance < data.amount) {
            throw new BadRequestException("Insufficient balance");
        }

        const reference: string = generateReference('transaction');
        data.reference = reference;

        // Make the payment
        const response = await this.flw.payBills(data);

        if (response.status !== 200) {
            throw new BadRequestException("Purchase failed");
        }

        const result = response.data.data;

        // Update the wallet balance
        const updatedWallet = await Wallet.findByIdAndUpdate(
            wallet._id,
            {
                $inc: { balance: -data.amount },
            },
            { new: true }
        );

        // Create a new Transaction document
        await Transaction.create({
            title: "Create Transaction",
            reference: reference,
            type: result.type,
            amount: data.amount,
            paymentMethod: "Wallet",
            status: result.status,
            sender: userId,
        })

        return { updatedWallet, result };
    }
}