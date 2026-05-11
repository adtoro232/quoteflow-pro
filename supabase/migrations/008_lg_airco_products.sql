-- QuoteFlow Pro — LG Airco producten
-- Voer dit uit in Supabase SQL Editor: Dashboard > SQL Editor > New query

-- 1. Voeg "Airco" categorie toe
INSERT INTO public.product_categories (name)
VALUES ('Airco')
ON CONFLICT DO NOTHING;

-- 2. Voeg alle LG airco producten toe
-- Verkoopprijs = inkoopprijs + €1110
-- Beschrijving: "Alle materialen inclusief 5m leidingwerk"

WITH cat AS (
  SELECT id FROM public.product_categories WHERE name = 'Airco' LIMIT 1
)

INSERT INTO public.products (category_id, name, description, unit, purchase_price, sale_price, vat_percentage, is_active)
VALUES

-- AI AIR Special serie
((SELECT id FROM cat), 'LG DUALCOOL AI AIR Special 2,5 kW Single Split Set – P09SND-SET', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 529.00, 1639.00, 21, true),
((SELECT id FROM cat), 'LG DUALCOOL AI AIR Special 3,5 kW Single Split Set – P12SND-SET', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 589.00, 1699.00, 21, true),

-- LG Deluxe serie
((SELECT id FROM cat), 'LG Deluxe 2,5 kW H09S1D WiFi Single Split Set', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 649.00, 1759.00, 21, true),
((SELECT id FROM cat), 'LG Deluxe 3,5 kW H12S1D WiFi Single Split Set', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 699.00, 1809.00, 21, true),
((SELECT id FROM cat), 'LG Deluxe 5,0 kW H18S1D WiFi Single Split Set', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 929.00, 2039.00, 21, true),
((SELECT id FROM cat), 'LG Deluxe 7,0 kW H24S1D WiFi Single Split Set', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 1165.00, 2275.00, 21, true),

-- Artcool Black Mirror serie
((SELECT id FROM cat), 'LG ARTCOOL AI AIR Mirror 2,5 kW Single Split Set', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 799.00, 1909.00, 21, true),
((SELECT id FROM cat), 'LG ARTCOOL AI AIR Mirror 3,5 kW Single Split Set', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 899.00, 2009.00, 21, true),
((SELECT id FROM cat), 'LG ARTCOOL AI AIR Mirror 5,0 kW Single Split Set', 'Alle materialen inclusief 5m leidingwerk', 'stuks', 999.00, 2109.00, 21, true);
