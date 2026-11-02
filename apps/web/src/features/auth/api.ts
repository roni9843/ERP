import type { AuthSession, LoginInput, SignupInput } from '@erp/shared';
import { http } from '@/shared/api/http';

export async function login(input: LoginInput): Promise<AuthSession> {
  const { data } = await http.post<AuthSession>('/auth/login', input);
  return data;
}

export async function signup(input: SignupInput): Promise<AuthSession> {
  const { data } = await http.post<AuthSession>('/auth/signup', input);
  return data;
}
