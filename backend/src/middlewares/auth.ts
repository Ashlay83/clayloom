import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { jwt_secret } from '../config.js';

declare global {
  namespace Express {
    interface Request { userId?: string }
  }
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Login required' });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), jwt_secret);
    if (typeof payload === 'string' || typeof payload.id !== 'string') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};