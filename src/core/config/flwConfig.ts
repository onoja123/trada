import { FLW_BASE_URL, FLW_SECRET_KEY } from "@/core/config";

export const flw = {
                    baseURL: FLW_BASE_URL,
                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${FLW_SECRET_KEY}`,
                    },
};
