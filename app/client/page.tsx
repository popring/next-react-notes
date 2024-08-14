import { auth } from 'auth';
import ClientComponent from '@/components/ClientComponent';
import { SessionProvider } from 'next-auth/react';

export default async function ClientPage() {
  const session = await auth();

  if (session?.user) {
    session.user = {
      image: session.user.image || '',
      email: session.user.email,
      name: session.user.name,
    };
  }
  return (
    <SessionProvider session={session}>
      <ClientComponent />
    </SessionProvider>
  );
}
