import { ITransaction, TransactionResponse } from '@/interfaces';
import Transaction from '@/models/transaction';
import { NotFoundException } from '@/exceptions';

export class TransactionService {
    public async getAllTransactions(): Promise<TransactionResponse> {
        const transactions = await Transaction.find();

        const totalAmount = transactions.reduce((
            total,
            transaction
        ) => total + transaction.amount, 0);

        return {
            transactions,
            totalAmount
        };
    }

    public async getTransaction(userId: string, transactionId: string): Promise<ITransaction> {
        const transacion = await Transaction.findOne({
            _id: transactionId,
            user: userId
        });

        if (!transacion) {
            throw new NotFoundException("Transaction not found")
        };

        return transacion;
    }

    public async getTransactions(userId: string): Promise<ITransaction[]> {
        const transactions = await Transaction.find({ user: userId })
            .sort({ createdAt: -1 });

        return transactions;
    }
}
