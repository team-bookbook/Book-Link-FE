type CheckNicknameRes = { available: boolean };
type SendEmailCodeRes = { ok: boolean; code: string };
type VerifyEmailCodeRes = { verified: boolean };
type SubmitSignupRes = { ok: boolean; userId: string };

const EMAIL_CODE_TTL_MS = 5 * 60 * 1000;

const emailStore: Record<string, { code: string; expiresAt: number }> = {};

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function checkNickname(nickname: string): Promise<CheckNicknameRes> {
  await delay(400);
  return { available: nickname !== '중복' };
}

export async function sendEmailCode(email: string): Promise<SendEmailCodeRes> {
  await delay(500);
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6자리
  emailStore[email] = { code, expiresAt: Date.now() + EMAIL_CODE_TTL_MS };
  return { ok: true, code };
}

export async function verifyEmailCode(email: string, code: string): Promise<VerifyEmailCodeRes> {
  await delay(350);
  const saved = emailStore[email];
  if (!saved) return { verified: false };
  const ok = saved.code === code && Date.now() < saved.expiresAt;
  return { verified: ok };
}

export async function submitSignup(payload: unknown): Promise<SubmitSignupRes> {
  await delay(600);
  const usersRaw = window.localStorage.getItem('mock_users') ?? '[]';
  const users = JSON.parse(usersRaw) as unknown[];
  users.push(payload);
  window.localStorage.setItem('mock_users', JSON.stringify(users));
  return { ok: true, userId: `u_${Date.now().toString(36)}` };
}
