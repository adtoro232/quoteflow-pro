export function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "221 83% 25%";

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function darkenHsl(hsl: string, amount: number): string {
  const parts = hsl.split(" ");
  const l = parseFloat(parts[2]);
  return `${parts[0]} ${parts[1]} ${Math.max(0, l - amount)}%`;
}

export function lightenHsl(hsl: string, amount: number): string {
  const parts = hsl.split(" ");
  const l = parseFloat(parts[2]);
  return `${parts[0]} ${parts[1]} ${Math.min(100, l + amount)}%`;
}

export interface Branding {
  primaryColor: string;
  logoUrl: string | null;
  companyName: string;
}

export function getBrandingStyles(branding: Branding): string {
  const hsl = hexToHsl(branding.primaryColor);
  const sidebarBg = darkenHsl(hsl, 8);
  const sidebarAccent = lightenHsl(hsl, 5);

  return `
    :root {
      --primary: ${hsl};
      --ring: ${hsl};
      --sidebar-background: ${sidebarBg};
      --sidebar-accent: ${sidebarAccent};
      --sidebar-ring: ${lightenHsl(hsl, 30)};
    }
  `;
}
