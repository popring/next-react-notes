import Image from 'next/image';
import { signIn, auth, signOut } from 'auth';
import Link from 'next/link';

function SignIn({
  provider,
  ...props
}: {
  provider?: string;
  [key: string]: any;
}) {
  return (
    <form
      action={async () => {
        'use server';
        await signIn(provider);
      }}
    >
      <button {...props}>Sign In</button>
    </form>
  );
}

function SignOut(props: { [key: string]: any }) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button {...props}>Sign Out</button>
    </form>
  );
}

export default async function Header() {
  const session = await auth();
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'end',
        width: '100%',
        margin: 10,
        paddingRight: 50,
      }}
    >
      {session?.user ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Link
            href={'/client'}
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Image
              src={session?.user.image || ''}
              width={30}
              height={30}
              alt={session?.user.name || ''}
              style={{ borderRadius: '50%', marginRight: 3 }}
            />
            <span style={{ color: 'red', marginRight: 10 }}>
              {session?.user.name}
            </span>
          </Link>
          <SignOut />
        </span>
      ) : (
        <SignIn />
      )}
    </header>
  );
}
