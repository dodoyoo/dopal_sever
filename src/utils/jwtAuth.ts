// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.header('Authorization')?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: '로그인이 필요합니다.' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET_KEY!, (err, user) => {
//         if (err) {
//             return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
//         }

//         req.user = user; // 사용자 정보를 요청 객체에 추가
//         console.log(req.user);
//         next();
//     });
// };
