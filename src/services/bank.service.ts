import Bank from '@/models/bank';
import User from '@/models/user';
import {
    BadRequestException,
    ConflictException,
    NotFoundException
} from '@/exceptions';
import { IBank } from '@/interfaces';
import { SettlementDto } from '@/validators';
import { FlwService } from '@/core/services';
export class BankService {
    public flw = new FlwService();

    public async addBank(userId: string, data: SettlementDto): Promise<IBank> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const existsAccountsCount = await Bank.countDocuments({ user: userId });

        if (existsAccountsCount >= 3) {
            throw new BadRequestException("You can only create 3 accounts");
        }

        const existsAccount = await Bank.findOne({ user: userId, accountNumber: data.accountNumber });

        if (existsAccount) {
            throw new ConflictException("Bank Already Exists");
        }

        const newBank = new Bank({
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            accountName: data.accountName,
            user: userId,
        });

        await newBank.save();

        return newBank;
    }

    public async editBank(userId: string, accountId: string, data: SettlementDto): Promise<IBank> {
        const account = await Bank.findOne({
            _id: accountId,
            user: userId,
        });

        if (!account) {
            throw new NotFoundException("Account not found");
        }

        account.accountNumber = data.accountNumber;
        account.accountName = data.accountName;
        account.bankName = data.bankName;

        await account.save();

        return account;
    }

    public async deleteBank(accountId: string): Promise<string> {
        const bank = await Bank.findByIdAndDelete(accountId);

        if (!Bank) {
            throw new NotFoundException("Account not found");
        }

        return;
    }

    public async getUserBanks(userId: string): Promise<any> {
        const Banks = await Bank.find({ user: userId });

        if (Banks.length === 0) {
            return { message: 'No Bank Accounts Yet' };
        }

        return Banks;
    }

    public async getBanks(): Promise<any> {
        const response = await this.flw.getBanks();

        if (response.status !== 200) {
            throw new BadRequestException("Something went wrong");
        }

        const banks = response.data;

        return banks;
    }
}
