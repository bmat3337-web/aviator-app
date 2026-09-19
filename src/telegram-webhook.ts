import { handleAnalysisCommand } from "./telegram";
import { AviatorAnalysisService } from "./service";

export interface TelegramUpdate {
  update_id: number;
  message?: {
    chat: { id: number };
    from?: { id: number };
    text?: string;
  };
}

export interface TelegramTransport {
  sendMessage(chatId: string, text: string, parseMode?: "HTML"): Promise<void>;
}

export function parseCommand(text: string | undefined): { command: string; args: string[] } | null {
  if (!text?.trim()) return null;
  const parts = text.trim().split(/\s+/);
  const command = parts[0].split("@")[0].toLowerCase();
  if (!command.startsWith("/")) return null;
  return { command, args: parts.slice(1) };
}

export async function handleTelegramUpdate(
  update: TelegramUpdate,
  service: AviatorAnalysisService,
  transport: TelegramTransport,
): Promise<void> {
  const message = update.message;
  if (!message?.text) return;
  const parsed = parseCommand(message.text);
  if (!parsed) return;

  const reply = await handleAnalysisCommand(parsed.command, service);
  await transport.sendMessage(String(message.chat.id), reply.text, reply.parseMode);
}
