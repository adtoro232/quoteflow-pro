-- Voeg geldigheidsinstelling toe aan quote_templates
ALTER TABLE public.quote_templates
  ADD COLUMN IF NOT EXISTS auto_expiry boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS validity_days integer NOT NULL DEFAULT 30;
