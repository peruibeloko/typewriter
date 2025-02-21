import { Allowlist } from '@/auth/allowlist.model.ts';
import { User } from '@/user/user.model.ts';

import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { totp } from 'otplib';
import { encodeBase32 } from 'std/encoding';

export async function signup(email: string, displayName: string) {
  if (!email) {
    return new HTTPException(400, { message: 'Missing user email' });
  }

  const allowlist = new Allowlist();

  const registrationState = allowlist.isActive(email);

  if (registrationState === null)
    return new HTTPException(403, { message: 'User not in allowlist' });
  if (registrationState === true)
    return new HTTPException(409, { message: 'User already registered' });

  allowlist.register(email);

  const totpSecret = encodeBase32(crypto.getRandomValues(new Uint8Array(20)));

  await new User({ displayName, email, totpSecret }).save();

  return totpSecret;
}

export async function login(email: string, token: string) {
  const user = await User.get(email);

  if (!user) return new HTTPException(404, { message: `No user for email ${email} was found` });
  if (!totp.check(token, user.secret)) return new HTTPException(400, { message: 'Invalid OTP' });

  const signKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(Deno.env.get('JWT_SECRET') as string),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  return sign(
    {
      exp:
        Temporal.Now.instant().add(Temporal.Duration.from({ hours: 12 })).epochMilliseconds / 1000,
      aud: `${user.email}`
    },
    signKey
  );
}
