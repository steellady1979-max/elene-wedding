import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const payload = (input: unknown) =>
  z
    .object({
      sheet: z.enum(["RSVP", "Wishes"]),
      values: z.array(z.string()).max(12),
    })
    .parse(input);

/**
 * Sends a row to the Google Sheet through a Google Apps Script Web App.
 * Set the SHEET_WEBHOOK_URL secret to the deployed /exec URL.
 */
export const appendToSheet = createServerFn({ method: "POST" })
  .inputValidator(payload)
  .handler(async ({ data }) => {
    const url = process.env["SHEET_WEBHOOK_URL"];
    if (!url) return { ok: false as const, reason: "not_configured" as const };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sheet: data.sheet,
        timestamp: new Date().toISOString(),
        values: data.values,
      }),
      redirect: "follow",
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`Sheet webhook failed [${res.status}]: ${body}`);
      return { ok: false as const, reason: "provider_error" as const };
    }

    return { ok: true as const };
  });
