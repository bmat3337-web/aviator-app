import { createHmac, timingSafeEqual } from "node:crypto";

export interface VerifiedTelegramUser { id:number; first_name?:string; last_name?:string; username?:string; }
export interface TelegramAuthResult { user:VerifiedTelegramUser; authDate:number; }

export function verifyTelegramInitData(rawInitData:string,botToken:string,nowSeconds=Math.floor(Date.now()/1000),maxAgeSeconds=86400):TelegramAuthResult{
  if(!rawInitData||!botToken)throw new Error("INVALID_TELEGRAM_AUTH");
  const params=new URLSearchParams(rawInitData);
  const hash=params.get("hash"); const authDate=Number(params.get("auth_date"));
  const userRaw=params.get("user");
  if(!hash||!Number.isInteger(authDate)||!userRaw)throw new Error("INVALID_TELEGRAM_AUTH");
  if(authDate>nowSeconds||nowSeconds-authDate>maxAgeSeconds)throw new Error("STALE_TELEGRAM_AUTH");
  params.delete("hash");
  const dataCheckString=[...params.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}=${v}`).join("\n");
  const secret=createHmac("sha256","WebAppData").update(botToken).digest();
  const expected=createHmac("sha256",secret).update(dataCheckString).digest("hex");
  const a=Buffer.from(hash,"hex"),b=Buffer.from(expected,"hex");
  if(a.length!==b.length||!timingSafeEqual(a,b))throw new Error("INVALID_TELEGRAM_AUTH");
  let user:VerifiedTelegramUser;
  try{user=JSON.parse(userRaw) as VerifiedTelegramUser;}catch{throw new Error("INVALID_TELEGRAM_USER");}
  if(!Number.isInteger(user.id))throw new Error("INVALID_TELEGRAM_USER");
  return {user,authDate};
}
