import { auth, signIn } from 'auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    await signIn();
    return null;
  }

  return children;
}
