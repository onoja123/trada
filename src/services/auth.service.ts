import { tokenBuilder } from "@/core/utils/createToken";
import User from '@/models/user';
import { generateOtp, verifyOtp } from '@/core/utils';
import otpMaster from '@/models/otp';
import { compare, hash } from 'bcrypt';
import { CreateUserDto, LoginDto, VerifyForgetDto, VerifyOtpDto } from "@/validators";
import { IUser, AuthInterface } from "@/interfaces";
import { sendOTP, verifyOTP, createWallet } from "@/core/utils";
import { redis } from "@/core/services";
import {
    BadRequestException,
    ConflictException,
    NotFoundException,
    UnauthorizedException
} from "@/exceptions";
import { OtpType } from "@/enums";

export class AuthService {
    public async signUp(data: CreateUserDto): Promise<void> {
        const existPhone: IUser = await User.findOne({ phone: data.phone });

        if (existPhone) {
            throw new ConflictException('The Phone number is already taken');
        }

        const sendOtp = await sendOTP(data.phone, "sms");

        const isOtpVerifiedKey = `isOtpVerified-${data.phone}`;
        const userKey = `user-${data.phone}`;

        redis.client.set(isOtpVerifiedKey, sendOtp);
        redis.client.set(
            userKey,
            JSON.stringify({
                phone: data.phone
            })
        );

        if (!sendOtp) {
            throw new BadRequestException("Unable to Send OTP Code");
        }

        return;
    }

    public async verify(data: VerifyOtpDto): Promise<IUser> {
        const userJson = await redis.client.get(`user-${data.phone}`);

        if (!userJson) {
            throw new NotFoundException("User not found");
        }

        const user = JSON.parse(userJson);

        if (data.resend === "true") {
            await sendOTP(user.phone, "sms");
        }

        const isOtpVerified = await redis.client.get(`isOtpVerified-${data.phone}`);

        if (!user || !isOtpVerified) {
            throw new BadRequestException("User data is missing");
        }

        const existingUser = await User.findOne({ phone: user.phone });

        if (existingUser) {
            throw new ConflictException("User already exists");
        }

        if (isOtpVerified === "pending") {
            console.log("Verifying OTP:", user.phone, data.otp);
            const verified = await verifyOTP(user.phone, data.otp);

            console.log("Verification result:", verified);

            if (verified === "approved") {
                redis.client.set(`isOtpVerified-${data.phone}`, verified);
            }
        }

        const { phone } = user;

        const newUser = new User({
            phone,
            isActive: true,
        });

        await newUser.save();
        await createWallet(newUser.id)

        return newUser;
    }

    public async login(data: LoginDto): Promise<AuthInterface> {
        const user = await User.findOne({ phone: data.phone });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const passwordMatch = await compare(data.password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const token = await tokenBuilder(user);
        const response = {
            user: user,
            accessToken: token.accessToken,
        };
        return response;
    }

    public async forgetPassword(email: string): Promise<IUser> {
        const user = await User.findOne({ email });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 10);
        const otp: string = generateOtp(6);

        const newOtp = new otpMaster({
            userId: user._id,
            type: OtpType.FORGET,
            otp,
            otpExpiration: new Date(tokenExpiration),
        });
        await newOtp.save();

        return user;
    }

    public async VerifyForgetPassword(data: VerifyForgetDto): Promise<IUser> {
        const user = await User.findOne({ email: data.email });
        if (!user) {
            throw new BadRequestException('You have entered an invalid email address.');
        }

        let isOtpValid = await verifyOtp(user._id, data.otp, OtpType.FORGET);
        if (!isOtpValid) {
            throw new BadRequestException('This OTP has Invalid.');
        }
        const hashPassword = await hash(data.password, 12);
        user.password = hashPassword;

        await user.save();

        await otpMaster.findByIdAndDelete(isOtpValid);

        return user;
    }
}