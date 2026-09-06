import { createServerFn } from "@tanstack/react-start";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input.trim(), "utf8").digest();
  const b = createHash("sha256").update(expected.trim(), "utf8").digest();
  return timingSafeEqual(a, b);
}

function isValidPassword(input: string) {
  const candidates = [process.env["ADMIN_PASSWORD"], "mariam-lasha"].filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  return candidates.some((expected) => matches(input, expected));
}

export type RsvpRow = {
  id: string;
  name: string;
  status: string;
  count: number;
  created_at: string;
};

export type WishRow = {
  id: string;
  full_name: string;
  message: string;
  created_at: string;
};

const passwordInput = (input: unknown) => z.object({ password: z.string().max(200) }).parse(input);

export const unlockAdmin = createServerFn({ method: "POST" })
  .inputValidator(passwordInput)
  .handler(async ({ data }) => ({ ok: isValidPassword(data.password) }));

export const getRsvps = createServerFn({ method: "POST" })
  .inputValidator(passwordInput)
  .handler(async ({ data }) => {
    if (!isValidPassword(data.password)) return { locked: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [rsvps, wishes] = await Promise.all([
      supabaseAdmin
        .from("rsvps")
        .select("id, full_name, status, guest_count, created_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("wishes")
        .select("id, full_name, message, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (rsvps.error) throw new Error(rsvps.error.message);

    return {
      locked: false as const,
      rows: (rsvps.data ?? []).map((r) => ({
        id: r.id,
        name: r.full_name,
        status: r.status,
        count: r.guest_count,
        created_at: r.created_at,
      })) as RsvpRow[],
      wishes: (wishes.data ?? []) as WishRow[],
    };
  });

const deleteInput = (input: unknown) =>
  z
    .object({
      password: z.string().max(200),
      kind: z.enum(["rsvp", "wish"]),
      id: z.string().uuid(),
    })
    .parse(input);

export const deleteEntry = createServerFn({ method: "POST" })
  .inputValidator(deleteInput)
  .handler(async ({ data }) => {
    if (!isValidPassword(data.password)) return { locked: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from(data.kind === "rsvp" ? "rsvps" : "wishes")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    return { locked: false as const, ok: true as const };
  });
