import { DataSource } from 'typeorm';
<<<<<<< HEAD
import { User } from '../domain/user/userEntity';
import { Comment } from '../domain/comment/commentEntity';
=======
>>>>>>> d048757 (초기세팅)

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
<<<<<<< HEAD
  logging: true,
  synchronize: false,
  entities: [User, Comment],
=======
>>>>>>> d048757 (초기세팅)
});
