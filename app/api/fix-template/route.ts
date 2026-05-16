import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const HTML = `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #ffffff; color: #1b2b4b; border: 1px solid #e0e0e0; border-radius: 4px; overflow: hidden;">

  <!-- SECTIE HEADER: JOUW OPLOSSING -->
  <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px 8px; background:#ffffff;">
    <span style="font-size:13px; color:#1b2b4b; font-weight:bold; white-space:nowrap;"><span style="color:#f07b00;">🏠 </span>JOUW OPLOSSING</span>
    <span style="font-size:12px; color:#f07b00; font-weight:bold; text-align:center; padding:0 8px;">{{quote_number}}</span>
    <span style="font-size:12px; color:#1b2b4b; font-weight:bold; white-space:nowrap;">VDV INSTALLATIES</span>
  </div>
  <div style="height:2px; background:#f07b00;"></div>

  <div style="padding:16px 16px 0;">
    <p style="color:#f07b00; font-size:12px; font-weight:700; margin:0 0 3px; letter-spacing:0.05em; text-transform:uppercase;">PRIJSOVERZICHT</p>
    <div style="height:3px; background:#f07b00; margin-bottom:8px;"></div>
    <h2 style="color:#1b2b4b; font-size:22px; font-weight:800; margin:0 0 4px;">Overzicht Investering</h2>
    <div style="height:3px; background:#f07b00; margin-bottom:18px;"></div>

    {{quote_items}}

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr style="border-top:1px solid #dddddd; border-bottom:1px solid #dddddd;">
        <td style="padding:9px 4px; color:#555555; font-size:13px;">Investering exclusief btw</td>
        <td style="padding:9px 4px; color:#1b2b4b; font-weight:700; font-size:13px; text-align:right; white-space:nowrap;">{{subtotal}}</td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:5px; margin-bottom:18px;">
      <tr>
        <td style="background:#1b2b4b; padding:13px 16px; color:#ffffff; font-weight:700; font-size:13px;">Investering inclusief btw</td>
        <td style="background:#1b2b4b; padding:13px 16px; color:#ffffff; font-weight:800; font-size:20px; text-align:right; white-space:nowrap;">{{total}}</td>
      </tr>
    </table>
    <p style="color:#555555; font-size:13px; margin:0 0 18px; line-height:1.5;">Deze prijsopgave is een volledige installatie van de airconditioning inclusief materiaal, afwerking en inbedrijfstelling.</p>
  </div>

  <!-- KLANTGEGEVENS -->
  <div style="height:3px; background:#f07b00; margin-top:4px;"></div>
  <div style="padding:14px 16px 18px;">
    <p style="color:#f07b00; font-size:11px; font-weight:700; margin:0 0 12px; text-transform:uppercase; letter-spacing:0.06em;">KLANTGEGEVENS</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding:7px 8px 7px 0; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:12px; display:block;">Naam</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_name}}</span>
        </td>
        <td width="50%" style="padding:7px 0 7px 8px; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:12px; display:block;">Telefoon</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_phone}}</span>
        </td>
      </tr>
      <tr>
        <td width="50%" style="padding:7px 8px 7px 0; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:12px; display:block;">E-mail</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_email}}</span>
        </td>
        <td width="50%" style="padding:7px 0 7px 8px; border-bottom:1px solid #eeeeee; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:12px; display:block;">Offerte nr.</span>
          <span style="color:#f07b00; font-size:13px;">{{quote_number}}</span>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="padding:7px 0; vertical-align:top;">
          <span style="color:#555555; font-weight:700; font-size:12px; display:block;">Adres</span>
          <span style="color:#f07b00; font-size:13px;">{{customer_address}}</span>
        </td>
      </tr>
    </table>
  </div>

  <!-- SECTIE HEADER: SLIMME INVESTERING -->
  <div style="height:3px; background:#f07b00;"></div>
  <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px 8px; background:#ffffff;">
    <span style="font-size:13px; color:#1b2b4b; font-weight:bold; white-space:nowrap;"><span style="color:#f07b00;">🏠 </span>SLIMME INVESTERING</span>
    <span style="font-size:12px; color:#f07b00; font-weight:bold; text-align:center; padding:0 8px;">{{quote_number}}</span>
    <span style="font-size:12px; color:#1b2b4b; font-weight:bold; white-space:nowrap;">VDV INSTALLATIES</span>
  </div>
  <div style="height:2px; background:#f07b00;"></div>

  <div style="padding:16px 16px 0;">
    <h2 style="color:#1b2b4b; font-size:20px; font-weight:800; margin:0 0 8px;">Waarom een airco een slimme investering is</h2>
    <p style="color:#555555; font-size:13px; margin:0 0 16px; line-height:1.5;">Een airco koelt in de zomer en verwarmt in de winter. Efficiënter dan gas, betaalbaar het hele jaar door.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px; border:1px solid #e0e0e0;">
      <tr><td colspan="2" style="background:#f07b00; padding:8px 12px; color:#ffffff; font-weight:700; font-size:13px;">⚡ MET ZONNEPANELEN</td></tr>
      <tr valign="top">
        <td width="50%" style="background:#f4f4f4; padding:10px; border-right:1px solid #e0e0e0; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#1b2b4b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px; padding-bottom:5px; border-bottom:1px solid #dddddd;">ZONDER AIRCO</div>
          <p style="font-size:12px; font-weight:700; color:#222222; margin:0 0 1px;">⚡ Stroom terug naar net</p>
          <p style="font-size:11px; color:#555555; margin:0 0 6px; line-height:1.4;">Lage terugleveringsvergoeding</p>
          <p style="font-size:12px; font-weight:700; color:#222222; margin:0 0 1px;">☀ Zomer nog steeds warm</p>
          <p style="font-size:11px; color:#555555; margin:0 0 6px; line-height:1.4;">Geen koeling aanwezig</p>
          <p style="font-size:12px; font-weight:700; color:#222222; margin:0 0 1px;">↘ Nog steeds gas</p>
          <p style="font-size:11px; color:#555555; margin:0; line-height:1.4;">~€1.800/jaar gaskosten</p>
        </td>
        <td width="50%" style="background:#3a7d44; padding:10px; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#ffffff; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px; padding-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.3);">MET AIRCO ✓</div>
          <p style="font-size:12px; font-weight:700; color:#ffffff; margin:0 0 1px;">⚡ Airco op eigen stroom</p>
          <p style="font-size:11px; color:rgba(255,255,255,0.8); margin:0 0 6px; line-height:1.4;">Koelen kost nagenoeg niets</p>
          <p style="font-size:12px; font-weight:700; color:#ffffff; margin:0 0 1px;">❄ Verwarmen + koelen gratis</p>
          <p style="font-size:11px; color:rgba(255,255,255,0.8); margin:0 0 6px; line-height:1.4;">Maximaal rendement panelen</p>
          <p style="font-size:12px; font-weight:700; color:#ffffff; margin:0 0 1px;">✓ Gas: ~€900/jaar</p>
          <p style="font-size:11px; color:rgba(255,255,255,0.8); margin:0; line-height:1.4;">€900+ besparing</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px; border:1px solid #e0e0e0;">
      <tr><td colspan="2" style="background:#f07b00; padding:8px 12px; color:#ffffff; font-weight:700; font-size:13px;">🏠 ZONDER ZONNEPANELEN</td></tr>
      <tr valign="top">
        <td width="50%" style="background:#f4f4f4; padding:10px; border-right:1px solid #e0e0e0; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#1b2b4b; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px; padding-bottom:5px; border-bottom:1px solid #dddddd;">ZONDER AIRCO</div>
          <p style="font-size:12px; font-weight:700; color:#222222; margin:0 0 1px;">🔥 100% verwarmen op gas</p>
          <p style="font-size:11px; color:#555555; margin:0 0 6px; line-height:1.4;">CV-ketel als enige warmtebron</p>
          <p style="font-size:12px; font-weight:700; color:#222222; margin:0 0 1px;">☀ 26°C+ in huis in zomer</p>
          <p style="font-size:11px; color:#555555; margin:0 0 6px; line-height:1.4;">Slecht slapen, minder productief</p>
          <p style="font-size:12px; font-weight:700; color:#222222; margin:0 0 1px;">↘ Gas: ~€2.200/jaar</p>
          <p style="font-size:11px; color:#555555; margin:0; line-height:1.4;">Bij gemiddelde tussenwoning</p>
        </td>
        <td width="50%" style="background:#3a7d44; padding:10px; vertical-align:top;">
          <div style="font-weight:700; font-size:11px; color:#ffffff; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:6px; padding-bottom:5px; border-bottom:1px solid rgba(255,255,255,0.3);">MET AIRCO ✓</div>
          <p style="font-size:12px; font-weight:700; color:#ffffff; margin:0 0 1px;">❄ Verwarmen + koelen in één</p>
          <p style="font-size:11px; color:rgba(255,255,255,0.8); margin:0 0 6px; line-height:1.4;">Heel het jaar comfort</p>
          <p style="font-size:12px; font-weight:700; color:#ffffff; margin:0 0 1px;">⚡ Tot 5x zuiniger dan gas</p>
          <p style="font-size:11px; color:rgba(255,255,255,0.8); margin:0 0 6px; line-height:1.4;">Warmtepomp-technologie</p>
          <p style="font-size:12px; font-weight:700; color:#ffffff; margin:0 0 1px;">✓ Gas: ~€1.400/jaar</p>
          <p style="font-size:11px; color:rgba(255,255,255,0.8); margin:0; line-height:1.4;">€800+ besparing per jaar</p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px; background:#1b2b4b; border-radius:4px;">
      <tr><td style="padding:14px 16px 10px;">
        <h3 style="color:#ffffff; font-size:16px; font-weight:700; margin:0 0 6px;">Rekenvoorbeeld</h3>
        <p style="color:#aaaaaa; font-size:12px; margin:0 0 12px; line-height:1.5;">Zonder zonnepanelen bespaar je al snel <span style="color:#f07b00; font-weight:700;">€800+/jaar</span>. Met zonnepanelen loopt dit op tot <span style="color:#f07b00; font-weight:700;">€1.300+/jaar</span>.</p>
      </td></tr>
      <tr><td style="padding:0 16px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td width="50%" style="padding-right:5px;">
            <div style="background:#f07b00; border-radius:4px; padding:12px; text-align:center;">
              <div style="color:rgba(255,255,255,0.8); font-size:10px; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.05em;">Zonder panelen</div>
              <div style="color:#ffffff; font-size:26px; font-weight:800; line-height:1.1;">€800+</div>
              <div style="color:rgba(255,255,255,0.8); font-size:10px; margin-top:3px;">per jaar</div>
            </div>
          </td>
          <td width="50%" style="padding-left:5px;">
            <div style="background:#f07b00; border-radius:4px; padding:12px; text-align:center;">
              <div style="color:rgba(255,255,255,0.8); font-size:10px; margin-bottom:3px; text-transform:uppercase; letter-spacing:0.05em;">Met panelen</div>
              <div style="color:#ffffff; font-size:26px; font-weight:800; line-height:1.1;">€1.300+</div>
              <div style="color:rgba(255,255,255,0.8); font-size:10px; margin-top:3px;">per jaar</div>
            </div>
          </td>
        </tr></table>
      </td></tr>
    </table>
  </div>

  <!-- SECTIE HEADER: LOKALE EXPERT -->
  <div style="height:3px; background:#f07b00;"></div>
  <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px 8px; background:#ffffff;">
    <span style="font-size:13px; color:#1b2b4b; font-weight:bold; white-space:nowrap;"><span style="color:#f07b00;">🏠 </span>LOKALE EXPERT</span>
    <span style="font-size:12px; color:#f07b00; font-weight:bold; text-align:center; padding:0 8px;">{{quote_number}}</span>
    <span style="font-size:12px; color:#1b2b4b; font-weight:bold; white-space:nowrap;">VDV INSTALLATIES</span>
  </div>
  <div style="height:2px; background:#f07b00;"></div>

  <div style="padding:16px 16px 0;">
    <h2 style="color:#1b2b4b; font-size:20px; font-weight:800; margin:0 0 14px;">Waarom klanten kiezen voor VDV Installaties</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1b2b4b; margin-bottom:12px;">
      <tr valign="top">
        <td width="33%" style="padding:12px 8px; text-align:center; border-right:1px solid rgba(255,255,255,0.1);">
          <div style="color:#ffffff; font-weight:700; font-size:12px; margin-bottom:3px;">🏠 Lokaal</div>
          <div style="color:#aaaaaa; font-size:11px; line-height:1.3;">Aarle-Rixtel</div>
        </td>
        <td width="33%" style="padding:12px 8px; text-align:center; border-right:1px solid rgba(255,255,255,0.1);">
          <div style="color:#ffffff; font-weight:700; font-size:12px; margin-bottom:3px;">🛡️ 5 jaar</div>
          <div style="color:#aaaaaa; font-size:11px; line-height:1.3;">Garantie</div>
        </td>
        <td width="34%" style="padding:12px 8px; text-align:center;">
          <div style="color:#ffffff; font-weight:700; font-size:12px; margin-bottom:3px;">✅ Erkend</div>
          <div style="color:#aaaaaa; font-size:11px; line-height:1.3;">F-gassen cert.</div>
        </td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px; border:1px solid #e0e0e0;">
      <tr><td style="padding:10px 12px;">
        <span style="background:#4285f4; color:#fff; font-weight:700; font-size:11px; padding:2px 6px; border-radius:2px; margin-right:6px;">G</span>
        <span style="color:#f07b00; font-size:15px; letter-spacing:1px; vertical-align:middle;">★★★★★</span>
        <span style="color:#1b2b4b; font-weight:700; font-size:12px; margin-left:6px;">4,8 · 62 reviews · 500+ klanten</span>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
      <tr valign="top">
        <td width="50%" style="padding-right:5px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:6px;"><tr><td style="padding:10px 12px;">
            <div style="color:#f07b00; font-size:13px; letter-spacing:1px; margin-bottom:5px;">★★★★★</div>
            <p style="color:#555555; font-size:11px; font-style:italic; margin:0 0 6px; line-height:1.5;">"Willem is een aardige, rustige en zorgvuldige vakman. Hij komt afspraken na. Een aanrader!"</p>
            <div style="color:#1b2b4b; font-weight:700; font-size:11px;">Marjon van Dorp</div>
          </td></tr></table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:6px;"><tr><td style="padding:10px 12px;">
            <div style="color:#f07b00; font-size:13px; letter-spacing:1px; margin-bottom:5px;">★★★★★</div>
            <p style="color:#555555; font-size:11px; font-style:italic; margin:0 0 6px; line-height:1.5;">"Daikin Comfora netjes geplaatst. Keurig op de hoogte gehouden."</p>
            <div style="color:#1b2b4b; font-weight:700; font-size:11px;">Gerard</div>
          </td></tr></table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;"><tr><td style="padding:10px 12px;">
            <div style="color:#f07b00; font-size:13px; letter-spacing:1px; margin-bottom:5px;">★★★★★</div>
            <p style="color:#555555; font-size:11px; font-style:italic; margin:0 0 6px; line-height:1.5;">"Eerst kundig advies, toen een goede offerte, waarna een perfecte plaatsing. Klasse!"</p>
            <div style="color:#1b2b4b; font-weight:700; font-size:11px;">Jasper B.</div>
          </td></tr></table>
        </td>
        <td width="50%" style="padding-left:5px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:6px;"><tr><td style="padding:10px 12px;">
            <div style="color:#f07b00; font-size:13px; letter-spacing:1px; margin-bottom:5px;">★★★★★</div>
            <p style="color:#555555; font-size:11px; font-style:italic; margin:0 0 6px; line-height:1.5;">"Super tevreden over de professionele manier. Rustige vriendelijke mannen."</p>
            <div style="color:#1b2b4b; font-weight:700; font-size:11px;">Carlo van Lierop</div>
          </td></tr></table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0; margin-bottom:6px;"><tr><td style="padding:10px 12px;">
            <div style="color:#f07b00; font-size:13px; letter-spacing:1px; margin-bottom:5px;">★★★★★</div>
            <p style="color:#555555; font-size:11px; font-style:italic; margin:0 0 6px; line-height:1.5;">"Fantastische service! Professioneel en netjes uitgevoerd. Absoluut een aanrader!"</p>
            <div style="color:#1b2b4b; font-weight:700; font-size:11px;">Mart Ramaekers</div>
          </td></tr></table>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;"><tr><td style="padding:10px 12px;">
            <div style="color:#f07b00; font-size:13px; letter-spacing:1px; margin-bottom:5px;">★★★★★</div>
            <p style="color:#555555; font-size:11px; font-style:italic; margin:0 0 6px; line-height:1.5;">"Onwijs goed geholpen door Willem en Bram! Scherpe prijs. Echt een aanrader!"</p>
            <div style="color:#1b2b4b; font-weight:700; font-size:11px;">Bekijk alle reviews →</div>
          </td></tr></table>
        </td>
      </tr>
    </table>
    <p style="color:#f07b00; font-weight:700; font-size:11px; text-align:right; margin:4px 0 16px;">Bekijk al onze Google reviews via de link in de mail →</p>
  </div>

  <!-- SECTIE HEADER: VEELGESTELDE VRAGEN -->
  <div style="height:3px; background:#f07b00;"></div>
  <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 16px 8px; background:#ffffff;">
    <span style="font-size:13px; color:#1b2b4b; font-weight:bold; white-space:nowrap;"><span style="color:#f07b00;">🏠 </span>VEELGESTELDE VRAGEN</span>
    <span style="font-size:12px; color:#f07b00; font-weight:bold; text-align:center; padding:0 8px;">{{quote_number}}</span>
    <span style="font-size:12px; color:#1b2b4b; font-weight:bold; white-space:nowrap;">VDV INSTALLATIES</span>
  </div>
  <div style="height:2px; background:#f07b00;"></div>

  <div style="background:#1b2b4b; padding:16px;">
    <h2 style="color:#ffffff; font-size:20px; font-weight:800; margin:0 0 4px;">Alles over airco installatie</h2>
    <p style="color:#aaaaaa; font-size:12px; margin:0; line-height:1.5;">De meest gestelde vragen beantwoord.</p>
  </div>

  <div style="padding:0 16px; background:#ffffff;">
    <div style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:13px; color:#1b2b4b; margin:0 0 4px;">Hoe lang duurt een installatie?</p>
      <p style="color:#555555; font-size:12px; margin:0; line-height:1.6;">Een single-split installatie duurt 4–6 uur. Multi-split 1–2 dagen.</p>
    </div>
    <div style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:13px; color:#1b2b4b; margin:0 0 4px;">Heb ik een vergunning nodig?</p>
      <p style="color:#555555; font-size:12px; margin:0; line-height:1.6;">In de meeste gevallen niet. Wij informeren je altijd over eventuele vergunningen.</p>
    </div>
    <div style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:13px; color:#1b2b4b; margin:0 0 4px;">Met welke merken werken jullie?</p>
      <p style="color:#555555; font-size:12px; margin:0; line-height:1.6;">Uitsluitend A-merken: LG, Mitsubishi en Daikin.</p>
    </div>
    <div style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:13px; color:#1b2b4b; margin:0 0 4px;">Hoe energiezuinig is een airco?</p>
      <p style="color:#555555; font-size:12px; margin:0; line-height:1.6;">Bij verwarmen is een airco 3–4x goedkoper dan gas. Verbruik: 0,5–1,5 kWh/uur bij koelen.</p>
    </div>
    <div style="padding:12px 0; border-bottom:1px solid #f0f0f0;">
      <p style="font-weight:700; font-size:13px; color:#1b2b4b; margin:0 0 4px;">Wat kost een airco inclusief installatie?</p>
      <p style="color:#555555; font-size:12px; margin:0; line-height:1.6;">Vanaf €1.299 incl. btw en 5 jaar garantie. Multi-split vanaf €2.800.</p>
    </div>
    <div style="padding:12px 0;">
      <p style="font-weight:700; font-size:13px; color:#1b2b4b; margin:0 0 4px;">Hoe vaak moet een airco onderhouden worden?</p>
      <p style="color:#555555; font-size:12px; margin:0; line-height:1.6;">Jaarlijks onderhoud aanbevolen. Wij bieden ook onderhoudsabonnementen aan.</p>
    </div>
  </div>

  <div style="background:#1b2b4b; padding:14px 16px;">
    <p style="color:#ffffff; font-weight:700; font-size:13px; margin:0;">Andere vraag? We helpen je graag!</p>
  </div>

</div>`;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { error } = await supabase
    .from("quote_templates")
    .update({ html_content: HTML })
    .eq("name", "VDV Airco Offerte");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
