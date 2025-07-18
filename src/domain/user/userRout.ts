import { Request, Response, Router } from 'express';
import { UserController } from './userController';
import { UserRepository } from './userRepository';

const router = Router();
const userRepository = new UserRepository();
const userController = new UserController(userRepository);

router.post('/api/sign-up', (req: Request, res: Response) =>
  userController.signUp(req, res)
);

/**
 * @swagger
 * path:
 * /api/sign-up:
 *  post:
 *      summary: "유저 회원가입"
 *      tags: [User]
 *      requestBody:
 *         required: true
 *         content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  email:
 *                    type: string
 *                    description: "유저 이메일"
 *                    example: "dopal2@naver.com"
 *                  password:
 *                    type: string
 *                    description: "비밀번호"
 *                    example: "asdqwe123!"
 *                  nickname:
 *                    type: string
 *                    description: "닉네임"
 *                    example: "도팔"
 *      responses:
 *       '200':
 *          description: "회원가입 성공"
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        description: "회원가입이 성공적으로 완료되었습니다."
 *       '400':
 *          description: "형식 오류"
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        description: "이메일 형식이 다릅니다, 비밀번호 형식이 다릅니다."
 *       '500':
 *          description: "서버 오류"
 *          content:
 *           application/json:
 *             schema:
 *                type: object
 *                properties:
 *                    message:
 *                        type: string
 *                        description: "서버 오류입니다."
 */
export default router;
