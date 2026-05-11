-- Per-year quote number counter
-- Replaces the global sequence with a per-year atomic counter.
-- Offerte numbers reset to 0001 each new year: OFF-2026-0001, OFF-2026-0002, OFF-2027-0001, ...

CREATE TABLE IF NOT EXISTS public.quote_number_counters (
  year integer NOT NULL,
  last_value bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (year)
);

-- Atomic increment — safe for concurrent inserts
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS text AS $$
DECLARE
  year_int integer;
  year_str text;
  next_num bigint;
BEGIN
  year_int := EXTRACT(YEAR FROM NOW())::integer;
  year_str := year_int::text;

  INSERT INTO public.quote_number_counters (year, last_value)
  VALUES (year_int, 1)
  ON CONFLICT (year) DO UPDATE
    SET last_value = quote_number_counters.last_value + 1
  RETURNING last_value INTO next_num;

  RETURN 'OFF-' || year_str || '-' || lpad(next_num::text, 4, '0');
END;
$$ LANGUAGE plpgsql;
