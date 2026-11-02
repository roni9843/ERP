import { hash, verify } from '@node-rs/argon2';

/** Argon2id hashing (the library default), as recommended by OWASP. */
export function hashPassword(plain: string): Promise<string> {
  return hash(plain);
}

export function verifyPassword(hashed: string, plain: string): Promise<boolean> {
  return verify(hashed, plain);
}
