import { PrismaClient } from '@prisma/client';
import { DefaultSession } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare global {
  var prisma: PrismaClient;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      userId: string;
    } & DefaultSession['user'];
  }

  interface JWT extends Record<string, unknown>, DefaultJWT {
    userId: string
  }
}