type CheckNicknameRes = { available: boolean };
type SendEmailCodeRes = { ok: boolean; code: string };
type VerifyEmailCodeRes = { verified: boolean };
type SubmitSignupRes = { ok: boolean; userId: string };

type EmailStoreValue = { code: string; expiresAt: number };
type EmailStore = Record<string, EmailStoreValue>;

declare global {
  interface Window {
    __booklinkEmailStore?: EmailStore;
  }
}

const EMAIL_CODE_TTL_MS = 5 * 60 * 1000;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function getStore(): EmailStore {
  if (!window.__booklinkEmailStore) window.__booklinkEmailStore = {};
  return window.__booklinkEmailStore;
}
function norm(email: string) {
  return email.trim().toLowerCase();
}

export async function checkNickname(nickname: string): Promise<CheckNicknameRes> {
  await delay(200);
  return { available: nickname !== '중복' };
}

export async function sendEmailCode(email: string): Promise<SendEmailCodeRes> {
  await delay(200);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  getStore()[norm(email)] = { code, expiresAt: Date.now() + EMAIL_CODE_TTL_MS };

  try {
    localStorage.setItem('last_email', norm(email));
    localStorage.setItem('last_email_code', code);
  } catch {
    /* */
  }
  return { ok: true, code };
}

export async function verifyEmailCode(email: string, code: string): Promise<VerifyEmailCodeRes> {
  await delay(150);
  const saved = getStore()[norm(email)];
  const verified = !!saved && saved.code === code && Date.now() < saved.expiresAt;
  return { verified };
}

export async function submitSignup(payload: unknown): Promise<SubmitSignupRes> {
  await delay(200);
  const usersRaw = localStorage.getItem('mock_users') ?? '[]';
  const users = JSON.parse(usersRaw) as unknown[];
  users.push(payload);
  localStorage.setItem('mock_users', JSON.stringify(users));
  return { ok: true, userId: `u_${Date.now().toString(36)}` };
}
