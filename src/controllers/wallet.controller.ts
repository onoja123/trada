import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import User from '../models/user.model';
import Wallet from '../models/wallet.model';
import {
     fundWalletWithCard,
     transferToBank
     } from '../services/wallet.service';
import Transaction from '../models/transaction.model';

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Get user wallet
 * @route `/api/wallet/getwallet`
 * @access PRIVATE
 * @type GET
 */

export const getWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Check if the user is active
        if (!user.isActive) {
            return next(new AppError('User is not active', 404));
        }

        // Find the user's wallet and populate transactions
        const wallet = await Wallet.findOne({ _user: req.user })
            .populate({
                path: '_transactions',
                options: {
                    sort: {
                        date: -1,
                    },
                },
            });

        if (!wallet) {
            return next(new AppError('Wallet not found', 404));
        }

        res.status(200).json({
            success: true,
            data: wallet,
        });
    } catch (error) {
        console.error('Error in getWallet:', error);
        return next(new AppError('Internal server error', 500));
    }
});


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description send Money to a trada user
 * @route `/api/wallet/sendmoney`
 * @access PRIVATE
 * @type POST
 */
export const sendMoneyToUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }

        // Find the user by their _id
        const sender = await User.findOne({ _id: req.user._id }).select('+wallet');

        if (!sender || !sender.isActive) {
            return next(new AppError('Invalid user or account not verified', 404));
        }

        // Check if the user has a wallet
        const senderWallet = await Wallet.findOne({ _user: sender._id });

        if (!senderWallet) {
            return next(new AppError("You don't have a wallet", 404));
        }

        const { amount, recipient, memo } = req.body;

        // Validate the input
        if (!amount || !recipient) {
            return next(new AppError("Please enter an amount to send and a recipient", 400));
        }

        // Check if memo is provided and validate its length
        if (memo !== undefined && memo.length > 50) {
            return next(new AppError("Memo can't be longer than 50 characters", 400));
        }

        // You can only send a minimum of $2
        if (amount < 2) {
            return next(new AppError("You can only send a minimum of $2", 400));
        }

        // Check if the amount to send is more than the user's balance
        if (amount > senderWallet.balance) {
            return next(new AppError(`You can't send more than $${senderWallet.balance}`, 400));
        }

        // Find the recipient by username or tagNumber
        const recipientUser = await User.findOne({ $or: [{ username: recipient }, { tagNumber: recipient }] });

        if (!recipientUser || !recipientUser.isActive) {
            return next(new AppError('Recipient not found or account not verified', 404));
        }

        // Perform the transaction (subtract from sender, add to recipient)
        senderWallet.balance -= amount;

        // Save the updated wallet balances
        await senderWallet.save();

        // Create transaction records
        const senderTransaction = new Transaction({
            sender: sender._id,
            recipient: recipientUser._id,
            amount: amount,
            type: 'Debit',
            paymentMethod: 'wallet',
            reference: 'Send Money',
            date: new Date(),
        });

        const recipientTransaction = new Transaction({
            sender: sender._id,
            recipient: recipientUser._id,
            amount: amount,
            type: 'Credit',
            paymentMethod: 'wallet',
            reference: 'Receive Money',
            date: new Date(),
        });

        // Save the transaction records
        await senderTransaction.save();
        await recipientTransaction.save();

        res.status(200).json({
            success: true,
            message: `Successfully sent $${amount} to ${recipientUser.username}`,
            transaction: {
                sender: senderTransaction,
                recipient: recipientTransaction,
            },
        });
    } catch (error) {
        console.error('Error sending money:', error);
        return next(new AppError('Internal server error', 500));
    }
});


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description fund wallet
 * @route `/api/wallet/fundwalbank`
 * @access PRIVATE
 * @type POST
 */
export const fundWalletBanktransfer = catchAsync(async(req:Request, res:Response, next: NextFunction)=>{
    try {
        if (!req.user) {
            return next(new AppError(
                'User not authenticated', 
                401
            ));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError(
                'User not found', 
                404
            ));
        }

        const wallet = await Wallet.findOne({ _user: req.user })
        .populate({
            path: '_transactions',
            options: {
                sort: {
                    date: -1,
                },
            },
        });

    if (!wallet && user.isActive === false) {
        return next(new AppError(
            'Wallet not found', 
            404
        ));
    }
    
    
    } catch (error) {
        return next(new AppError(
            'Internal server error', 
            500
        ))  
    }
})

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description fund wallet
 * @route `/api/wallet/fundwalcard`
 * @access PRIVATE
 * @type POST
 */
