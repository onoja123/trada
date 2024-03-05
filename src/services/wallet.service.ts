import { IUser, IWallet } from '@/interfaces';
import User from '@/models/user';
import Wallet from '@/models/wallet';
import Transaction from '@/models/transaction';
import { compare, hash } from 'bcrypt';
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException
} from '@/exceptions';
import { ChangePinDto, QrPayDto, ResetPinDto, SendToUSerDto, TransferDto } from '@/validators';
import { generateOtp, verifyOtp } from '@/core/utils';
import otpMaster from '@/models/otp';
import { OtpType } from '@/enums';
import { sendForgetPinEmail } from '@/core/utils';
import generateReference from '@/core/utils/reference';
import { FlwService } from '@/core/services';

export class WalletService {
    public flw = new FlwService();

    public async getBalance(userId: string): Promise<IWallet> {
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            throw new NotFoundException("Wallet not found");
        };

        return wallet;
    }

    public async setPin(userId: string, pin: string): Promise<IWallet> {
        let wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            throw new NotFoundException("Wallet not found");
        }

        if (wallet.pin) {
            throw new ConflictException("Pin already set");
        }

        const hashPin = await hash(pin, 12);
        wallet.pin = hashPin;

        const savedWallet = await wallet.save();

        if (!savedWallet) {
            throw new InternalServerErrorException("Failed to save wallet");
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        return wallet;
    }

    public async changePin(userId: string, data: ChangePinDto): Promise<IWallet> {
        let wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            throw new NotFoundException('Wallet not found');
        }

        const isMatch = await compare(data.oldPin, wallet.pin);
        if (!isMatch) {
            throw new BadRequestException('Old pin is incorrect');
        }

        const hashPin = await hash(data.newPin, 12);
        wallet.pin = hashPin;

        const savedWallet = await wallet.save();
        if (!savedWallet) {
            throw new InternalServerErrorException('Failed to save wallet');
        }

        return savedWallet;
    }

    public async requestForgetPin(userId: string): Promise<IUser> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            throw new NotFoundException("Wallet not found");
        }

        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);

        const otp: string = generateOtp(6);

        let newOtp = new otpMaster({
            userId: user._id,
            type: OtpType.FORGET_PIN,
            otp,
            otpExpiration: new Date(tokenExpiration),
        });
        await newOtp.save();

        await sendForgetPinEmail(user.email, user.firstname, otp);

        return user;
    }

    public async resetpin(userId: string, data: ResetPinDto): Promise<IWallet> {
        const user = await User.findById(userId);

        let isOtpValid = await verifyOtp(user._id, data.otp, OtpType.FORGET_PIN);
        if (!isOtpValid) {
            throw new ConflictException("Invalid OTP");
        }

        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            throw new NotFoundException("Wallet not found");
        }

        const hashpin = await hash(data.pin, 12);
        wallet.pin = hashpin;

        await wallet.save();

        await otpMaster.findByIdAndDelete(isOtpValid);

        return wallet;
    }

    public async sendMoneyToUser(userId: string, data: SendToUSerDto): Promise<IWallet> {
        const sender = await User.findOne({ id: userId });

        if (!sender || !sender.isActive) {
            throw new BadRequestException('Invalid user or account not verified');
        }

        // Check if the user has a wallet
        const senderWallet = await Wallet.findOne({ user: sender._id });

        if (!senderWallet) {
            throw new BadRequestException("You don't have a wallet",);
        }

        const { amount, recipient, memo } = data;

        // You can only send a minimum of $2
        if (amount < 2) {
            throw new BadRequestException("You can only send a minimum of $2");
        }

        // Check if the amount to send is more than the user's balance
        if (amount > senderWallet.balance) {
            throw new BadRequestException(`You can't send more than $${senderWallet.balance}`);
        }

        // Find the recipient by username or tagNumber
        const recipientUser = await User.findOne({ $or: [{ username: recipient }, { tagNumber: recipient }] });

        if (!recipientUser || !recipientUser.isActive) {
            throw new BadRequestException('Recipient not found or account not verified');
        }

        // Perform the transaction (subtract from sender, add to recipient)
        senderWallet.balance -= amount;

        // Save the updated wallet balances
        const updatedSenderWallet = await senderWallet.save();

        // Create transaction records
        const senderTransaction = new Transaction({
            sender: sender._id,
            recipient: recipientUser._id,
            amount: amount,
            type: 'Debit',
            paymentMethod: 'wallet',
            reference: 'Send Money',
        });

        const recipientTransaction = new Transaction({
            sender: sender._id,
            recipient: recipientUser._id,
            amount: amount,
            type: 'Credit',
            paymentMethod: 'wallet',
            reference: 'Receive Money',
        });

        // Save the transaction records
        await senderTransaction.save();
        await recipientTransaction.save();

        return updatedSenderWallet;
    }

    public async makeQrPayment(userId: string, data: QrPayDto): Promise<IWallet> {
        const { qrData, amount } = data;

        const [username] = qrData;

        // Find the sender by ID
        const sender = await User.findById(userId);

        // Check if the sender exists
        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        // Check if the sender has a wallet
        const senderWallet = await Wallet.findOne({ user: sender._id });

        if (!senderWallet) {
            throw new BadRequestException("Sender doesn't have a wallet");
        }

        // Find the receiver by username
        const receiver = await User.findOne({ username: username });

        // Check if the receiver exists
        if (!receiver) {
            throw new NotFoundException('Receiver not found');
        }

        // Check if the receiver has a wallet
        const receiverWallet = await Wallet.findOne({ user: receiver._id });

        if (!receiverWallet) {
            throw new BadRequestException("Receiver doesn't have a wallet");
        }

        // Perform the payment operation (subtract from sender, add to receiver)
        if (senderWallet.balance < amount) {
            throw new BadRequestException("Insufficient balance");
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        // Save the updated wallet balances
        await senderWallet.save();
        await receiverWallet.save();

        // Create transaction records
        const reference = generateReference("transaction")
        const senderTransaction = new Transaction({
            title: "QR Payment",
            sender: sender._id,
            recipient: receiver._id,
            amount: amount,
            type: 'Debit',
            paymentMethod: 'wallet',
            reference,
        });

        const receiverTransaction = new Transaction({
            title: "QR Payment",
            sender: sender._id,
            recipient: receiver._id,
            amount: amount,
            type: 'Credit',
            paymentMethod: 'wallet',
            reference,
        });

        // Save the transaction records
        await senderTransaction.save();
        await receiverTransaction.save();

        return senderWallet;
    }

    public async transferToBank(userId: string, data: TransferDto): Promise<IWallet> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Ensure the user has at least 20 in balance after deducting 8
        const minimumBalanceAfterDeduction = 20;
        const requiredBalance = data.amount + 8;

        const userWallet = await Wallet.findOne({ user: userId });

        if (!userWallet || userWallet.balance < requiredBalance) {
            throw new BadRequestException('Insufficient balance for the transfer');
        }

        // Deduct the transfer amount and transaction fee
        const updatedBalance = userWallet.balance - requiredBalance;

        // Perform the transfer
        const response = await this.flw.initiateTransfer(data);

        // Update the user's wallet balance
        const updatedWallet = await Wallet.findByIdAndUpdate(
            userWallet._id,
            { balance: updatedBalance });

        const newTransaction = new Transaction({
            title: "QR Payment",
            sender: user._id,
            amount: data.amount,
            type: 'Debit',
            paymentMethod: 'wallet',
            status: response.status,
            reference: response.reference,
        });
        await newTransaction.save();

        return updatedWallet;
    }
}