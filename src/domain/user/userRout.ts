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

router.post('/api/sign-in', (req: Request, res: Response) =>
  userController.signIn(req, res)
);
/**
 * @swagger
 * /api/sign-in:
 *   post:
 *     summary: 유저 로그인
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 유저 이메일
 *                 example: dopal2@naver.com
 *               password:
 *                 type: string
 *                 description: 유저 비밀번호
 *                 example: asdqwe123!
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인 성공
 *                 user:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT 토큰
 *                     email:
 *                       type: string
 *                       description: 유저 이메일
 *                     nickname:
 *                       type: string
 *                       description: 유저 닉네임
 *                     profileImage:
 *                       type: string
 *                       description: 유저 프로필 이미지
 *       400:
 *         description: 형식 오류입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일과 비밀번호를 확인하세요.
 *       500:
 *         description: 서버 오류입니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 오류입니다.
 */

export default router;
