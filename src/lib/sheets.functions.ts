import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwvv0iHtsiDid1iN9-8TYSTV0B08bQtrKmj_TgWEhvbtrkoWII64a7qyv5UdrFfgfq44g/exec";

const wish = z.object({
  name: z.string(),
  message: z.string(),
  timestamp: z.string().optional(),
});

const payload = (input: unknown) =>
  z
    .object({
      sheet: z.enum(["RSVP", "Wishes"]),
      values: z.array(z.string()).max(12),
    })
    .parse(input);

/**
 * Sends a row to the Google Sheet through a Google Apps Script Web App.
 * The webhook URL is server-side only and is shared by both forms.
 */
export const appendToSheet = createServerFn({ method: "POST" })
  .validator(payload)
  .handler(async ({ data }) => {
    const res = await fetch(SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sheet: data.sheet,
        timestamp: new Date().toISOString(),
        values: data.values,
      }),
      redirect: "follow",
    });

    const body = await res.text();
    let result: { ok?: boolean; error?: string } = {};
    try {
      result = JSON.parse(body) as { ok?: boolean; error?: string };
    } catch {
      // A non-JSON response is a provider error even when the HTTP status is 200.
    }

    if (!res.ok || result.ok !== true) {
      console.error(`Sheet webhook failed [${res.status}]: ${body}`);
      return { ok: false as const, reason: "provider_error" as const };
    }

    return { ok: true as const };
  });

/** Loads public guestbook entries from the same Apps Script web app. */
export const getWishes = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const endpoint = new URL(SHEET_WEBHOOK_URL);
    endpoint.searchParams.set("action", "wishes");

    const res = await fetch(endpoint, { redirect: "follow" });
    if (!res.ok) return { ok: false as const, wishes: [] };

    const parsed = z
      .object({ ok: z.literal(true), wishes: z.array(wish).max(500) })
      .safeParse(await res.json());

    return parsed.success
      ? { ok: true as const, wishes: parsed.data.wishes }
      : { ok: false as const, wishes: [] };
  } catch (error) {
    console.error("Failed to load wishes from Google Sheets:", error);
    return { ok: false as const, wishes: [] };
  }
});
