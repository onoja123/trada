import { flw } from "@/core/config";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { BadRequestException } from "@/exceptions";
import {
    BvnInitiate,
    FlwPay,
    FlwTransfer,
    FlwVa,
    FlwValidate,
    FlwVerifyBank
} from "@/interfaces";
import generateReference from "../utils/reference";

export class FlwService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: flw.baseURL,
            headers: flw.headers,
        });
    }

    public async getBills(
        categoryName: string,
        paramValue = 1
    ): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(
                `/bill-categories?${categoryName}=${paramValue}`
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async validateBill(data: FlwValidate): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(
                `/bill-items/${data.item_code}/validate?code=${data.biller_code}&customer=${data.customer}`
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async payBills(data: FlwPay): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post(
                `/bills`,
                data
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async virtualAccount(data: FlwVa): Promise<any> {
        try {
            data.is_permanent = true;
            data.tx_ref = generateReference("account")
            const response: AxiosResponse = await this.axiosInstance.post(
                `/virtual-account-numbers`,
                data
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async getBanks(): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(`/banks/NG`);

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async verifyAccount(data: FlwVerifyBank): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post(
                `/accounts/resolve`,
                data
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async initiateTransfer(data: FlwTransfer): Promise<any> {
        try {
            data.reference = generateReference("transfer");
            const response: AxiosResponse = await this.axiosInstance.post(
                `/transfers`,
                data
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async retryTransfer(id: string): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post(
                `/transfers/${id}/retries`,
                {}
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async getTransfers(): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse =
                await this.axiosInstance.get(`/transfers`);

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async getTransfer(transferId: string): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(
                `/transfers/${transferId}`
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status);
        }
    }

    public async initateBvn(data: BvnInitiate): Promise<AxiosResponse> {
        try {
            data.redirect_url = "http://localhost/";
            const response: AxiosResponse = await this.axiosInstance.post(
                `/bvn/verifications`,
                data,
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status)
        }
    }

    public async verifyBvn(reference: string): Promise<AxiosResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(
                `/bvn/verifications/${reference}`
            );

            return response;
        } catch (error) {
            throw new BadRequestException(error.response?.status)
        }
    }
}
