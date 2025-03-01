import { Auth } from '@/auth/auth.model.ts';
import { User } from '@/user/user.model.ts';

import { HTTPException } from '@hono/http-exception';
import { sign } from '@hono/jwt';
import { encodeBase32 } from '@std/encoding';
import { totp } from 'otplib';

export function register(email: string) {
  Auth.register(email);
}

export async function signup(email: string, displayName: string) {
  if (!email) {
    throw new HTTPException(400, { message: 'Missing user email' });
  }

  const registrationState = Auth.isActive(email);

  if (registrationState === null) {
    throw new HTTPException(403, { message: 'User not in allowlist' });
  }

  if (registrationState === true) {
    throw new HTTPException(409, { message: 'User already active' });
  }

  Auth.activate(email);

  const totpSecret = encodeBase32(crypto.getRandomValues(new Uint8Array(20)));

  await new User({ displayName, email, totpSecret }).save();

  return totpSecret;
}

export async function login(email: string, token: string) {
  const user = await User.get(email);

  if (!user) {
    throw new HTTPException(404, {
      message: `No user for email ${email} was found`,
    });
  }
  if (!totp.check(token, user.secret)) {
    throw new HTTPException(400, { message: 'Invalid OTP' });
  }

  const signKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(Deno.env.get('JWT_SECRET') as string),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  return sign(
    {
      exp:
        Temporal.Now.instant().add(Temporal.Duration.from({ hours: 12 }))
          .epochMilliseconds / 1000,
      aud: `${user.email}`,
    },
    signKey,
  );
}
