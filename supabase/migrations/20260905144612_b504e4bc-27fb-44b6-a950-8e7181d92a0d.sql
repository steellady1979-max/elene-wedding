ALTER TABLE public.rsvps
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS guest_count integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS wishes text;

UPDATE public.rsvps SET status = CASE WHEN attending THEN 'attending' ELSE 'declined' END WHERE status IS NULL;

ALTER TABLE public.rsvps ALTER COLUMN status SET NOT NULL;

DROP POLICY IF EXISTS "Anyone can submit an RSVP" ON public.rsvps;

ALTER TABLE public.rsvps DROP COLUMN IF EXISTS attending;
ALTER TABLE public.rsvps DROP COLUMN IF EXISTS plus_one_name;

CREATE POLICY "Anyone can submit an RSVP"
ON public.rsvps
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(full_name)) BETWEEN 1 AND 120
  AND status IN ('attending', 'declined')
  AND guest_count BETWEEN 0 AND 20
  AND (wishes IS NULL OR length(wishes) <= 1000)
);

GRANT INSERT ON public.rsvps TO anon, authenticated;
GRANT ALL ON public.rsvps TO service_role;