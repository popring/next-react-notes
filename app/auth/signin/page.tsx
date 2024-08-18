// 'use client';
import { signIn, providerMap } from 'auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export const revalidate = 0;
export const dynamic = 'force-dynamic'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {

  const response = await fetch('http://localhost:3000/api/auth/csrf', {
    cache: 'no-store',
  });
  const { csrfToken } = await response.json();

  const callbackUrl = searchParams?.callbackUrl || '/';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <form
        method='POST'
        action={async (formData: FormData) => {
          'use server';
          console.log('%c [ formData ]-26', 'font-size:13px; background:#9f4b10; color:#e38f54;', formData)
          try {
            await signIn('credentials', {
              username: formData.get('username') as string,
              password: formData.get('password') as string,
              redirectTo: callbackUrl,
            });
          } catch (error) {
            // Signin can fail for a number of reasons, such as the user
            // not existing, or the user not having the correct role.
            // In some cases, you may want to redirect to a custom error
            if (error instanceof AuthError) {
              return redirect(`/app/auth/signin?error=${error.type}`);
            }

            // Otherwise if a redirects happens NextJS can handle it
            // so you can just re-thrown the error and let NextJS handle it.
            // Docs:
            // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
            throw error;
          }
        }}
      >
        <input type='hidden' name='csrfToken' value={csrfToken} />
        <label>
          Username
          <input name='username' type='text' />
        </label>
        <label>
          Password
          <input name='password' type='password' />
        </label>
        <button type='submit'>Sign in</button>
      </form>

      <div className='flex flex-col gap-2'>
        {Object.values(providerMap)
          .filter((item) => item.id !== 'credentials')
          .map((provider) => (
            <form
              key={provider.id}
              action={async () => {
                'use server';
                try {
                  await signIn(provider.id);
                } catch (error) {
                  // Signin can fail for a number of reasons, such as the user
                  // not existing, or the user not having the correct role.
                  // In some cases, you may want to redirect to a custom error
                  if (error instanceof AuthError) {
                    return redirect(`/app/auth/signin?error=${error.type}`);
                  }

                  // Otherwise if a redirects happens NextJS can handle it
                  // so you can just re-thrown the error and let NextJS handle it.
                  // Docs:
                  // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
                  throw error;
                }
              }}
            >
              <button type='submit'>
                <span>Sign in with {provider.name}</span>
              </button>
            </form>
          ))}
      </div>
    </div>
  );
}
