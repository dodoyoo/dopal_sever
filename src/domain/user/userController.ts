import 'dotenv/config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { reportErrorMessage } from '../../utils/errorHandling';
import {
  InvalidPropertyError,
  PropertyRequiredError,
} from '../../utils/customError';
import { UserRepository } from './userRepository';
import { User } from './userEntity';

const comparePassword = async (
  inputPassword: string,
  storedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(inputPassword, storedPassword);
};

const emailRegex =
  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-z\d!@#$%^&*(),.?":{}|<>]{10,}$/;

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export class UserController {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  // 회원가입
  public async signUp(req: Request, res: Response) {
    try {
      const { email, password, nickname } = req.body;
      if (!emailRegex.test(email)) {
        throw new InvalidPropertyError('사용할 수 없는 이메일입니다.');
      }

      if (!passwordRegex.test(password)) {
        throw new InvalidPropertyError('사용할 수 없는 비밀번호입니다.');
      }

      const userExists = await this.userRepository.findByEmail(email);
      console.log('User exists:', userExists);
      if (userExists) {
        throw new InvalidPropertyError('이미 사용중인 이메일입니다.');
      }

      const hashedPassword: string = await hashPassword(password);

      const verificationToken = crypto.randomBytes(32).toString('hex');
      await this.userRepository.createUser({
        email,
        password: hashedPassword,
        nickname,
      });
      res.status(200).json({ message: '회원가입 성공' });
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }

  public async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const emailRegex =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
      if (!emailRegex.test(email)) {
        throw new InvalidPropertyError('잘못된 이메일 형식입니다.');
      }

      const user: User | undefined = await this.userRepository.findByEmail(
        email
      );
      if (!user) {
        throw new InvalidPropertyError('존재하지 않는 사용자입니다.');
      }

      const isPasswordValid: boolean = await comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        throw new InvalidPropertyError('비밀번호가 일치하지 않습니다.');
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: '1d' }
      );
      console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

      res.status(200).json({
        message: '로그인 성공',
        user: {
          token,
          email: user.email,
          nickname: user.nickname,
        },
      });
    } catch (err: unknown) {
      return reportErrorMessage(err, res);
    }
  }
}
