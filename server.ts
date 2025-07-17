import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './src/models/dataSource';
import { createApp } from './app';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = createApp();
const port = process.env.PORT || 3000;
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

  apis: ['./src/domain/user/*.ts', './src/domain/comment/*.ts'],
};
const swaggerSpec = swaggerJSDoc(options);

(async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');

      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

      // app.all('*', (req: Request, res: Response, next: NextFunction) => {
      //   const err = new Error(`Can't find ${req.originalUrl} on this server!`);

      //   next(err); -> 이부분에서 에러가 발생하면 미들웨어로 돌아가게 해야하는데 현재 나는 미들웨어를 사용하지 않기 때문에
      // });              주석을 풀고 서버를 열었을 때 에러가 발생하는 것이다.
      //

      app.listen(port, async () => {
        console.log(
          `Swagger docs available at http://${HOST}:${port}/api-docs`
        );
      });
    })
    .catch((error) => {
      console.error('DataSource.initialize() -->', error);
      process.exit(1);
      throw new Error(
        `Error during Data Source initialization: ${error.message}`
      );
    });
})();
