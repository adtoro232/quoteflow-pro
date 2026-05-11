-- App-wide key/value settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  key   text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default email settings (ignored if already exists)
INSERT INTO public.app_settings (key, value) VALUES
  ('email_from',     'info@jouwbedrijf.nl'),
  ('email_subject',  'Offerte {{quote_number}} van {{company_name}}'),
  ('email_intro',    'Hierbij ontvangt u onze offerte. Via de knop hieronder kunt u de offerte bekijken en direct accepteren of afwijzen.'),
  ('email_closing',  'Heeft u vragen? Neem gerust contact met ons op.')
ON CONFLICT (key) DO NOTHING;

-- RLS: alleen ingelogde gebruikers mogen lezen; alleen admins mogen schrijven
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read settings"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update settings"
  ON public.app_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert settings"
  ON public.app_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