export const fundWalletCard = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError(
                'User not authenticated', 
                401
            ));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError(
                'User not found', 
                404
            ));
        }

        const { cardNumber, cardExpiry, cardCVV, amount } = req.body;

        // Basic input validation
        if (!cardNumber || !cardExpiry || !cardCVV || !amount) {
            return next(new AppError(
                'Card details and amount are required', 
                400
            ));
        }

        const response = await fundWalletWithCard(cardNumber, cardExpiry, cardCVV, amount);

        const wallet = await Wallet.findOneAndUpdate(
            { _user: user },
            { $inc: { balance: amount } },
            { new: true }
        );

        if (!wallet) {
            return next(new AppError(
                'Wallet not found',
                404
            ));
        }

        // Create a transaction record
        const transaction = new Transaction({
            sender: user._id,
            recipient: user._id,
            amount: amount,
            type: 'credit', 
            paymentMethod: 'card', 
            reference: 'Funding with card',
            date: new Date(),
        });

        // Save the transaction record
        await transaction.save();

        // Handle the response accordingly
        res.status(response.status).json({
            success: true,
            message: 'Wallet funded successfully',
            wallet: wallet, 
        });

    } catch (error) {
        console.error('Error funding wallet with card:', error);
        if (error instanceof AppError) {
            return next(error);
        } else {
            return next(new AppError(
                'Internal server error', 
                500
            ));
        }
    }
});

/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description request money from another user
 * @route `/api/wallet/request`
 * @access PRIVATE
 * @type POST
 */
export const requestFunds = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, tagNumber, amount } = req.body;

        if (!username && !tagNumber) {
            return next(new AppError(
                'Username or tagNumber is required', 
                400
            ));
        }

        if (!amount || isNaN(amount)) {
            return next(new AppError(
                'Invalid or missing amount', 
                400
            ));
        }

        // Find the user by username or tagNumber
        const recipient = await User.findOne({ $or: [{ username }, { tagNumber }] });

        if (!recipient) {
            return next(new AppError(
                'Recipient not found', 
                404
            ));
        }

        // Logic to send a request for funds to the recipient
        // This could involve creating a request in your database or triggering a notification

        res.status(200).json({
            success: true,
            message: `Request for funds sent to ${recipient.username}`,
        });
    } catch (error) {
        console.error('Error requesting funds:', error);
        return next(new AppError('Internal server error', 500));
    }
});


/**
 * @author Okpe Onoja <okpeonoja18@gmail.com>
 * @description Transfer money from wallet to bank account
 * @route `/api/wallet/trasnfertobank`
 * @access PRIVATE
 * @type POST
 */
