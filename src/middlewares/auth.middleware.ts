import { Request, Response, NextFunction } from 'express';
import * as jose from 'jose';
import { config } from '../config';

export interface AuthRequest extends Request {
  user?: jose.JWTPayload & { role?: string; userId?: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided or malformed token.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = new TextEncoder().encode(config.jwt_secret);
    const { payload } = await jose.jwtVerify(token, secret);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token.', error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};

export const authorizeRoles = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({ success: false, message: 'Forbidden: User role not found.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: `Forbidden: Access denied. Required roles: ${roles.join(', ')}.` });
      return;
    }

    next();
  };
};
