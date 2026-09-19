export interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

export interface TelegramWebAppPayload {
  queryId?: string;
  user?: TelegramWebAppUser;
  authDate: number;
  hash: string;
  rawInitData: string;
}

export interface TelegramInitDataVerifier {
  verify(rawInitData: string, botToken: string): TelegramWebAppPayload;
}

export function assertFreshAuth(authDate: number, nowSeconds = Math.floor(Date.now()/1000), maxAgeSeconds = 86400): void {
  if (!Number.isInteger(authDate) || authDate > nowSeconds || nowSeconds - authDate > maxAgeSeconds) {
    throw new Error("STALE_TELEGRAM_AUTH");
  }
}
