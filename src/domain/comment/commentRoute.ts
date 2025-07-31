import { Request, Response, Router } from 'express';
import { CommentController } from './commentController';
import { CommentRepository } from './commentRepository';

const router = Router();
const commentRepository = new CommentRepository();
const commentController = new CommentController(commentRepository);

router.post('/api/question/:userId', (req: Request, res: Response) =>
  commentController.createComments(req, res)
);

/**
 * @swagger
 * path:
 * /api/comment/{userId}:
 *  post:
 *      summary: "게시글 작성"
 *      tags: [Comment]
 *      parameters:
 *       - in: path
 *         name: userId
 *         require: true
 *         description: "유저 ID"
 *         schema:
 *           type: string
 *      requestBody:
 *         required: true
 *         content:
 *          application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   description: "사용자 ID"
 *                   example: 1
 *                 comment:
 *                   type: string
 *                   description: "게시글 내용"
 *                   example: "Dopal아 OO 알려줘"
 *      responses:
 *        200:
 *          description: "게시글 작성 성공"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "게시글 작성이 완료되었습니다."
 *                  comment:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                        example: 1
 *                      user_id:
 *                        type: integer
 *                        example: 1
 *                      comment:
 *                        type: string
 *                        example: "Dopal아 OO 분석해줘"
 *                      created_at:
 *                        type: string
 *                      updated_at:
 *                        type: string
 *        400:
 *          description: "잘못된 요청"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "잘못된 요청입니다."
 *        404:
 *          description: "게시글을 작성할 수 없음"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "게시글을 작성할 수 없습니다."
 *        500:
 *          description: "서버 오류"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "서버 오류입니다."
 */

// 모든 게시글 불러오기
router.get('/api/comments', (req: Request, res: Response) =>
  commentController.findAllComments(req, res)
);

/**
 * @swagger
 * path:
 * /api/comments:
 *  get:
 *     summary: "전체 게시글 조회"
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: "전체 게시글 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "전체 게시글 조회 성공했습니다."
 *                 comment:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       comment:
 *                         type: string
 *                         example: "Dopal아 OO 분석해줘"
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: "잘못된 요청"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다."
 *       500:
 *         description: "서버 오류"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 오류입니다."
 */

// 게시글 개별로 가져오기
router.get('/api/comments/:commentId', (req: Request, res: Response) =>
  commentController.getComment(req, res)
);

/**
 * @swagger
 * path:
 * /api/comments/{commentId}:
 *  get:
 *     summary: "상세 게시글 조회"
 *     tags: [Comment]
 *     parameters:
 *      - in: path
 *        name: commentId
 *        require: true
 *        description: "게시글 ID"
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: "상세 게시글 조회 성공"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "상세 게시글 조회 성공했습니다."
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: integer
 *                      example: 1
 *                     user_id:
 *                      type: integer
 *                      example: 1
 *                     comment:
 *                      type: string
 *                      example: "Dopal아 OO 분석해줘"
 *                     created_at:
 *                      type: string
 *                      format: date-time
 */

// 질문 삭제
router.delete('/api/comments/:commentId', (req: Request, res: Response) =>
  commentController.deleteComment(req, res)
);

/**
 * @swagger
 * path:
 * /api/comments/{commentId}:
 *  delete:
 *    summary: "질문 삭제하기"
 *    tags: [Comment]
 *    parameters:
 *      - in: path
 *        name: commentId
 *        require: true
 *        description: "질문 ID"
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              user_id:
 *                type: integer
 *                description: "사용자 ID"
 *                example: 1
 *    responses:
 *      200:
 *        description: "질문 삭제 성공"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "질문 삭제되었습니다."
 *      400:
 *        description: "잘못된 요청"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "잘못된 요청입니다."
 *      500:
 *        description: "서버 오류"
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: "서버 오류입니다."
 */
export default router;
