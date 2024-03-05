import { createClient, RedisClientType } from 'redis';
import { REDIS_URI } from '@/core/config';
import winston from 'winston';

class Redis {
    private static instance: Redis;

    private readonly redisUri: string;

    public client: RedisClientType;

    private constructor(redisUri: string) {
        this.redisUri = redisUri;

        this.createClient();
    }

    private createClient() {
        const options = {
            url: this.redisUri
        };

        try {
            this.client = createClient(options);
        } catch (error) {
            winston.error(error);
        }
    }

    public async run() {
        if (this.client) {
            try {
                await this.client.connect();
            } catch (error) {
                winston.error(error);
            }
        } else {
            winston.error('Redis client is not initialized');
        }
    }

    public async stop() {
        if (this.client) {
            try {
                await this.client.disconnect();
            } catch (error) {
                winston.error(error);
            }
        } else {
            winston.error('Redis client is not initialized');
        }
    }

    public static getInstance(): Redis {
        if (!Redis.instance) {
            Redis.instance = new Redis(REDIS_URI);
        }

        return Redis.instance;
    }
}

export const redis = Redis.getInstance();