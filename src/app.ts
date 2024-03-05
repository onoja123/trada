import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { router as v1 } from '@/routes';
import { connectToDatabase } from './core';
import * as errorMiddleware from './middlewares/error.middleware';
import HomeRoute from './routes/home.route';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.connectToDatabase();
        this.configureMiddlewares();
        this.configureRoutes();
        this.initializeSwagger();
        this.configureErrorHandling();
    }

    private async connectToDatabase() {
        await connectToDatabase();
    }

    private configureMiddlewares(): void {
        this.express.use(express.static(path.join(__dirname, '../public')));
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(helmet());
    }

    private configureRoutes(): void {
        this.express.use('/', HomeRoute);
        this.express.use('/api/v1', v1);
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                openapi: '3.0.0',
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Trada Docs',
                    contact: {
                        name: 'Developer',
                        url: 'https://www.github.com/solomonolatunji',
                        email: 'realsolomon@outlook.com',
                    },
                },
            },
            apis: ['docs/swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    private configureErrorHandling(): void {
        this.express.use(errorMiddleware.notFound);
        this.express.use(errorMiddleware.internalServerError);
    }
}

export default App;
