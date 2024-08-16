import { PrismaClient } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare global {
  var prisma: PrismaClient;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      userId: string;
    } & DefaultSession['user'];
  }
}