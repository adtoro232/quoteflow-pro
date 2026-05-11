# QuoteFlow Pro — Setup Handleiding

## Vereisten

- Node.js 18+ (download via https://nodejs.org)
- Een Supabase account (gratis via https://supabase.com)

---

## Stap 1: Node.js installeren

Download en installeer Node.js 18+ van https://nodejs.org.
Controleer na installatie:
```bash
node --version   # moet >= 18.0.0 zijn
npm --version
```

---

## Stap 2: Supabase project aanmaken

1. Ga naar https://supabase.com en maak een account aan
2. Maak een nieuw project aan (kies regio: `eu-west-2` voor Europa)
3. Ga naar **Settings > API**
4. Kopieer:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Stap 3: Database schema instellen

1. Ga naar **SQL Editor** in uw Supabase dashboard
2. Klik **New query**
3. Kopieer de volledige inhoud van `supabase/migrations/001_initial_schema.sql`
4. Plak en voer uit (**Run**)

Dit maakt alle tabellen, triggers, RLS policies en seed data aan.

---

## Stap 4: Environment variabelen instellen

Bewerk het bestand `.env.local` en vul uw gegevens in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uw-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=uw-anon-key

NEXT_PUBLIC_COMPANY_NAME=Uw Bedrijfsnaam
NEXT_PUBLIC_COMPANY_ADDRESS=Straatnaam 1, 1234 AB Stad
NEXT_PUBLIC_COMPANY_KVK=12345678
NEXT_PUBLIC_COMPANY_VAT=NL123456789B01
NEXT_PUBLIC_COMPANY_EMAIL=info@uwbedrijf.nl
NEXT_PUBLIC_COMPANY_PHONE=+31 6 12345678
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Stap 5: Applicatie starten

```bash
cd quoteflow-pro
npm install
npm run dev
```

Open http://localhost:3000

---

## Stap 6: Eerste admin aanmaken

1. Ga naar uw Supabase dashboard → **Authentication > Users**
2. Klik **Add user** → **Create new user**
3. Vul e-mail en wachtwoord in
4. Ga naar **SQL Editor** en voer uit:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'uw-user-id-hier';
```
   (vervang met de UUID van de nieuw aangemaakte gebruiker)

5. Log in op http://localhost:3000/login

---

## Stap 7: Offerte verlopen (automatisch)

Voeg een dagelijkse cron job toe om verlopen offertes bij te werken:

**Optie A — Supabase Edge Functions:**
Maak een Edge Function die dagelijks `/api/cron/expire-quotes` aanroept.

**Optie B — Externe cron service:**
Gebruik cron-job.org of GitHub Actions om dagelijks te roepen:
```
GET https://uwapp.nl/api/cron/expire-quotes
Authorization: Bearer CRON_SECRET
```
Voeg `CRON_SECRET=uw-geheim` toe aan `.env.local`.

---

## Productie deployment

### Vercel (aanbevolen)
```bash
npm install -g vercel
vercel
```
Voeg alle env variabelen toe via Vercel dashboard.

### Wijzig APP_URL
Zet `NEXT_PUBLIC_APP_URL=https://uwdomein.nl` in productie.

---

## Structuur samenvatting

```
quoteflow-pro/
├── app/
│   ├── (auth)/login/          → Inlogpagina
│   ├── (dashboard)/           → Beschermde dashboard pagina's
│   │   ├── dashboard/         → KPI overzicht
│   │   ├── quotes/            → Offertes (lijst, nieuw, detail)
│   │   ├── customers/         → Klantenbeheer
│   │   ├── products/          → Productcatalogus
│   │   ├── templates/         → Template beheer (admin)
│   │   └── settings/          → Gebruikersbeheer (admin)
│   ├── quote/[token]/         → Publieke klantpagina
│   └── api/
│       ├── pdf/[id]/          → PDF generatie
│       └── cron/expire-quotes → Verlopen offertes
├── components/
│   ├── quotes/                → Builder, status badge, timeline, etc.
│   ├── customers/             → Klantformulieren
│   ├── products/              → Productformulieren
│   ├── settings/              → Gebruikersbeheer
│   ├── layout/                → Sidebar, topbar
│   └── ui/                    → Basis UI componenten
├── lib/
│   ├── supabase/              → Client & server helpers
│   ├── pdf/                   → react-pdf template
│   └── utils/                 → Berekeningen, renderTemplate
├── hooks/
│   ├── use-quote-builder.ts   → Zustand store voor offerte wizard
│   └── use-toast.ts           → Toast notificaties
├── types/index.ts             → TypeScript types
└── supabase/migrations/       → SQL schema
```

---

## Rollen & toegang

| Feature | Admin | Medewerker | Klant |
|---------|-------|-----------|-------|
| Eigen offertes zien | ✓ | ✓ | (via link) |
| Alle offertes zien | ✓ | — | — |
| Klanten beheren | ✓ | Eigen | — |
| Producten beheren | ✓ | — (alleen lezen) | — |
| Templates beheren | ✓ | — | — |
| Gebruikers beheren | ✓ | — | — |
| Status handmatig wijzigen | ✓ | — | — |
| Offerte accepteren/afwijzen | — | — | ✓ |
| PDF downloaden | ✓ | ✓ | ✓ |
