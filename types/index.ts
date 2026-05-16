export type Role = "admin" | "employee";

export interface Company {
  id: string;
  name: string;
  website_url: string | null;
  primary_color: string;
  logo_url: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  kvk_number: string | null;
  vat_number: string | null;
  iban: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  avatar_url: string | null;
  company_id: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  created_by: string;
  company_name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string;
  vat_number: string | null;
  kvk_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  unit: string;
  purchase_price: number | null;
  sale_price: number;
  vat_percentage: number;
  default_margin: number | null;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  description: string | null;
  html_content: string;
  is_default: boolean;
  is_active: boolean;
  auto_expiry: boolean;
  validity_days: number;
  created_at: string;
  updated_at: string;
}

export type QuoteStatus =
  | "concept"
  | "verzonden"
  | "geopend"
  | "bekeken"
  | "geaccepteerd"
  | "afgewezen"
  | "verlopen";

export interface Quote {
  id: string;
  quote_number: string;
  customer_id: string;
  user_id: string;
  template_id: string | null;
  status: QuoteStatus;
  quote_date: string;
  expiry_date: string | null;
  subtotal: number;
  discount_amount: number;
  vat_amount: number;
  total: number;
  public_token: string;
  internal_notes: string | null;
  customer_message: string | null;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  user?: Profile;
  template?: QuoteTemplate;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  product_id: string | null;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percentage: number;
  vat_percentage: number;
  line_total: number;
  sort_order: number;
  product?: Product;
}

export type ActivityAction =
  | "created"
  | "updated"
  | "sent"
  | "opened"
  | "viewed"
  | "accepted"
  | "rejected"
  | "commented"
  | "expired"
  | "duplicated";

export interface QuoteActivity {
  id: string;
  quote_id: string;
  user_id: string | null;
  action: ActivityAction;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user?: Profile;
}

export interface QuoteComment {
  id: string;
  quote_id: string;
  author_name: string;
  author_email: string | null;
  body: string;
  is_internal: boolean;
  created_at: string;
}

// Builder state (Zustand)
export interface BuilderItem {
  id: string; // local temp id
  product_id: string | null;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percentage: number;
  vat_percentage: number;
  line_total: number;
  sort_order: number;
}

export interface BuilderState {
  customer_id: string;
  template_id: string;
  items: BuilderItem[];
  discount_amount: number;
  internal_notes: string;
  customer_message: string;
  expiry_date: string;
}
