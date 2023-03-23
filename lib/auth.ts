import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { db } from "@/lib/db";
import type { ReadonlyRequestCookies } from "next/dist/server/app-render";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

import { User } from "@/types/types";

// TODO: replace with Auth service

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string
) => bcrypt.compare(plainTextPassword, hashedPassword);

export const createJWT = (user: User) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7;

  return new SignJWT({ payload: { id: user.id, email: user.email } })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};

export const validateJWT = async (jwt: string) => {
  const { payload } = await jwtVerify(
    jwt,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  return payload.payload;
};

export const getUserFromCookie = async (
  cookies: RequestCookies | ReadonlyRequestCookies
) => {
  if (process.env.COOKIE_NAME === undefined) {
    throw new Error("COOKIE_NAME is undefined");
  }

  const jwt = cookies.get(process.env.COOKIE_NAME);

  if (jwt === undefined) {
    return null;
  }

  const { id } = (await validateJWT(jwt.value)) as { id: string };

  const user = await db.user.findUnique({
    where: {
      id: id as string,
    },
  });

  return user;
};
