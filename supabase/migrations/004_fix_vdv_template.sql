-- Fix VDV template: vervang Google Doc import met exacte DOCX replica
-- Voer uit in Supabase SQL Editor

-- Update het specifieke template dat je nu bekijkt
-- EN elk ander template dat al "VDV Airco Offerte" heet
UPDATE public.quote_templates
SET
  name = 'VDV Airco Offerte',
  description = 'Exacte replica van VDV_Airco_Offerte_Template.docx',
  is_default = true,
  is_active = true,
  html_content = $$
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff; color: #1b2b4b; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;">

  <!-- SECTIE HEADER: JOUW OPLOSSING -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold;">
        <span style="color:#f07b00;">🏠 </span>JOUW OPLOSSING
      </td>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold; text-align:right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>
  <div style="height:2px; background:#f07b00;"></div>

  <div style="padding:16px 20px 0;">
    <p style="color:#f07b00; font-size:13px; font-weight:700; margin:0 0 3px; letter-spacing:0.05em; text-transform:uppercase;">PRIJSOVERZICHT</p>
    <div style="height:3px; background:#f07b00; margin-bottom:8px;"></div>
    <h2 style="color:#1b2b4b; font-size:28px; font-weight:800; margin:0 0 4px; letter-spacing:-0.01em;">Overzicht Investering</h2>
    <div style="height:3px; background:#f07b00; margin-bottom:18px;"></div>

    <!-- Regelitems -->
    {{quote_items}}

    <!-- Excl. btw rij -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr style="border-top:1px solid #dddddd; border-bottom:1px solid #dddddd;">
        <td style="padding:9px 4px; color:#555555; font-size:13px;">Investering exclusief btw</td>
        <td style="padding:9px 4px; color:#1b2b4b; font-weight:700; font-size:13px; text-align:right;">{{subtotal}}</td>
      </tr>
    </table>

    <!-- Incl. btw — donkerblauwe balk -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:5px; margin-bottom:18px;">
      <tr>
        <td style="background:#1b2b4b; padding:13px 16px; color:#ffffff; font-weight:700; font-size:14px;">Investering inclusief btw</td>
        <td style="background:#1b2b4b; padding:13px 16px; color:#ffffff; font-weight:800; font-size:22px; text-align:right;">{{total}}</td>
      </tr>
    </table>

    <p style="color:#555555; font-size:13px; margin:0 0 18px; line-height:1.5;">
      Deze prijsopgave is een volledige installatie van de airconditioning inclusief materiaal, afwerking en inbedrijfstelling.
    </p>
  </div>

  <!-- KLANTGEGEVENS -->
  <div style="height:3px; background:#f07b00; margin-top:4px;"></div>
  <div style="padding:14px 20px 18px;">
    <p style="color:#f07b00; font-size:12px; font-weight:700; margin:0 0 12px; text-transform:uppercase; letter-spacing:0.06em;">KLANTGEGEVENS</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding:7px 10px 7px 0; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:13px; display:block;">Naam</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_name}}</span>
        </td>
        <td width="50%" style="padding:7px 0 7px 10px; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:13px; display:block;">Telefoon</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_phone}}</span>
        </td>
      </tr>
      <tr>
        <td width="50%" style="padding:7px 10px 7px 0; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:13px; display:block;">E-mail</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_email}}</span>
        </td>
        <td width="50%" style="padding:7px 0 7px 10px; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:13px; display:block;">Adres</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_address}}</span>
        </td>
      </tr>
    </table>
  </div>

  <!-- SECTIE HEADER: SLIMME INVESTERING -->
  <div style="height:3px; background:#f07b00;"></div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold;">
        <span style="color:#f07b00;">🏠 </span>SLIMME INVESTERING
      </td>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold; text-align:right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>
  <div style="height:2px; background:#f07b00;"></div>

  <div style="padding:16px 20px 0;">
    <h2 style="color:#1b2b4b; font-size:28px; font-weight:800; margin:0 0 8px;">Waarom een airco een slimme investering is</h2>
    <p style="color:#555555; font-size:13px; margin:0 0 16px; line-height:1.5;">Een airco koelt in de zomer en verwarmt in de winter. Efficiënter dan gas, betaalbaar het hele jaar door.</p>

    <!-- Vergelijkingstabel MET ZONNEPANELEN -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px; border:1px solid #e0e0e0;">
      <tr>
        <td colspan="2" style="background:#f07b00; padding:8px 12px; color:#ffffff; font-weight:700; font-size:13px;">⚡ &nbsp;MET ZONNEPANELEN</td>
      </tr>
      <tr valign="top">
        <td width="50%" style="background:#f4f4f4; padding:12px; border-right:1px solid #e0e0e0; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#1b2b4b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid #dddddd;">ZONDER AIRCO</div>
          <p style="font-size:13px; font-weight:700; color:#222222; margin:0 0 1px;">⚡ Stroom terug naar net</p>
          <p style="font-size:12px; color:#555555; margin:0 0 8px; line-height:1.4;">Lage terugleveringsvergoeding</p>
          <p style="font-size:13px; font-weight:700; color:#222222; margin:0 0 1px;">☀ Zomer nog steeds warm</p>
          <p style="font-size:12px; color:#555555; margin:0 0 8px; line-height:1.4;">Geen koeling aanwezig</p>
          <p style="font-size:13px; font-weight:700; color:#222222; margin:0 0 1px;">↘ Nog steeds gas voor verwarming</p>
          <p style="font-size:12px; color:#555555; margin:0; line-height:1.4;">~€1.800/jaar gaskosten</p>
        </td>
        <td width="50%" style="background:#3a7d44; padding:12px; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#ffffff; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.3);">MET AIRCO ✓</div>
          <p style="font-size:13px; font-weight:700; color:#ffffff; margin:0 0 1px;">⚡ Airco draait op eigen stroom</p>
          <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:0 0 8px; line-height:1.4;">Koelen kost je nagenoeg niets</p>
          <p style="font-size:13px; font-weight:700; color:#ffffff; margin:0 0 1px;">❄ Verwarmen + koelen gratis</p>
          <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:0 0 8px; line-height:1.4;">Maximaal rendement uit panelen</p>
          <p style="font-size:13px; font-weight:700; color:#ffffff; margin:0 0 1px;">✓ Gasrekening: ~€900/jaar</p>
          <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:0; line-height:1.4;">€900+ besparing vs. situatie zonder</p>
        </td>
      </tr>
    </table>

    <!-- Vergelijkingstabel ZONDER ZONNEPANELEN -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px; border:1px solid #e0e0e0;">
      <tr>
        <td colspan="2" style="background:#f07b00; padding:8px 12px; color:#ffffff; font-weight:700; font-size:13px;">🏠 &nbsp;ZONDER ZONNEPANELEN</td>
      </tr>
      <tr valign="top">
        <td width="50%" style="background:#f4f4f4; padding:12px; border-right:1px solid #e0e0e0; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#1b2b4b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid #dddddd;">ZONDER AIRCO</div>
          <p style="font-size:13px; font-weight:700; color:#222222; margin:0 0 1px;">🔥 100% verwarmen op gas</p>
          <p style="font-size:12px; color:#555555; margin:0 0 8px; line-height:1.4;">CV-ketel als enige warmtebron</p>
          <p style="font-size:13px; font-weight:700; color:#222222; margin:0 0 1px;">☀ 26°C+ in huis in de zomer</p>
          <p style="font-size:12px; color:#555555; margin:0 0 8px; line-height:1.4;">Slecht slapen, lagere productiviteit</p>
          <p style="font-size:13px; font-weight:700; color:#222222; margin:0 0 1px;">↘ Gasrekening: ~€2.200/jaar</p>
          <p style="font-size:12px; color:#555555; margin:0; line-height:1.4;">Bij gemiddelde tussenwoning</p>
        </td>
        <td width="50%" style="background:#3a7d44; padding:12px; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#ffffff; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:8px; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.3);">MET AIRCO ✓</div>
          <p style="font-size:13px; font-weight:700; color:#ffffff; margin:0 0 1px;">❄ Verwarmen + koelen in één</p>
          <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:0 0 8px; line-height:1.4;">Heel het jaar comfort</p>
          <p style="font-size:13px; font-weight:700; color:#ffffff; margin:0 0 1px;">⚡ Tot 5x zuiniger dan gas</p>
          <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:0 0 8px; line-height:1.4;">Warmtepomp-technologie (COP 4-5)</p>
          <p style="font-size:13px; font-weight:700; color:#ffffff; margin:0 0 1px;">✓ Gasrekening: ~€1.400/jaar</p>
          <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:0; line-height:1.4;">€800+ besparing per jaar</p>
        </td>
      </tr>
    </table>

    <!-- Rekenvoorbeeld — donkerblauwe achtergrond -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px; background:#1b2b4b; border-radius:4px;">
      <tr>
        <td style="padding:16px 18px 10px;">
          <h3 style="color:#ffffff; font-size:17px; font-weight:700; margin:0 0 6px;">Rekenvoorbeeld</h3>
          <p style="color:#aaaaaa; font-size:13px; margin:0 0 5px; line-height:1.5;">Een airco verbruikt minder energie dan traditionele verwarming en koeling. Hoeveel je bespaart hangt af van je woningtype, isolatie, het aantal ruimtes en je energietarief.</p>
          <p style="color:#aaaaaa; font-size:13px; margin:0 0 14px; line-height:1.5;">Zonder zonnepanelen bespaar je al snel <span style="color:#f07b00; font-weight:700;">€800+/jaar</span>. Heb je wél zonnepanelen? Dan draait de airco deels op gratis stroom en loopt de besparing op tot <span style="color:#f07b00; font-weight:700;">€1.300+/jaar</span>.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 18px 18px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="50%" style="padding-right:5px;">
                <div style="background:#f07b00; border-radius:4px; padding:14px; text-align:center;">
                  <div style="color:rgba(255,255,255,0.8); font-size:11px; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.05em;">Zonder panelen</div>
                  <div style="color:#ffffff; font-size:30px; font-weight:800; line-height:1.1;">€800+</div>
                  <div style="color:rgba(255,255,255,0.8); font-size:11px; margin-top:4px;">per jaar</div>
                </div>
              </td>
              <td width="50%" style="padding-left:5px;">
                <div style="background:#f07b00; border-radius:4px; padding:14px; text-align:center;">
                  <div style="color:rgba(255,255,255,0.8); font-size:11px; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.05em;">Met panelen</div>
                  <div style="color:#ffffff; font-size:30px; font-weight:800; line-height:1.1;">€1.300+</div>
                  <div style="color:rgba(255,255,255,0.8); font-size:11px; margin-top:4px;">per jaar</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>

  <!-- SECTIE HEADER: LOKALE EXPERT -->
  <div style="height:3px; background:#f07b00;"></div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold;">
        <span style="color:#f07b00;">🏠 </span>LOKALE EXPERT
      </td>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold; text-align:right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>
  <div style="height:2px; background:#f07b00;"></div>

  <div style="padding:16px 20px 0;">
    <h2 style="color:#1b2b4b; font-size:28px; font-weight:800; margin:0 0 14px;">Waarom klanten kiezen voor VDV Installaties</h2>

    <!-- USP: 3 kolommen donkerblauwe balk -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1b2b4b; margin-bottom:12px;">
      <tr valign="top">
        <td width="33%" style="padding:14px 14px; text-align:center; border-right:1px solid rgba(255,255,255,0.1);">
          <div style="color:#ffffff; font-weight:700; font-size:13px; margin-bottom:4px;">🏠 Lokaal bedrijf</div>
          <div style="color:#aaaaaa; font-size:12px; line-height:1.4;">Gevestigd in Aarle-Rixtel (Noord-Brabant)</div>
        </td>
        <td width="33%" style="padding:14px 14px; text-align:center; border-right:1px solid rgba(255,255,255,0.1);">
          <div style="color:#ffffff; font-weight:700; font-size:13px; margin-bottom:4px;">🛡️ 5 jaar garantie</div>
          <div style="color:#aaaaaa; font-size:12px; line-height:1.4;">Op iedere installatie</div>
        </td>
        <td width="34%" style="padding:14px 14px; text-align:center;">
          <div style="color:#ffffff; font-weight:700; font-size:13px; margin-bottom:4px;">✅ Erkend installateur</div>
          <div style="color:#aaaaaa; font-size:12px; line-height:1.4;">F-gassen gecertificeerd</div>
        </td>
      </tr>
    </table>

    <!-- Google score balk -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px; border:1px solid #e0e0e0;">
      <tr>
        <td style="padding:10px 14px;">
          <span style="background:#4285f4; color:#fff; font-weight:700; font-size:12px; padding:2px 7px; border-radius:2px; margin-right:8px;">G</span>
          <span style="color:#f07b00; font-size:16px; letter-spacing:1px; vertical-align:middle;">★★★★★</span>
          <span style="color:#1b2b4b; font-weight:700; font-size:13px; margin-left:8px;">4,8 &nbsp;|&nbsp; 62 reviews &nbsp;|&nbsp; 500+ tevreden klanten</span>
        </td>
      </tr>
    </table>

    <!-- Reviews: 2 kolommen -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr valign="top">
        <td width="50%" style="padding-right:6px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:8px;">
            <tr><td style="padding:12px 14px;">
              <div style="color:#f07b00; font-size:15px; letter-spacing:1px; margin-bottom:6px;">★★★★★</div>
              <p style="color:#555555; font-size:12px; font-style:italic; margin:0 0 7px; line-height:1.55;">"VDV heeft bij ons een Mitsubishi airco geplaatst en daar zijn we heel tevreden over. Willem is een aardige, rustige en zorgvuldige vakman. Hij komt afspraken na en informeert bij wijzigingen. Een aanrader!"</p>
              <div style="color:#1b2b4b; font-weight:700; font-size:12px;">Marjon van Dorp</div>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:8px;">
            <tr><td style="padding:12px 14px;">
              <div style="color:#f07b00; font-size:15px; letter-spacing:1px; margin-bottom:6px;">★★★★★</div>
              <p style="color:#555555; font-size:12px; font-style:italic; margin:0 0 7px; line-height:1.55;">"Wij hebben door VDV Installaties een Daikin Comfora airco laten plaatsen en daar zijn we zeer tevreden over. Wij zijn keurig door Willem op de hoogte gehouden. Netjes geplaatst."</p>
              <div style="color:#1b2b4b; font-weight:700; font-size:12px;">Gerard</div>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;">
            <tr><td style="padding:12px 14px;">
              <div style="color:#f07b00; font-size:15px; letter-spacing:1px; margin-bottom:6px;">★★★★★</div>
              <p style="color:#555555; font-size:12px; font-style:italic; margin:0 0 7px; line-height:1.55;">"Mannen, het was top: eerst kundig advies, toen een goede offerte, waarna een perfecte plaatsing met uitgebreide uitleg over de bediening. Kortom: klasse!"</p>
              <div style="color:#1b2b4b; font-weight:700; font-size:12px;">Jasper B.</div>
            </td></tr>
          </table>
        </td>
        <td width="50%" style="padding-left:6px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:8px;">
            <tr><td style="padding:12px 14px;">
              <div style="color:#f07b00; font-size:15px; letter-spacing:1px; margin-bottom:6px;">★★★★★</div>
              <p style="color:#555555; font-size:12px; font-style:italic; margin:0 0 7px; line-height:1.55;">"Ik ben super tevreden over de professionele manier waarop alles snel en tot tevredenheid is geregeld. Het waren rustige vriendelijke mannen die een erg goede indruk hebben achtergelaten."</p>
              <div style="color:#1b2b4b; font-weight:700; font-size:12px;">Carlo van Lierop</div>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:8px;">
            <tr><td style="padding:12px 14px;">
              <div style="color:#f07b00; font-size:15px; letter-spacing:1px; margin-bottom:6px;">★★★★★</div>
              <p style="color:#555555; font-size:12px; font-style:italic; margin:0 0 7px; line-height:1.55;">"Fantastische service! Duidelijke uitleg, goede planning en heldere afspraken. De installatie werd professioneel en netjes uitgevoerd. Ze dachten mee over de beste plaatsing. Absoluut een aanrader!"</p>
              <div style="color:#1b2b4b; font-weight:700; font-size:12px;">Mart Ramaekers</div>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;">
            <tr><td style="padding:12px 14px;">
              <div style="color:#f07b00; font-size:15px; letter-spacing:1px; margin-bottom:6px;">★★★★★</div>
              <p style="color:#555555; font-size:12px; font-style:italic; margin:0 0 7px; line-height:1.55;">"Onwijs goed en snel geholpen door Willem en Bram! Afspraak gemaakt voor een 5kW LG airco, ook voor een scherpe prijs. Een echt aanrader als je het mij vraagt!"</p>
              <div style="color:#1b2b4b; font-weight:700; font-size:12px;">Bekijk alle Google reviews →</div>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="color:#f07b00; font-weight:700; font-size:12px; text-align:right; margin:4px 0 20px;">
      Bekijk al onze Google reviews via de link in de mail &nbsp;→
    </p>
  </div>

  <!-- SECTIE HEADER: VEELGESTELDE VRAGEN -->
  <div style="height:3px; background:#f07b00;"></div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold;">
        <span style="color:#f07b00;">🏠 </span>VEELGESTELDE VRAGEN
      </td>
      <td style="padding:12px 20px 8px; font-size:14px; color:#1b2b4b; font-weight:bold; text-align:right;">
        VDV INSTALLATIES
      </td>
    </tr>
  </table>
  <div style="height:2px; background:#f07b00;"></div>

  <!-- FAQ intro: donkerblauw blok -->
  <div style="background:#1b2b4b; padding:18px 20px;">
    <h2 style="color:#ffffff; font-size:28px; font-weight:800; margin:0 0 5px;">Alles wat je wil weten over airco installatie</h2>
    <p style="color:#aaaaaa; font-size:13px; margin:0; line-height:1.5;">De meest gestelde vragen van onze klanten beantwoord.</p>
  </div>

  <!-- FAQ items -->
  <div style="padding:0 20px; background:#ffffff;">
    <div style="padding:14px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:14px; color:#1b2b4b; margin:0 0 4px;">Hoe lang duurt een installatie?</p>
      <p style="color:#555555; font-size:13px; margin:0; line-height:1.6;">Een standaard single-split installatie duurt gemiddeld 4–6 uur. Een multi-split systeem met meerdere binnenunits kan 1–2 dagen in beslag nemen.</p>
    </div>
    <div style="padding:14px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:14px; color:#1b2b4b; margin:0 0 4px;">Heb ik een vergunning nodig?</p>
      <p style="color:#555555; font-size:13px; margin:0; line-height:1.6;">In de meeste gevallen niet. Voor een buitenunit op de gevel of het dak is soms een omgevingsvergunning nodig. Wij informeren je hier altijd over.</p>
    </div>
    <div style="padding:14px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:14px; color:#1b2b4b; margin:0 0 4px;">Met welke merken werken jullie?</p>
      <p style="color:#555555; font-size:13px; margin:0; line-height:1.6;">Wij installeren uitsluitend A-merken: LG, Mitsubishi en Daikin. Betrouwbare merken met lange levensduur, hoog rendement en uitstekende garanties.</p>
    </div>
    <div style="padding:14px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:14px; color:#1b2b4b; margin:0 0 4px;">Hoe energiezuinig is een airco?</p>
      <p style="color:#555555; font-size:13px; margin:0; line-height:1.6;">Moderne A+++ airco's zijn zeer energiezuinig. Bij verwarmen is een airco (warmtepomp) 3 tot 4 keer goedkoper dan gas. Bij koelen verbruikt een gemiddelde split-unit tussen de 0,5 en 1,5 kWh per uur.</p>
    </div>
    <div style="padding:14px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:14px; color:#1b2b4b; margin:0 0 4px;">Wat kost een airco inclusief installatie?</p>
      <p style="color:#555555; font-size:13px; margin:0; line-height:1.6;">Een single-split airco inclusief installatie begint vanaf €1.299. Een multi-split systeem start vanaf €2.800. Altijd inclusief btw en 5 jaar installatiegarantie.</p>
    </div>
    <div style="padding:14px 0;">
      <p style="font-weight:700; font-size:14px; color:#1b2b4b; margin:0 0 4px;">Hoe vaak moet een airco onderhouden worden?</p>
      <p style="color:#555555; font-size:13px; margin:0; line-height:1.6;">Wij adviseren jaarlijks onderhoud voor optimale prestaties en levensduur. Dit omvat het reinigen van filters, controleren van het koudemiddel en inspecteren van alle onderdelen. We bieden ook onderhoudsabonnementen aan.</p>
    </div>
  </div>

  <!-- Afsluitende donkerblauwe balk -->
  <div style="background:#1b2b4b; padding:14px 20px;">
    <p style="color:#ffffff; font-weight:700; font-size:14px; margin:0;">Andere vraag? We helpen je graag!</p>
  </div>

</div>
$$
WHERE id = 'f57ddabd-4f70-4c8a-add2-860a38ef2e43'
   OR name = 'VDV Airco Offerte';
