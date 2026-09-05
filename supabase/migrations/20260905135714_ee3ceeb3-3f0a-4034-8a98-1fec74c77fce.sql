CREATE TABLE public.rsvp_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  status text NOT NULL,
  count integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT INSERT ON public.rsvp_responses TO anon, authenticated;
GRANT ALL ON public.rsvp_responses TO service_role;

ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an RSVP"
ON public.rsvp_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 120
  AND status IN ('attending', 'declined')
  AND count BETWEEN 0 AND 20
);