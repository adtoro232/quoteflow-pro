import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Geen URL opgegeven" }, { status: 400 });
  }

  const match = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) {
    return NextResponse.json(
      { error: "Geen geldige Google Docs URL. Gebruik een link zoals: docs.google.com/document/d/..." },
      { status: 400 }
    );
  }

  const docId = match[1];
  const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;

  let html: string;
  try {
    const res = await fetch(exportUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      redirect: "follow",
    });

    if (!res.ok) {
      if (res.status === 403) {
        return NextResponse.json(
          { error: "Geen toegang. Zorg dat het document gedeeld is op 'Iedereen met de link kan bekijken'." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: `Google Docs antwoordde met fout ${res.status}` },
        { status: 502 }
      );
    }

    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Kan Google Docs niet bereiken. Controleer de URL en probeer opnieuw." },
      { status: 502 }
    );
  }

  // ── 1. Extract <style> from <head> — this contains all Google's CSS classes ──
  const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  let googleCss = styleMatches.map((m) => m[1]).join("\n");

  // Scope all Google CSS rules to .gdoc-import so they don't leak into the rest of the app
  googleCss = scopeCss(googleCss, ".gdoc-import");

  // ── 2. Extract <body> content ──
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    return NextResponse.json({ error: "Kon geen inhoud uit het document halen" }, { status: 422 });
  }

  let body = bodyMatch[1];

  // Remove only script tags and Google's UI chrome (header bar, banners)
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    // Remove Google's doc-header UI (not content)
    .replace(/<div[^>]*id="(header|footer|banners|gb|doc-header)"[^>]*>[\s\S]*?<\/div>/gi, "")
    // Remove empty paragraphs at the very start
    .replace(/^(\s*<p[^>]*>\s*(<br\s*\/?>\s*)*<\/p>\s*)+/, "")
    .trim();

  // ── 3. Wrap in scoped container with the extracted CSS inline ──
  const output = `<style>${googleCss}

/* Base overrides for clean rendering inside the app */
.gdoc-import { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; }
.gdoc-import p { margin: 0 0 8px; }
.gdoc-import table { border-collapse: collapse; width: 100%; }
.gdoc-import td, .gdoc-import th { padding: 6px 10px; }
</style>
<div class="gdoc-import">
${body}
</div>`;

  return NextResponse.json({ html: output });
}

/**
 * Prefix every CSS rule with a scope selector so Google's class names
 * (c0, c1, c2 …) don't clash with the rest of the app.
 */
function scopeCss(css: string, scope: string): string {
  // Remove @import rules (Google fonts etc. — optional, we skip for speed)
  css = css.replace(/@import[^;]+;/g, "");

  // Match every rule block: selector { ... }
  return css.replace(/([^{}]+)\{([^{}]*)\}/g, (_, selector, body) => {
    const trimmed = selector.trim();
    // Skip @-rules like @media, @font-face, @page
    if (trimmed.startsWith("@")) return `${trimmed} { ${body} }`;
    // Scope each comma-separated selector
    const scoped = trimmed
      .split(",")
      .map((s) => {
        const t = s.trim();
        if (!t) return "";
        // Already scoped or is a root selector
        if (t === "body" || t === "html") return scope;
        return `${scope} ${t}`;
      })
      .filter(Boolean)
      .join(", ");
    return `${scoped} { ${body} }`;
  });
}
