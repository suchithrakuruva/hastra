import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'hastra-artisan-secret-key-2026';

export interface UserSession {
  userId: string;
  name: string;
  phone: string;
  role: 'SELLER' | 'BUYER' | 'ADMIN';
  sellerProfileId?: string;
  buyerProfileId?: string;
  preferredLang: string;
}

export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (err) {
    return null;
  }
}

export function getSessionFromRequest(req: NextRequest): UserSession | null {
  const authHeader = req.headers.get('authorization');
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get('hastra_token')?.value || '';
  }

  if (!token) return null;
  return verifyToken(token);
}
