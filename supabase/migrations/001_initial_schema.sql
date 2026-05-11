-- QuoteFlow Pro — Initial Schema
-- Voer dit uit in Supabase SQL Editor: Dashboard > SQL Editor > New query

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nieuwe gebruiker'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  company_name text NOT NULL,
  contact_name text,
  email text,
  phone text,
  address text,
  postal_code text,
  city text,
  country text DEFAULT 'Nederland',
  vat_number text,
  kvk_number text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.product_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  unit text DEFAULT 'stuks',
  purchase_price numeric(10,2),
  sale_price numeric(10,2) NOT NULL,
  vat_percentage numeric(5,2) DEFAULT 21,
  default_margin numeric(5,2),
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- QUOTE TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quote_templates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  html_content text NOT NULL,
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure max 1 default template
CREATE OR REPLACE FUNCTION ensure_single_default_template()
RETURNS trigger AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.quote_templates SET is_default = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS single_default_template ON public.quote_templates;
CREATE TRIGGER single_default_template
  BEFORE INSERT OR UPDATE ON public.quote_templates
  FOR EACH ROW EXECUTE FUNCTION ensure_single_default_template();

-- ============================================================
-- QUOTE NUMBER SEQUENCE
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS quote_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS text AS $$
DECLARE
  seq_val bigint;
  year_str text;
BEGIN
  seq_val := nextval('quote_number_seq');
  year_str := to_char(NOW(), 'YYYY');
  RETURN 'OFF-' || year_str || '-' || lpad(seq_val::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- QUOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quotes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number text UNIQUE NOT NULL DEFAULT generate_quote_number(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE RESTRICT,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  template_id uuid REFERENCES public.quote_templates(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'concept' CHECK (status IN (
    'concept', 'verzonden', 'geopend', 'bekeken',
    'geaccepteerd', 'afgewezen', 'verlopen'
  )),
  quote_date date NOT NULL DEFAULT CURRENT_DATE,
  expiry_date date,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount_amount numeric(10,2) NOT NULL DEFAULT 0,
  vat_amount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  public_token uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  internal_notes text,
  customer_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- QUOTE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quote_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  description text NOT NULL,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit text DEFAULT 'stuks',
  unit_price numeric(10,2) NOT NULL,
  discount_percentage numeric(5,2) NOT NULL DEFAULT 0,
  vat_percentage numeric(5,2) NOT NULL DEFAULT 21,
  line_total numeric(10,2) NOT NULL,
  sort_order int DEFAULT 0
);

-- ============================================================
-- QUOTE ACTIVITY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quote_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN (
    'created', 'updated', 'sent', 'opened', 'viewed',
    'accepted', 'rejected', 'commented', 'expired', 'duplicated'
  )),
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- QUOTE COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quote_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id uuid REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  author_email text,
  body text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- AUTO updated_at TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER quote_templates_updated_at BEFORE UPDATE ON public.quote_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER quotes_updated_at BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_comments ENABLE ROW LEVEL SECURITY;

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_insert_admin" ON public.profiles
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "profiles_delete_admin" ON public.profiles
  FOR DELETE USING (is_admin());

-- CUSTOMERS policies
CREATE POLICY "customers_select" ON public.customers
  FOR SELECT USING (
    is_admin() OR created_by = auth.uid()
  );

CREATE POLICY "customers_insert" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "customers_update" ON public.customers
  FOR UPDATE USING (is_admin() OR created_by = auth.uid());

CREATE POLICY "customers_delete" ON public.customers
  FOR DELETE USING (is_admin() OR created_by = auth.uid());

-- PRODUCTS policies (all authenticated users read, admin writes)
CREATE POLICY "products_select" ON public.products
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "products_write" ON public.products
  FOR ALL USING (is_admin());

-- PRODUCT CATEGORIES policies
CREATE POLICY "categories_select" ON public.product_categories
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "categories_write" ON public.product_categories
  FOR ALL USING (is_admin());

-- QUOTE TEMPLATES policies
CREATE POLICY "templates_select" ON public.quote_templates
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "templates_write" ON public.quote_templates
  FOR ALL USING (is_admin());

-- QUOTES policies
CREATE POLICY "quotes_select" ON public.quotes
  FOR SELECT USING (
    is_admin() OR user_id = auth.uid()
  );

CREATE POLICY "quotes_insert" ON public.quotes
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "quotes_update" ON public.quotes
  FOR UPDATE USING (is_admin() OR user_id = auth.uid());

CREATE POLICY "quotes_delete" ON public.quotes
  FOR DELETE USING (is_admin() OR user_id = auth.uid());

-- Public read via token (for customer view) — handled in API route, not RLS
-- QUOTE ITEMS policies
CREATE POLICY "quote_items_select" ON public.quote_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_id AND (is_admin() OR q.user_id = auth.uid())
    )
  );

