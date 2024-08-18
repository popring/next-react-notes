import NextAuth, { User } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { addUser, getUser } from '@/lib/db';
import { Provider } from 'next-auth/providers';

const providers: Provider[] = [
  CredentialsProvider({
    name: '密码登录',
    credentials: {
      username: {
        label: '用户名',
        type: 'text',
        placeholder: '请输入用户名',
      },
      password: {
        label: '密码',
        type: 'password',
        placeholder: '请输入密码',
      },
    },
    async authorize(credentials, req) {
      console.log(
        '%c [ credentials ]-27',
        'font-size:13px; background:#3e4622; color:#828a66;',
        credentials
      );
      if (!credentials) return null;

      let user = null;
      const { username, password } = credentials;
      user = await getUser(username as string, password as string);

      // 密码错误
      if (user === 1) return null;

      // 用户注册
      if (user === 0) {
        user = await addUser(username as string, password as string);
      }

      if (!user) {
        throw new Error('User was not found and could not be created.');
      }

      return user as User;
    },
  }),
  GitHub,
]

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name }
  }
})
 

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    // 自定义登录页面 账号密码登录有点问题（跳转到登录页，需刷新才可正常登录，否则会有 MissingCSRF: CSRF token was missing during an action signin. Read more at https://errors.authjs.dev#missingcsrf 错误）
    signIn: '/auth/signin', 
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = new URL(request.nextUrl);
      if (pathname.startsWith('/note/edit')) return !!auth;
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.type === 'credentials' && user) {
        // @ts-ignore
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      // @ts-ignore
      session.user.userId = token.userId;
      return session;
    },
  },
});
