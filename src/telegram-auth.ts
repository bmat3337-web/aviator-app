import { createHmac, timingSafeEqual } from "node:crypto";

export interface VerifiedTelegramUser { id:number; first_name?:string; last_name?:string; username?:string; }

export function verifyTelegramInitData(raw:string,botToken:string,now=Math.floor(Date.now()/1000),maxAge=86400):VerifiedTelegramUser{
  const p=new URLSearchParams(raw), hash=p.get("hash"), authDate=Number(p.get("auth_date")), userRaw=p.get("user");
  if(!hash||!userRaw||!Number.isInteger(authDate)||authDate>now||now-authDate>maxAge)throw new Error("INVALID_TELEGRAM_AUTH");
  p.delete("hash");
  const check=[...p.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${k}=${v}`).join("\n");
  const secret=createHmac("sha256","WebAppData").update(botToken).digest();
  const expected=createHmac("sha256",secret).update(check).digest("hex");
  const a=Buffer.from(hash,"hex"),b=Buffer.from(expected,"hex");
  if(a.length!==b.length||!timingSafeEqual(a,b))throw new Error("INVALID_TELEGRAM_AUTH");
  let user:VerifiedTelegramUser;
  try{user=JSON.parse(userRaw)}catch{throw new Error("INVALID_TELEGRAM_USER")}
  if(!Number.isInteger(user.id))throw new Error("INVALID_TELEGRAM_USER");
  return user;
}

export function requireTelegramUser(headers:Record<string,string|undefined>,botToken:string):VerifiedTelegramUser{
  const raw=headers["x-telegram-init-data"];
  if(!raw)throw new Error("TELEGRAM_AUTH_REQUIRED");
  return verifyTelegramInitData(raw,botToken);
}
