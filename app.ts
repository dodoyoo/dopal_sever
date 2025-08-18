import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import openaiRoute from './src/domain/openai/openaiRoute';
import userRouter from './src/domain/user/userRout';

import path from 'path';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      origin: '*',
    })
  );

  app.use(express.static(path.join(__dirname, './static')));
  app.use('/css', express.static('./static/css'));
  app.use('/js', express.static('./static/js'));

  app.use(morgan('combined'));
  app.use(compression());

  app.use(userRouter);
  app.use(openaiRoute);

  app.get('/ping', (req: Request, res: Response) => {
    res.status(200).json({ message: 'PongPong' });
  });

  app.get('/ai/main', (req, res) => {
    res.sendFile(path.join(__dirname, './static/js/ai.html'));
  });

  return app;
};