CREATE POLICY "quote_items_write" ON public.quote_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_id AND (is_admin() OR q.user_id = auth.uid())
    )
  );

-- QUOTE ACTIVITY policies
CREATE POLICY "activity_select" ON public.quote_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_id AND (is_admin() OR q.user_id = auth.uid())
    )
  );

CREATE POLICY "activity_insert" ON public.quote_activity
  FOR INSERT WITH CHECK (true); -- controlled via API/service role

-- QUOTE COMMENTS policies
CREATE POLICY "comments_select" ON public.quote_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quotes q
      WHERE q.id = quote_id AND (is_admin() OR q.user_id = auth.uid())
    )
  );

CREATE POLICY "comments_insert" ON public.quote_comments
  FOR INSERT WITH CHECK (true); -- klanten kunnen ook reageren via token

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default product categories
INSERT INTO public.product_categories (name) VALUES
  ('Diensten'),
  ('Software'),
  ('Hardware'),
  ('Onderhoud'),
  ('Overig')
ON CONFLICT DO NOTHING;

-- Default template
INSERT INTO public.quote_templates (name, description, html_content, is_default, is_active) VALUES (
  'Standaard Template',
  'Professionele offerte template met alle standaard velden',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .logo { font-size: 24px; font-weight: bold; color: #1e3a5f; }
    .company-details { text-align: right; font-size: 13px; color: #6b7280; line-height: 1.6; }
    .quote-title { font-size: 32px; font-weight: bold; color: #1e3a5f; margin: 30px 0 10px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
    .meta-block h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin-bottom: 8px; }
    .meta-block p { margin: 2px 0; font-size: 14px; }
    .items-section { margin: 40px 0; }
    .totals { margin-top: 20px; display: flex; justify-content: flex-end; }
    .totals-table { width: 300px; border-collapse: collapse; }
    .totals-table td { padding: 6px 12px; font-size: 14px; }
    .totals-table tr:last-child td { font-size: 18px; font-weight: bold; color: #1e3a5f; border-top: 2px solid #e5e7eb; padding-top: 12px; }
    .message { background: #f0f7ff; border-left: 4px solid #1e3a5f; padding: 16px 20px; margin: 30px 0; border-radius: 4px; }
    .terms { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
    .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #d1d5db; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">{{company_logo}}</div>
    <div class="company-details">{{company_details}}</div>
  </div>

  <div class="quote-title">Offerte {{quote_number}}</div>

  <div class="meta-grid">
    <div class="meta-block">
      <h3>Klant</h3>
      <p><strong>{{company_name}}</strong></p>
      <p>t.a.v. {{customer_name}}</p>
    </div>
    <div class="meta-block">
      <h3>Offerte details</h3>
      <p>Datum: {{quote_date}}</p>
      <p>Geldig tot: {{expiry_date}}</p>
      <p>Opgesteld door: {{user_name}}</p>
    </div>
  </div>

  <div class="items-section">
    {{quote_items}}
  </div>

  <div class="totals">
    <table class="totals-table">
      <tr>
        <td>Subtotaal</td>
        <td style="text-align:right">{{subtotal}}</td>
      </tr>
      <tr>
        <td>Korting</td>
        <td style="text-align:right">{{discount}}</td>
      </tr>
      <tr>
        <td>BTW</td>
        <td style="text-align:right">{{vat_amount}}</td>
      </tr>
      <tr>
        <td>Totaal</td>
        <td style="text-align:right">{{total}}</td>
      </tr>
    </table>
  </div>

  <div class="terms">
    <strong>Voorwaarden:</strong> {{terms}}
  </div>

  <div class="footer">
    Bedankt voor uw interesse — {{company_name}}
  </div>
</body>
</html>',
  true,
  true
) ON CONFLICT DO NOTHING;
