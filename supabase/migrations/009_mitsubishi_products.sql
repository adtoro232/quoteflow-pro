-- QuoteFlow Pro — Mitsubishi Electric producten
-- Voer dit uit in Supabase SQL Editor: Dashboard > SQL Editor > New query
-- Verkoopprijs = inkoopprijs + €1110 | Beschrijving: "Alle materialen inclusief 5m leidingwerk"

WITH cat AS (
  SELECT id FROM public.product_categories WHERE name = 'Airco' LIMIT 1
)

INSERT INTO public.products (category_id, name, description, unit, purchase_price, sale_price, vat_percentage, is_active)
VALUES

-- MSZ-HR serie
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC MSZ-HR 2,5 kW Set met WiFi',          'Alle materialen inclusief 5m leidingwerk', 'stuks',  440.00, 1550.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC MSZ-HR 3,5 kW Set met WiFi',          'Alle materialen inclusief 5m leidingwerk', 'stuks',  495.00, 1605.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC MSZ-HR 5,0 kW Set met WiFi',          'Alle materialen inclusief 5m leidingwerk', 'stuks',  695.00, 1805.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC MSZ-HR 6,0 kW Set zonder WiFi',       'Alle materialen inclusief 5m leidingwerk', 'stuks',  990.00, 2100.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC MSZ-HR 7,1 kW Set zonder WiFi',       'Alle materialen inclusief 5m leidingwerk', 'stuks', 1100.00, 2210.00, 21, true),

-- Compact serie
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Compact 2,5 kW Set',                  'Alle materialen inclusief 5m leidingwerk', 'stuks',  760.00, 1870.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Compact 3,5 kW Set',                  'Alle materialen inclusief 5m leidingwerk', 'stuks',  880.00, 1990.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Compact 4,2 kW Set',                  'Alle materialen inclusief 5m leidingwerk', 'stuks', 1080.00, 2190.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Compact 5,0 kW Set',                  'Alle materialen inclusief 5m leidingwerk', 'stuks', 1098.00, 2208.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Compact 6,0 kW Set',                  'Alle materialen inclusief 5m leidingwerk', 'stuks', 1242.00, 2352.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Compact 7,1 kW Set',                  'Alle materialen inclusief 5m leidingwerk', 'stuks', 1488.00, 2598.00, 21, true),

-- Premium Natural White serie
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Natural White 2,5 kW Set',    'Alle materialen inclusief 5m leidingwerk', 'stuks',  782.00, 1892.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Natural White 3,5 kW Set',    'Alle materialen inclusief 5m leidingwerk', 'stuks',  944.00, 2054.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Natural White 5,0 kW Set',    'Alle materialen inclusief 5m leidingwerk', 'stuks', 1402.00, 2512.00, 21, true),

-- Premium Silver serie
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Silver 2,5 kW Set',           'Alle materialen inclusief 5m leidingwerk', 'stuks',  782.00, 1892.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Silver 3,5 kW Set',           'Alle materialen inclusief 5m leidingwerk', 'stuks',  944.00, 2054.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Silver 5,0 kW Set',           'Alle materialen inclusief 5m leidingwerk', 'stuks', 1402.00, 2512.00, 21, true),

-- Premium Onyx Black serie
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Onyx Black 2,5 kW Set',       'Alle materialen inclusief 5m leidingwerk', 'stuks',  782.00, 1892.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Onyx Black 3,5 kW Set',       'Alle materialen inclusief 5m leidingwerk', 'stuks',  944.00, 2054.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Premium Onyx Black 5,0 kW Set',       'Alle materialen inclusief 5m leidingwerk', 'stuks', 1402.00, 2512.00, 21, true),

-- Diamond Natural White serie
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Natural White 2,5 kW Set',    'Alle materialen inclusief 5m leidingwerk', 'stuks',  957.00, 2067.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Natural White 3,5 kW Set',    'Alle materialen inclusief 5m leidingwerk', 'stuks', 1092.00, 2202.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Natural White 5,0 kW Set',    'Alle materialen inclusief 5m leidingwerk', 'stuks', 1524.00, 2634.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Natural White 6,0 kW Set',    'Alle materialen inclusief 5m leidingwerk', 'stuks', 1780.00, 2890.00, 21, true),

-- Diamond Pearl White serie
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Pearl White 2,5 kW Set',      'Alle materialen inclusief 5m leidingwerk', 'stuks', 1025.00, 2135.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Pearl White 3,5 kW Set',      'Alle materialen inclusief 5m leidingwerk', 'stuks', 1180.00, 2290.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Pearl White 5,0 kW Set',      'Alle materialen inclusief 5m leidingwerk', 'stuks', 1611.00, 2721.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Pearl White 6,0 kW Set',      'Alle materialen inclusief 5m leidingwerk', 'stuks', 1922.00, 3032.00, 21, true);
