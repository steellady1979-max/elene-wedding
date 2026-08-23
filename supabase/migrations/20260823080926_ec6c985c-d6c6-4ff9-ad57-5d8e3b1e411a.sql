CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wishes TO anon;
GRANT SELECT, INSERT ON public.wishes TO authenticated;
GRANT ALL ON public.wishes TO service_role;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read wishes" ON public.wishes FOR SELECT USING (true);
CREATE POLICY "Anyone can leave a wish" ON public.wishes FOR INSERT WITH CHECK (char_length(full_name) BETWEEN 1 AND 100 AND char_length(message) BETWEEN 1 AND 1000);