export const transferToBankFromWalletHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError(
                'User not authenticated', 
                401
            ));
        }

        // Find the user by their _id
        const user = await User.findOne({ _id: req.user._id });

        if (!user) {
            return next(new AppError(
                'User not found', 
                404
            ));
        }

        const { account_bank, account_number, amount, currency, narration } = req.body;

        // Basic input validation
        if (!account_bank || !account_number || !amount || !currency || !narration) {
            return next(new AppError(
                'Please fill in the required fields', 
                400
            ));
        }

        // Ensure the user has at least 20 in balance after deducting 8
        const minimumBalanceAfterDeduction = 20;
        const requiredBalance = amount + 8;

        // if (user.wallet.balance < requiredBalance) {
        //     return next(new AppError(`Insufficient funds. You need at least $${requiredBalance} in your wallet.`, 400));
        // }

        // // Deduct 8 from the user's balance
        // const deductedAmount = 8;
        // user.wallet.balance -= deductedAmount;
        // await user.wallet.save();

        const response = await transferToBank(account_bank, account_number, amount, currency, narration);


        const wallet = await Wallet.findOneAndUpdate(
            { _user: user, balance: { $gte: amount } },
            { $inc: { balance: -amount } },
            { new: true }
        );

        if (!wallet) {
            return next(new AppError(
                'Wallet not found',
                404
            ));
        }

        // Create a transaction record for the sender
            const senderTransaction = new Transaction({
                sender: user._id,
                recipient: account_bank, // Bank transfer, so no specific recipient
                amount: amount,
                type: 'debit', // Assuming transferring to bank is a debit transaction
                paymentMethod: 'wallet',
                reference: 'Transfer to Bank',
                date: new Date(),
            });
    
            // Save the transaction record
            await senderTransaction.save();


        // Create a transaction record for the sender
        const receiverTransactionRecord = new Transaction({
            sender: user._id, // Assuming the user initiates the transfer
            recipient: account_bank, // Bank transfer, so no specific recipient
            amount: amount,
            type: 'credit', // Assuming receiving from user's wallet is a credit transaction
            paymentMethod: 'bank',
            reference: 'Transfer from Wallet',
            date: new Date(),
        });

        // Save the transaction record
        await receiverTransactionRecord.save();

        // Handle the response accordingly
        res.status(response.status).json({
            success: true,
            message: 'Funds transferred to bank successfully',
            wallet: wallet, 
        });

    } catch (error) {
        console.error('Error transferring funds to bank:', error);
        if (error instanceof AppError) {
            return next(error); 
        } else {
            return next(new AppError(
                'Internal server error', 
                500
            ));
        }
    }
});

export const makePaymentFromQr = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the QR code data from the request body
        const { qrData, amount } = req.body;

        // Validate the input
        if (!qrData || !amount) {
            return next(new AppError(
                'QR data and amount are required',
                400
            ));
        }

        // Extract user ID and other information from the QR code data
        const [userId, firstname] = qrData.split('/').slice(-2);

        // Find user by ID
        const sender = await User.findById(userId).select('+wallet');

        // Check if sender exists
        if (!sender) {
            return next(new AppError(
                'Sender not found',
                404
            ));
        }

        // Check if the sender has a wallet
        const senderWallet = await Wallet.findOne({ _user: sender._id });

        if (!senderWallet) {
            return next(new AppError("Sender doesn't have a wallet", 404));
        }

        // Find receiver by firstname
        const receiver = await User.findOne({ firstname: firstname }).select('+wallet');

        // Check if receiver exists
        if (!receiver) {
            return next(new AppError(
                'Receiver not found',
                404
            ));
        }

        // Check if the receiver has a wallet
        const receiverWallet = await Wallet.findOne({ _user: receiver._id });

        if (!receiverWallet) {
            return next(new AppError("Receiver doesn't have a wallet", 404));
        }

        // Perform the payment logic
        // Deduct the specified amount from the sender's wallet balance
        if (amount > senderWallet.balance) {
            return next(new AppError(`Insufficient funds in the wallet`, 400));
        }

        senderWallet.balance -= amount;

        // Add the specified amount to the receiver's wallet balance
        receiverWallet.balance += amount;

        // Create a transaction record for the sender
        const senderTransaction = new Transaction({
            sender: sender._id,
            recipient: receiver._id,
            amount: amount,
            type: 'debit', // Assuming deducting from the sender's wallet is a debit transaction
            paymentMethod: 'qr_code',
            reference: 'QR Code Payment',
            date: new Date(),
        });

        // Create a transaction record for the receiver
        const receiverTransaction = new Transaction({
            sender: sender._id,
            recipient: receiver._id,
            amount: amount,
            type: 'credit', // Assuming adding to the receiver's wallet is a credit transaction
            paymentMethod: 'qr_code',
            reference: 'QR Code Payment',
            date: new Date(),
        });

        // Save the updated wallet balances and the transaction records
        await senderWallet.save();
        await receiverWallet.save();
        await senderTransaction.save();
        await receiverTransaction.save();

        // Handle the payment response accordingly
        res.status(200).json({
            success: true,
            message: `Payment of $${amount} made successfully from ${sender.firstname} to ${receiver.firstname}`,
        });

    } catch (error) {
        console.error('Error making payment from QR code:', error);
        return next(new AppError(
            'Internal server error',
            500
        ));
    }
});