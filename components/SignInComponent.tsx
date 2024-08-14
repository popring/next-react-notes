'use client';

export default function SignInComponent({ csrfToken }: { csrfToken: string }) {
  return (
    <form method='post' action='/api/auth/callback/credentials'>
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
  );
}
