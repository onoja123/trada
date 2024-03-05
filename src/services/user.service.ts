import User from '@/models/user';
import Profile from '@/models/profile';
import Kyc from '@/models/kyc';
import Wallet from '@/models/wallet';
import { cloudinary } from '@/core/config';
import { IAccount, IProfile, IUser, UserResponse, UsersResponse } from '@/interfaces';
import { compare, hash } from 'bcrypt';
import { generateTagNumber, tokenBuilder } from '@/core/utils';
import { BadRequestException, ConflictException, NotFoundException } from '@/exceptions';
import { ChangePasswordDto, InitiateBvnDto, SetupAddressDto, setUpAccountDto } from '@/validators';
import { generateQRCode } from '@/core/utils/generateQR';
import { FlwService } from '@/core/services';

export class UserService {
    public flw = new FlwService();

    public async getUsers(): Promise<UsersResponse> {
        const users = await User.find().populate('role');
        const totalUsers = await User.countDocuments();

        if (!users) {
            throw new NotFoundException('No Users Found.');
        }

        return {
            users,
            totalUsers,
        };
    }

    public async getUser(userId: string): Promise<UserResponse> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException('User Not Found.');
        }

        return {
            user,
            profile: { ...user.profile },
        };
    }

    public async setUpAddress(userId: string, data: SetupAddressDto): Promise<IProfile> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException('User Not Found.');
        }

        const {
            country,
            state,
            apartment,
            street,
            city,
            postalCode
        } = data;

        // Find the associated Profile model
        const profile = await Profile.findOne({ _id: user.profile });

        if (!profile) {
            throw new NotFoundException('Profile Not Found.');
        }

        // Update the profile fields
        profile.country = country || profile.country;
        profile.state = state || profile.state;
        profile.apartment = apartment || profile.apartment;
        profile.street = street || profile.street;
        profile.city = city || profile.city;
        profile.postalCode = postalCode || profile.postalCode;

        // Save the updated profile
        const savedProfile = await profile.save();

        return savedProfile;
    }

    public async setUpAccount(userId: string, data: setUpAccountDto): Promise<IUser> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException('User Not Found.');
        }

        const { email, username } = data;

        // Check if the username or email already exists
        const existsUser = await User.findOne({ username });
        if (existsUser) {
            throw new ConflictException(`User ${username} already exists`);
        }

        const existsEmail = await User.findOne({ email });
        if (existsEmail) {
            throw new ConflictException(`User ${email} already exists`);
        }

        // Generate tagNumber and QR code
        const tagNumber = await generateTagNumber();
        const qrcode = await generateQRCode(username);

        // Hash the password
        const hashPassword = await hash(data.password, 10);

        // Update or create a new user
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                $setOnInsert: {
                    ...data,
                    password: hashPassword,
                    tagNumber,
                    qrcode,
                    isProfileCompleted: true,
                },
            },
            {
                upsert: true,
                new: true,
            }
        );

        return updatedUser;
    }

    public async initiateBvnVerification(userId: string, data: InitiateBvnDto): Promise<void> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException('User Not Found.');
        }

        const verificationData = {
            bvn: data.bvn,
            firstname: user.firstname,
            lastname: user.lastname,
        };

        const isBvnValid = await this.flw.initateBvn(verificationData);
        console.log(isBvnValid);

        return;
    }

    public async verifyAndCreateAccount(payload: any): Promise<void> {
        if (!payload || !payload.event) {
            throw new BadRequestException('Invalid payload');
        }

        switch (payload.event) {
            case 'bvn.completed':
                const { data } = payload;

                if (!data) {
                    throw new BadRequestException('Invalid data in the payload');
                }

                if (data.status !== 'COMPLETED') {
                    throw new BadRequestException('BVN verification status is not COMPLETED');
                }

                const user = await User.findOne({
                    $or: [
                        { _id: data.user_id },
                        { bvn: data.bvn },
                    ],
                });

                if (!user) {
                    throw new NotFoundException('User not found for BVN verification');
                }

                if (
                    user.firstname.toLowerCase() !== data.firstname.toLowerCase() ||
                    user.lastname.toLowerCase() !== data.lastname.toLowerCase()
                ) {
                    user.verificationStatus = 'rejected';
                    await user.save();

                    // Additional logic for rejected BVN verification

                    throw new BadRequestException('BVN verification failed due to names mismatch');
                } else {
                    user.verificationStatus = 'approved';
                    user.bvn = data.bvn;

                    const accountData = {
                        bvn: data.bvn,
                        email: user.email,
                    };

                    const account = await this.flw.virtualAccount(accountData);

                    if (account && account.status === 'success') {
                        // Assume the wallet always exists
                        const wallet = await Wallet.findOne({ _user: user._id });

                        // Update the wallet with account details
                        wallet.account = {
                            account_bank: account.bank_name,
                            account_number: account.account_number,
                            flwRef: account.flw_ref,
                            orderRef: account.order_ref,
                        };

                        await wallet.save();
                    } else {
                        throw new BadRequestException('Failed to create virtual account');
                    }

                    const kycData = {
                        user: user._id,
                        firstname: data.firstname,
                        lastname: data.lastname,
                        bvn: data.bvn,
                    };

                    const newKyc = new Kyc(kycData);
                    await newKyc.save();

                    return;
                }

            default:
                throw new BadRequestException('Unsupported event type');
        }
    }


    public async updateAvatar(userId: string, avatar: string): Promise<IUser> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException('User Not Found.');
        }

        if (avatar) {
            const result = await cloudinary.uploader.upload(avatar, {
                folder: 'trada',
            });

            const image = result.secure_url;
            user.profile.image = image;
        }

        const updatedUser = await user.save();

        return updatedUser;
    }

    public async changePassword(userId: string, data: ChangePasswordDto): Promise<IUser> {
        const user = await User.findById(userId);

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const isMatch = await compare(data.oldPassword, user.password);

        if (!isMatch) {
            throw new ConflictException('Old Password is incorrect');
        }

        const hashedPassword = await hash(data.newPassword, 12);
        user.password = hashedPassword;

        await user.save();

        return user;
    }
}
