import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const payload = (input: unknown) =>
  z
    .object({
      sheet: z.enum(["RSVP", "Wishes"]),
      values: z.array(z.string()).max(12),
    })
    .parse(input);

export const appendToSheet = createServerFn({ method: "POST" })
  .inputValidator(payload)
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const connectionKey = process.env["GOOGLE_SHEETS_API_KEY"];
    const spreadsheetId = process.env["WEDDING_SHEET_ID"];

    if (!lovableKey || !connectionKey || !spreadsheetId) {
      return { ok: false as const, reason: "not_configured" as const };
    }

    const range = `${data.sheet}!A:F`;
    const res = await fetch(
      `${GATEWAY_URL}/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": connectionKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [[new Date().toISOString(), ...data.values]] }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Sheets append failed [${res.status}]: ${body}`);
      return { ok: false as const, reason: "provider_error" as const };
    }

    return { ok: true as const };
  });
