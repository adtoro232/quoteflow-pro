-- QuoteFlow Pro — Mitsubishi extra series
-- Verkoopprijs = inkoopprijs + €1110 | Beschrijving: "Alle materialen inclusief 5m leidingwerk"

WITH cat AS (
  SELECT id FROM public.product_categories WHERE name = 'Airco' LIMIT 1
)

INSERT INTO public.products (category_id, name, description, unit, purchase_price, sale_price, vat_percentage, is_active)
VALUES

-- Diamond Onyx Black (regulier)
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Onyx Black 2,5 kW Set',           'Alle materialen inclusief 5m leidingwerk', 'stuks', 1025.00, 2135.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Onyx Black 3,5 kW Set',           'Alle materialen inclusief 5m leidingwerk', 'stuks', 1180.00, 2290.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Onyx Black 5,0 kW Set',           'Alle materialen inclusief 5m leidingwerk', 'stuks', 1611.00, 2721.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Onyx Black 6,0 kW Set',           'Alle materialen inclusief 5m leidingwerk', 'stuks', 1922.00, 3032.00, 21, true),

-- Diamond Ruby Red (regulier)
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Ruby Red 2,5 kW Set',             'Alle materialen inclusief 5m leidingwerk', 'stuks', 1025.00, 2135.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Ruby Red 3,5 kW Set',             'Alle materialen inclusief 5m leidingwerk', 'stuks', 1180.00, 2290.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Ruby Red 5,0 kW Set',             'Alle materialen inclusief 5m leidingwerk', 'stuks', 1611.00, 2721.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Ruby Red 6,0 kW Set',             'Alle materialen inclusief 5m leidingwerk', 'stuks', 1922.00, 3032.00, 21, true),

-- Diamond Natural White Zubadan
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Natural White Zubadan 2,5 kW Set','Alle materialen inclusief 5m leidingwerk', 'stuks', 1205.00, 2315.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Natural White Zubadan 3,5 kW Set','Alle materialen inclusief 5m leidingwerk', 'stuks', 1434.00, 2544.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Natural White Zubadan 5,0 kW Set','Alle materialen inclusief 5m leidingwerk', 'stuks', 2069.00, 3179.00, 21, true),

-- Diamond Pearl White Zubadan
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Pearl White Zubadan 2,5 kW Set',  'Alle materialen inclusief 5m leidingwerk', 'stuks', 1293.00, 2403.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Pearl White Zubadan 3,5 kW Set',  'Alle materialen inclusief 5m leidingwerk', 'stuks', 1520.00, 2630.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Pearl White Zubadan 5,0 kW Set',  'Alle materialen inclusief 5m leidingwerk', 'stuks', 2124.00, 3234.00, 21, true),

-- Diamond Black Zubadan
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Black Zubadan 2,5 kW Set',        'Alle materialen inclusief 5m leidingwerk', 'stuks', 1293.00, 2403.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Black Zubadan 3,5 kW Set',        'Alle materialen inclusief 5m leidingwerk', 'stuks', 1520.00, 2630.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Black Zubadan 5,0 kW Set',        'Alle materialen inclusief 5m leidingwerk', 'stuks', 2124.00, 3234.00, 21, true),

-- Diamond Ruby Red Zubadan
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Ruby Red Zubadan 2,5 kW Set',     'Alle materialen inclusief 5m leidingwerk', 'stuks', 1293.00, 2403.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Ruby Red Zubadan 3,5 kW Set',     'Alle materialen inclusief 5m leidingwerk', 'stuks', 1520.00, 2630.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Diamond Ruby Red Zubadan 5,0 kW Set',     'Alle materialen inclusief 5m leidingwerk', 'stuks', 2124.00, 3234.00, 21, true),

-- Vloermodel
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Vloermodel 2,5 kW Inv Set',               'Alle materialen inclusief 5m leidingwerk', 'stuks', 1072.00, 2182.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Vloermodel 3,5 kW Inv Set',               'Alle materialen inclusief 5m leidingwerk', 'stuks', 1153.00, 2263.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Vloermodel 5,0 kW Inv Set',               'Alle materialen inclusief 5m leidingwerk', 'stuks', 1611.00, 2721.00, 21, true),
((SELECT id FROM cat), 'MITSUBISHI ELECTRIC Vloermodel 6,0 kW Inv Set',               'Alle materialen inclusief 5m leidingwerk', 'stuks', 1868.00, 2978.00, 21, true);
