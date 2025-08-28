import * as jose from 'jose';
import { config } from '../config';

export async function decodeBearerTokenAndGetUserId(authorizationHeader?: string): Promise<string | undefined> {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return undefined;
  }
  const token = authorizationHeader.split(' ')[1];
  try {
    const secret = new TextEncoder().encode(config.jwt_secret);
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId as string | undefined;
    if (typeof userId === 'string' && userId.trim().length > 0) {
      return userId;
    }
    return undefined;
  } catch {
    return undefined;
  }
}


