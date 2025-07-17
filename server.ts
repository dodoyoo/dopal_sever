import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './src/models/dataSource';
import { createApp } from './app';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = createApp();
const port = process.env.PORT || 4000;
const HOST = process.env.HOST;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API with Swagger',
    version: '1.0.0',
    description:
      'A simple CRUD API application made with Express and documented with Swagger',
  },
  servers: [
    {
      url: `http://${HOST}:${port}`,
    },
  ],
  basePath: '/',
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};
const swaggerSpec = swaggerJSDoc(options);

(async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');

      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

      app.all('*', (req: Request, res: Response, next: NextFunction) => {
        const err = new Error(`Can't find ${req.originalUrl} on this server!`);

        next(err);
      });

      app.listen(port, async () => {
        console.log(
          `Swagger docs available at http://${HOST}:${port}/api-docs`
        );
      });
    })
    .catch((error) => {
      console.error('DataSource.initialize() -->', error);
      process.exit(1);
    });
})();
