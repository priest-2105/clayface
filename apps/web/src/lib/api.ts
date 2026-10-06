export type Account = { id: string; email: string; name: string | null; onboardingStep: 'name' | 'project' | 'design' | 'complete'; twoFactorEnabled: boolean };
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function api<T = { ok: boolean }>(path: string, body?: unknown, method = body === undefined ? 'GET' : 'POST'): Promise<T> {
  let response: Response;
  try { response = await fetch(`/api${path}`, { method, credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-Clayface-Request': '1' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }); }
  catch { throw new ApiError('Clayface could not reach the server. Check your connection and try again.', 0); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.message ?? 'The server is unavailable. Please try again.', response.status);
  return data;
}
export const accountPath = (user: Account) => user.onboardingStep === 'complete' ? '/dashboard' : '/onboarding';
