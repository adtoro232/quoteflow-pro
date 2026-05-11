-- VDV Airco Offerte Template — exact replica van VDV_Airco_Offerte_Template.docx
-- Voer uit in Supabase SQL Editor: Dashboard > SQL Editor > New query

DELETE FROM public.quote_templates WHERE name = 'VDV Airco Offerte';

INSERT INTO public.quote_templates (name, description, html_content, is_default, is_active)
VALUES (
  'VDV Airco Offerte',
  'Standaard airco offerte voor particulieren — exact nagemaakt naar VDV_Airco_Offerte_Template.docx',
$$
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff; color: #1b2b4b; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">

  <!-- ===== SECTIE 1: PRIJSOVERZICHT ===== -->

  <!-- Sectie header: "🏠 JOUW OPLOSSING  |  VDV INSTALLATIES" -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 2px solid #f07b00;">
    <tr>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold;">
        <span style="color: #f07b00; font-size: 16px;">🏠 </span>JOUW OPLOSSING
      </td>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold; text-align: right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>

  <div style="padding: 18px 20px 0;">
    <!-- "PRIJSOVERZICHT" oranje label + dikke lijn -->
    <p style="color: #f07b00; font-size: 13px; font-weight: 700; margin: 0 0 4px; letter-spacing: 0.05em;">PRIJSOVERZICHT</p>
    <div style="height: 3px; background: #f07b00; margin-bottom: 10px;"></div>

    <!-- Grote donkerblauwe titel -->
    <h2 style="color: #1b2b4b; font-size: 26px; font-weight: 800; margin: 0 0 6px;">Overzicht Investering</h2>
    <div style="height: 3px; background: #f07b00; margin-bottom: 20px;"></div>

    <!-- Regelitems tabel (gegenereerd door systeem) -->
    {{quote_items}}

    <!-- Investering excl. btw rij -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 10px; border-top: 1px solid #dddddd; border-bottom: 1px solid #dddddd;">
      <tr>
        <td style="padding: 10px 4px; color: #555555; font-size: 14px;">Investering exclusief btw</td>
        <td style="padding: 10px 4px; color: #1b2b4b; font-weight: 700; font-size: 14px; text-align: right;">{{subtotal}}</td>
      </tr>
    </table>

    <!-- Investering incl. btw — donkerblauwe balk -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 6px; margin-bottom: 20px; background: #1b2b4b;">
      <tr>
        <td style="padding: 14px 16px; color: #ffffff; font-weight: 700; font-size: 15px;">Investering inclusief btw</td>
        <td style="padding: 14px 16px; color: #ffffff; font-weight: 700; font-size: 24px; text-align: right;">{{total}}</td>
      </tr>
    </table>

    <!-- Disclaimer -->
    <p style="color: #555555; font-size: 13px; margin: 0 0 4px; line-height: 1.5;">
      Deze prijsopgave is een volledige installatie van de airconditioning inclusief materiaal, afwerking en inbedrijfstelling.
    </p>
  </div>

  <!-- ===== KLANTGEGEVENS (zelfde pagina) ===== -->
  <div style="padding: 18px 20px 20px; border-top: 3px solid #f07b00; margin-top: 20px;">
    <p style="color: #f07b00; font-size: 13px; font-weight: 700; margin: 0 0 14px; letter-spacing: 0.05em;">KLANTGEGEVENS</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 9px 0; color: #555555; font-weight: 700; font-size: 14px; width: 28%;">Naam</td>
        <td style="padding: 9px 0; color: #f07b00; font-size: 14px;">{{customer_name}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 9px 0; color: #555555; font-weight: 700; font-size: 14px;">Telefoon</td>
        <td style="padding: 9px 0; color: #f07b00; font-size: 14px;">{{customer_phone}}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 9px 0; color: #555555; font-weight: 700; font-size: 14px;">E-mail</td>
        <td style="padding: 9px 0; color: #f07b00; font-size: 14px;">{{customer_email}}</td>
      </tr>
      <tr>
        <td style="padding: 9px 0; color: #555555; font-weight: 700; font-size: 14px;">Adres</td>
        <td style="padding: 9px 0; color: #f07b00; font-size: 14px;">{{customer_address}}</td>
      </tr>
    </table>
  </div>

  <!-- ===== SECTIE 2: SLIMME INVESTERING ===== -->

  <!-- Sectie header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; border-bottom: 2px solid #f07b00;">
    <tr>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold;">
        <span style="color: #f07b00; font-size: 16px;">🏠 </span>SLIMME INVESTERING
      </td>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold; text-align: right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>

  <div style="padding: 20px 20px 0;">
    <h2 style="color: #1b2b4b; font-size: 26px; font-weight: 800; margin: 0 0 8px;">Waarom een airco een slimme investering is</h2>
    <p style="color: #555555; font-size: 14px; margin: 0 0 20px; line-height: 1.5;">
      Een airco koelt in de zomer en verwarmt in de winter. Efficiënter dan gas, betaalbaar het hele jaar door.
    </p>

    <!-- Vergelijkingstabel: 2 kolommen naast elkaar -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
      <tr valign="top">

        <!-- Linker kolom: MET ZONNEPANELEN -->
        <td width="50%" style="padding-right: 6px;">
          <!-- Oranje header -->
          <div style="background: #f07b00; color: #ffffff; font-weight: 700; font-size: 13px; padding: 9px 13px;">
            ⚡ &nbsp;MET ZONNEPANELEN
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr valign="top">
              <!-- ZONDER AIRCO -->
              <td width="50%" style="background: #f4f4f4; padding: 11px 12px; vertical-align: top;">
                <div style="font-weight: 700; font-size: 12px; color: #1b2b4b; padding-bottom: 7px; margin-bottom: 9px; border-bottom: 1px solid #ddd;">ZONDER AIRCO</div>
                <p style="font-size: 13px; font-weight: 700; color: #222222; margin: 0 0 2px;">⚡ Stroom terug naar net</p>
                <p style="font-size: 12px; color: #555555; margin: 0 0 9px; line-height: 1.4;">Lage terugleveringsvergoeding</p>
                <p style="font-size: 13px; font-weight: 700; color: #222222; margin: 0 0 2px;">☀ Zomer nog steeds warm</p>
                <p style="font-size: 12px; color: #555555; margin: 0 0 9px; line-height: 1.4;">Geen koeling aanwezig</p>
                <p style="font-size: 13px; font-weight: 700; color: #222222; margin: 0 0 2px;">↘ Nog steeds gas voor verwarming</p>
                <p style="font-size: 12px; color: #555555; margin: 0; line-height: 1.4;">~€1.800/jaar gaskosten</p>
              </td>
              <!-- MET AIRCO -->
              <td width="50%" style="background: #3a7d44; padding: 11px 12px; vertical-align: top;">
                <div style="font-weight: 700; font-size: 12px; color: #ffffff; padding-bottom: 7px; margin-bottom: 9px; border-bottom: 1px solid rgba(255,255,255,0.25);">MET AIRCO ✓</div>
                <p style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px;">⚡ Airco draait op eigen stroom</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.75); margin: 0 0 9px; line-height: 1.4;">Koelen kost je nagenoeg niets</p>
                <p style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px;">❄ Verwarmen + koelen gratis</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.75); margin: 0 0 9px; line-height: 1.4;">Maximaal rendement uit panelen</p>
                <p style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px;">✓ Gasrekening: ~€900/jaar</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.75); margin: 0; line-height: 1.4;">€900+ besparing vs. situatie zonder</p>
              </td>
            </tr>
          </table>
        </td>

        <!-- Rechter kolom: ZONDER ZONNEPANELEN -->
        <td width="50%" style="padding-left: 6px;">
          <!-- Oranje header -->
          <div style="background: #f07b00; color: #ffffff; font-weight: 700; font-size: 13px; padding: 9px 13px;">
            🏠 &nbsp;ZONDER ZONNEPANELEN
          </div>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr valign="top">
              <!-- ZONDER AIRCO -->
              <td width="50%" style="background: #f4f4f4; padding: 11px 12px; vertical-align: top;">
                <div style="font-weight: 700; font-size: 12px; color: #1b2b4b; padding-bottom: 7px; margin-bottom: 9px; border-bottom: 1px solid #ddd;">ZONDER AIRCO</div>
                <p style="font-size: 13px; font-weight: 700; color: #222222; margin: 0 0 2px;">🔥 100% verwarmen op gas</p>
                <p style="font-size: 12px; color: #555555; margin: 0 0 9px; line-height: 1.4;">CV-ketel als enige warmtebron</p>
                <p style="font-size: 13px; font-weight: 700; color: #222222; margin: 0 0 2px;">☀ 26°C+ in huis in de zomer</p>
                <p style="font-size: 12px; color: #555555; margin: 0 0 9px; line-height: 1.4;">Slecht slapen, lagere productiviteit</p>
                <p style="font-size: 13px; font-weight: 700; color: #222222; margin: 0 0 2px;">↘ Gasrekening: ~€2.200/jaar</p>
                <p style="font-size: 12px; color: #555555; margin: 0; line-height: 1.4;">Bij gemiddelde tussenwoning</p>
              </td>
              <!-- MET AIRCO -->
              <td width="50%" style="background: #3a7d44; padding: 11px 12px; vertical-align: top;">
                <div style="font-weight: 700; font-size: 12px; color: #ffffff; padding-bottom: 7px; margin-bottom: 9px; border-bottom: 1px solid rgba(255,255,255,0.25);">MET AIRCO ✓</div>
                <p style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px;">❄ Verwarmen + koelen in één</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.75); margin: 0 0 9px; line-height: 1.4;">Heel het jaar comfort</p>
                <p style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px;">⚡ Tot 5x zuiniger dan gas</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.75); margin: 0 0 9px; line-height: 1.4;">Warmtepomp-technologie (COP 4-5)</p>
                <p style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px;">✓ Gasrekening: ~€1.400/jaar</p>
                <p style="font-size: 12px; color: rgba(255,255,255,0.75); margin: 0; line-height: 1.4;">€800+ besparing per jaar</p>
              </td>
            </tr>
          </table>
        </td>

      </tr>
    </table>

    <!-- Rekenvoorbeeld — donkerblauwe balk met oranje besparingsvakken -->
    <div style="background: #1b2b4b; border-radius: 6px; padding: 18px 20px; margin-bottom: 24px;">
      <h3 style="color: #ffffff; font-size: 18px; font-weight: 700; margin: 0 0 8px;">Rekenvoorbeeld</h3>
      <p style="color: #aaaaaa; font-size: 13px; margin: 0 0 6px; line-height: 1.5;">
        Een airco verbruikt minder energie dan traditionele verwarming en koeling. Hoeveel je bespaart hangt af van je woningtype, isolatie, het aantal ruimtes en je energietarief.
      </p>
      <p style="color: #aaaaaa; font-size: 13px; margin: 0 0 16px; line-height: 1.5;">
        Zonder zonnepanelen bespaar je al snel <span style="color: #f07b00; font-weight: 700;">€800+/jaar</span>. Heb je wél zonnepanelen? Dan draait de airco deels op gratis stroom en loopt de besparing op tot <span style="color: #f07b00; font-weight: 700;">€1.000+/jaar</span>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding-right: 6px;">
            <div style="background: #f07b00; border-radius: 6px; padding: 16px; text-align: center;">
              <div style="color: rgba(255,255,255,0.75); font-size: 12px; margin-bottom: 4px;">Zonder panelen</div>
              <div style="color: #ffffff; font-size: 32px; font-weight: 800; line-height: 1;">€800+</div>
              <div style="color: rgba(255,255,255,0.75); font-size: 12px; margin-top: 4px;">per jaar</div>
            </div>
          </td>
          <td width="50%" style="padding-left: 6px;">
            <div style="background: #f07b00; border-radius: 6px; padding: 16px; text-align: center;">
              <div style="color: rgba(255,255,255,0.75); font-size: 12px; margin-bottom: 4px;">Met panelen</div>
              <div style="color: #ffffff; font-size: 32px; font-weight: 800; line-height: 1;">€1.300+</div>
              <div style="color: rgba(255,255,255,0.75); font-size: 12px; margin-top: 4px;">per jaar</div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>

  <!-- ===== SECTIE 3: LOKALE EXPERT ===== -->

  <!-- Sectie header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; border-bottom: 2px solid #f07b00;">
    <tr>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold;">
        <span style="color: #f07b00; font-size: 16px;">🏠 </span>LOKALE EXPERT
      </td>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold; text-align: right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>

  <div style="padding: 20px 20px 0;">
    <h2 style="color: #1b2b4b; font-size: 26px; font-weight: 800; margin: 0 0 16px;">Waarom klanten kiezen voor VDV Installaties</h2>

    <!-- USP balk: 3 kolommen op donkerblauwe achtergrond -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #1b2b4b; border-radius: 6px; margin-bottom: 14px;">
      <tr>
        <td width="33%" style="padding: 16px 14px; text-align: center; border-right: 1px solid rgba(255,255,255,0.12); vertical-align: top;">
          <div style="color: #ffffff; font-weight: 700; font-size: 14px; margin-bottom: 5px;">🏠 Lokaal bedrijf</div>
          <div style="color: #aaaaaa; font-size: 12px; line-height: 1.4;">Gevestigd in Aarle-Rixtel (Noord-Brabant)</div>
        </td>
        <td width="33%" style="padding: 16px 14px; text-align: center; border-right: 1px solid rgba(255,255,255,0.12); vertical-align: top;">
          <div style="color: #ffffff; font-weight: 700; font-size: 14px; margin-bottom: 5px;">🛡️ 5 jaar garantie</div>
          <div style="color: #aaaaaa; font-size: 12px; line-height: 1.4;">Op iedere installatie</div>
        </td>
        <td width="34%" style="padding: 16px 14px; text-align: center; vertical-align: top;">
          <div style="color: #ffffff; font-weight: 700; font-size: 14px; margin-bottom: 5px;">✅ Erkend installateur</div>
          <div style="color: #aaaaaa; font-size: 12px; line-height: 1.4;">F-gassen gecertificeerd</div>
        </td>
      </tr>
    </table>

    <!-- Google review balk -->
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 11px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: #1b2b4b;">
      <span style="background: #4285f4; color: #ffffff; font-weight: 700; font-size: 13px; padding: 2px 8px; border-radius: 3px; margin-right: 6px;">G</span>
      <span style="color: #f07b00; font-size: 16px; letter-spacing: 1px;">★★★★★</span>
      &nbsp;&nbsp;4,8 &nbsp;|&nbsp; 62 reviews &nbsp;|&nbsp; 500+ tevreden klanten
    </div>

    <!-- Reviews: 2-koloms raster -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
      <tr valign="top">
        <!-- Linker kolom reviews -->
        <td width="50%" style="padding-right: 7px;">

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="color: #f07b00; font-size: 15px; margin-bottom: 7px; letter-spacing: 1px;">★★★★★</div>
            <p style="color: #555555; font-size: 13px; font-style: italic; margin: 0 0 8px; line-height: 1.55;">"VDV heeft bij ons een Mitsubishi airco geplaatst en daar zijn we heel tevreden over. Willem is een aardige, rustige en zorgvuldige vakman. Hij komt afspraken na en informeert bij wijzigingen. Een aanrader! Dank je wel, Willem!"</p>
            <div style="color: #1b2b4b; font-weight: 700; font-size: 13px;">Marjon van Dorp</div>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="color: #f07b00; font-size: 15px; margin-bottom: 7px; letter-spacing: 1px;">★★★★★</div>
            <p style="color: #555555; font-size: 13px; font-style: italic; margin: 0 0 8px; line-height: 1.55;">"Wij hebben door VDV Installaties een Daikin Comfora airco laten plaatsen en daar zijn we zeer tevreden over. Wij zijn keurig door Willem op de hoogte gehouden van de gang van zaken. Airco is door Willem en collega zeer netjes geplaatst."</p>
            <div style="color: #1b2b4b; font-weight: 700; font-size: 13px;">Gerard</div>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
            <div style="color: #f07b00; font-size: 15px; margin-bottom: 7px; letter-spacing: 1px;">★★★★★</div>
            <p style="color: #555555; font-size: 13px; font-style: italic; margin: 0 0 8px; line-height: 1.55;">"Mannen, het was top: eerst kundig advies, toen een goede offerte, waarna een perfecte plaatsing met uitgebreide uitleg over de bediening. Kortom: klasse!"</p>
            <div style="color: #1b2b4b; font-weight: 700; font-size: 13px;">Jasper B.</div>
          </div>

        </td>

        <!-- Rechter kolom reviews -->
        <td width="50%" style="padding-left: 7px;">

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="color: #f07b00; font-size: 15px; margin-bottom: 7px; letter-spacing: 1px;">★★★★★</div>
            <p style="color: #555555; font-size: 13px; font-style: italic; margin: 0 0 8px; line-height: 1.55;">"Ik ben super tevreden over de professionele manier waarop alles snel en tot tevredenheid is geregeld. Het waren rustige vriendelijke mannen die een erg goede indruk hebben achtergelaten. Nog bedankt jongens!"</p>
            <div style="color: #1b2b4b; font-weight: 700; font-size: 13px;">Carlo van Lierop</div>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 10px;">
            <div style="color: #f07b00; font-size: 15px; margin-bottom: 7px; letter-spacing: 1px;">★★★★★</div>
            <p style="color: #555555; font-size: 13px; font-style: italic; margin: 0 0 8px; line-height: 1.55;">"Fantastische service! Duidelijke uitleg, goede planning en heldere afspraken. De installatie werd professioneel en netjes uitgevoerd. Ze dachten mee over de beste plaatsing. Een betrouwbaar bedrijf met vakmensen. Absoluut een aanrader!"</p>
            <div style="color: #1b2b4b; font-weight: 700; font-size: 13px;">Mart Ramaekers</div>
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
            <div style="color: #f07b00; font-size: 15px; margin-bottom: 7px; letter-spacing: 1px;">★★★★★</div>
            <p style="color: #555555; font-size: 13px; font-style: italic; margin: 0 0 8px; line-height: 1.55;">"Onwijs goed en snel geholpen door Willem en Bram! Afspraak gemaakt voor een 5kW LG airco, ook voor een hele scherpe prijs ten opzichte van de concurrentie. Een echt aanrader als je het mij vraagt!"</p>
            <div style="color: #1b2b4b; font-weight: 700; font-size: 13px;">Bekijk alle Google reviews →</div>
          </div>

        </td>
      </tr>
    </table>

    <p style="color: #f07b00; font-weight: 700; font-size: 13px; margin: 0 0 24px; text-align: right;">
      Bekijk al onze Google reviews via de link in de mail &nbsp;→
    </p>
  </div>

  <!-- ===== SECTIE 4: VEELGESTELDE VRAGEN ===== -->

  <!-- Sectie header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; border-bottom: 2px solid #f07b00;">
    <tr>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold;">
        <span style="color: #f07b00; font-size: 16px;">🏠 </span>VEELGESTELDE VRAGEN
      </td>
      <td style="padding: 12px 20px; font-size: 14px; color: #1b2b4b; font-weight: bold; text-align: right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>

  <!-- FAQ intro: donkerblauw blok met grote titel -->
  <div style="background: #1b2b4b; padding: 20px 20px 18px;">
    <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0 0 6px;">Alles wat je wil weten over airco installatie</h2>
    <p style="color: #aaaaaa; font-size: 13px; margin: 0; line-height: 1.5;">De meest gestelde vragen van onze klanten beantwoord.</p>
  </div>

  <!-- FAQ items -->
  <div style="background: #ffffff; padding: 0 20px;">

    <div style="border-bottom: 1px solid #f1f5f9; padding: 16px 0;">
      <p style="font-weight: 700; font-size: 14px; color: #1b2b4b; margin: 0 0 5px;">Hoe lang duurt een installatie?</p>
      <p style="color: #555555; font-size: 13px; margin: 0; line-height: 1.6;">Een standaard single-split installatie duurt gemiddeld 4–6 uur. Een multi-split systeem met meerdere binnenunits kan 1–2 dagen in beslag nemen.</p>
    </div>

    <div style="border-bottom: 1px solid #f1f5f9; padding: 16px 0;">
      <p style="font-weight: 700; font-size: 14px; color: #1b2b4b; margin: 0 0 5px;">Heb ik een vergunning nodig?</p>
      <p style="color: #555555; font-size: 13px; margin: 0; line-height: 1.6;">In de meeste gevallen niet. Voor een buitenunit op de gevel of het dak is soms een omgevingsvergunning nodig. Wij informeren je hier altijd over.</p>
    </div>

    <div style="border-bottom: 1px solid #f1f5f9; padding: 16px 0;">
      <p style="font-weight: 700; font-size: 14px; color: #1b2b4b; margin: 0 0 5px;">Met welke merken werken jullie?</p>
      <p style="color: #555555; font-size: 13px; margin: 0; line-height: 1.6;">Wij installeren uitsluitend A-merken: LG, Mitsubishi en Daikin. Betrouwbare merken met lange levensduur, hoog rendement en uitstekende garanties.</p>
    </div>

    <div style="border-bottom: 1px solid #f1f5f9; padding: 16px 0;">
      <p style="font-weight: 700; font-size: 14px; color: #1b2b4b; margin: 0 0 5px;">Hoe energiezuinig is een airco?</p>
      <p style="color: #555555; font-size: 13px; margin: 0; line-height: 1.6;">Moderne A+++ airco's zijn zeer energiezuinig. Bij verwarmen is een airco (warmtepomp) 3 tot 4 keer goedkoper dan gas. Dit komt doordat een airco voor elke kWh stroom gemiddeld 3–4 kWh warmte levert. Bij koelen verbruikt een gemiddelde split-unit tussen de 0,5 en 1,5 kWh per uur.</p>
    </div>

    <div style="border-bottom: 1px solid #f1f5f9; padding: 16px 0;">
      <p style="font-weight: 700; font-size: 14px; color: #1b2b4b; margin: 0 0 5px;">Wat kost een airco inclusief installatie?</p>
      <p style="color: #555555; font-size: 13px; margin: 0; line-height: 1.6;">Een single-split airco inclusief installatie begint vanaf €1.299. Een multi-split systeem start vanaf €2.800. Altijd inclusief btw en 5 jaar installatiegarantie.</p>
    </div>

    <div style="padding: 16px 0;">
      <p style="font-weight: 700; font-size: 14px; color: #1b2b4b; margin: 0 0 5px;">Hoe vaak moet een airco onderhouden worden?</p>
      <p style="color: #555555; font-size: 13px; margin: 0; line-height: 1.6;">Wij adviseren jaarlijks onderhoud voor optimale prestaties en levensduur. Dit omvat het reinigen van filters, controleren van het koudemiddel en inspecteren van alle onderdelen. We bieden ook onderhoudsabonnementen aan.</p>
    </div>

  </div>

  <!-- Afsluitende donkerblauwe balk -->
  <div style="background: #1b2b4b; padding: 16px 20px; border-radius: 0 0 8px 8px;">
    <p style="color: #ffffff; font-weight: 700; font-size: 14px; margin: 0;">Andere vraag? We helpen je graag!</p>
  </div>

</div>
$$,
  true,
  true
);
