import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import userRouter from './src/domain/user/userRout';
import commentRouter from './src/domain/comment/commentRoute';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: '*',
    })
  );
  app.use(morgan('combined'));
  app.use(compression());

  app.use(userRouter);
  app.use(commentRouter);

  app.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({ message: 'PongPong' });
  });

  return app;
};
