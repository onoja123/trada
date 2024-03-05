import { IRequest } from '@/interfaces';
import User from '@/models/user';
import Wallet from '@/models/wallet';
import Transaction from '@/models/transaction';
import Request from '@/models/request.model';
import { sendMoneyRequestEmail } from '@/core/utils';
import { BadRequestException, ConflictException, NotFoundException } from '@/exceptions';
import { RequestFundsDto } from '@/validators';
import generateReference from '@/core/utils/reference';

export class RequestService {
    public async requestFunds(userId: string, data: RequestFundsDto): Promise<IRequest> {
        const requester = await User.findById(userId);

        if (!requester || !requester.isActive) {
            throw new BadRequestException('Invalid user or account not verified');
        }

        const { amount, username, tagNumber, reason } = data;

        if (!username && !tagNumber) {
            throw new BadRequestException('Either username or tagNumber is required to request funds');
        }

        // Find the user to request money from using either username or tagNumber
        const recipientUser = await User.findOne({ $or: [{ username }, { tagNumber }] });

        if (!recipientUser || !recipientUser.isActive) {
            throw new BadRequestException('Recipient not found or account not verified');
        };

        const newRequest = new Request({
            user: requester._id,
            amount,
            reason,
            status: "Pending",
            receiver: recipientUser.id,

        })

        await sendMoneyRequestEmail(recipientUser.email, requester.firstname, recipientUser.firstname, amount, reason);

        return newRequest;
    }

    public async approveRequest(userId: string, requestId: string): Promise<IRequest> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const moneyRequest = await Request.findById(requestId);

        if (!moneyRequest) {
            throw new NotFoundException('Money request not found');
        }

        if (moneyRequest.status !== 'Pending') {
            throw new ConflictException('Money request has already been processed');
        }

        const { amount, receiver } = moneyRequest;

        // Find the wallet of the user who approves the request
        const approverWallet = await Wallet.findOne({ user: user });

        if (!approverWallet) {
            throw new NotFoundException('Wallet not found for the user who approves the request');
        }

        // Find the wallet of the user who made the request
        const requesterWallet = await Wallet.findOne({ user: receiver });

        if (!requesterWallet) {
            throw new NotFoundException('Wallet not found for the user who made the request');
        }

        // Check if the approver has enough balance
        if (approverWallet.balance < amount) {
            throw new BadRequestException('Insufficient balance to approve the request');
        }

        // Update balances and perform transactions
        approverWallet.balance -= amount;
        requesterWallet.balance += amount;

        // Save the updated wallet balances
        await approverWallet.save();
        await requesterWallet.save();

        // Create transaction records
        const reference = generateReference("transaction")
        const approverTransaction = new Transaction({
            sender: user._id,
            amount: amount,
            type: 'Debit',
            paymentMethod: 'wallet',
            reference: reference,
            status: "Successful",
            recipient: receiver,
        });

        const requesterTransaction = new Transaction({
            title: 'Money Request Approved',
            sender: user._id,
            amount: amount,
            type: 'Credit',
            paymentMethod: 'wallet',
            reference: reference,
            status: "Successful",
            recipient: receiver,
        });

        // Save the transaction records
        await approverTransaction.save();
        await requesterTransaction.save();

        // Update money request status to 'Approved'
        moneyRequest.status = 'Approved';
        await moneyRequest.save();
        return moneyRequest;
    }

    public async declineRequest(requestId: string): Promise<IRequest> {
        const moneyRequest = await Request.findById(requestId).populate('user', 'firstname email');

        if (!moneyRequest) {
            throw new NotFoundException('Money request not found');
        }

        if (moneyRequest.status !== 'Pending') {
            throw new ConflictException('Money request has already been processed');
        }

        // Update money request status to 'Declined'
        moneyRequest.status = 'Declined';
        await moneyRequest.save();

        return moneyRequest;
    }
}