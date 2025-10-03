import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  banner: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: ThemeConfig | null = null;

  private readonly defaultPalette = {
    primary: '#3880ff',
    secondary: '#3dc2ff',
    accent: '#5260ff'
  };

  constructor(private http: HttpClient) {}

  async loadTheme(): Promise<void> {
    try {
      const themePath = `assets/buffets/${environment.buffetId}/theme.json`;

      const theme = await this.http.get<ThemeConfig>(themePath).toPromise();

      if (theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
      } else {
        this.applyDefaultTheme();
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      this.applyDefaultTheme();
    }
  }

  private applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement;

    const primary = this.sanitizeColor(theme?.primaryColor, this.defaultPalette.primary);
    const secondary = this.sanitizeColor(theme?.secondaryColor, this.defaultPalette.secondary);
    const accent = this.sanitizeColor(theme?.accentColor, this.defaultPalette.accent);

    // Primary color
    root.style.setProperty('--ion-color-primary', primary);
    root.style.setProperty('--ion-color-primary-rgb', this.hexToRgb(primary));
    root.style.setProperty('--ion-color-primary-contrast', this.getContrastColor(primary));
    root.style.setProperty('--ion-color-primary-contrast-rgb', this.hexToRgb(this.getContrastColor(primary)));
    root.style.setProperty('--ion-color-primary-shade', this.getShade(primary));
    root.style.setProperty('--ion-color-primary-tint', this.getTint(primary));

    // Secondary color
    root.style.setProperty('--ion-color-secondary', secondary);
    root.style.setProperty('--ion-color-secondary-rgb', this.hexToRgb(secondary));
    root.style.setProperty('--ion-color-secondary-contrast', this.getContrastColor(secondary));
    root.style.setProperty('--ion-color-secondary-contrast-rgb', this.hexToRgb(this.getContrastColor(secondary)));
    root.style.setProperty('--ion-color-secondary-shade', this.getShade(secondary));
    root.style.setProperty('--ion-color-secondary-tint', this.getTint(secondary));

    // Accent color (custom)
    root.style.setProperty('--ion-color-accent', accent);
    root.style.setProperty('--ion-color-accent-rgb', this.hexToRgb(accent));
    root.style.setProperty('--ion-color-accent-contrast', this.getContrastColor(accent));
    root.style.setProperty('--ion-color-accent-contrast-rgb', this.hexToRgb(this.getContrastColor(accent)));
    root.style.setProperty('--ion-color-accent-shade', this.getShade(accent));
    root.style.setProperty('--ion-color-accent-tint', this.getTint(accent));
  }

  private applyDefaultTheme(): void {
    const defaultTheme: ThemeConfig = {
      primaryColor: this.defaultPalette.primary,
      secondaryColor: this.defaultPalette.secondary,
      accentColor: this.defaultPalette.accent,
      logo: '',
      banner: ''
    };
    this.currentTheme = defaultTheme;
    this.applyTheme(defaultTheme);
  }

  private sanitizeColor(value: string | undefined | null, fallback: string): string {
    const v = (value || '').trim();
    if (!v) return fallback;
    const hex3 = /^#?([a-fA-F\d]{3})$/;
    const hex6 = /^#?([a-fA-F\d]{6})$/;
    if (hex6.test(v)) {
      return v.startsWith('#') ? v : `#${v}`;
    }
    if (hex3.test(v)) {
      const m = v.replace('#', '');
      const r = m[0];
      const g = m[1];
      const b = m[2];
      return `#${r}${r}${g}${g}${b}${b}`;
    }
    return fallback;
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return this.hexToRgb(this.defaultPalette.primary);
  }

  private getContrastColor(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#000000' : '#ffffff';
    }
    return '#ffffff';
  }

  private getShade(hex: string): string {
    return this.adjustBrightness(hex, -0.12);
  }

  private getTint(hex: string): string {
    return this.adjustBrightness(hex, 0.10);
  }

  private adjustBrightness(hex: string, percent: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      let r = parseInt(result[1], 16);
      let g = parseInt(result[2], 16);
      let b = parseInt(result[3], 16);

      r = Math.round(Math.min(255, Math.max(0, r + (r * percent))));
      g = Math.round(Math.min(255, Math.max(0, g + (g * percent))));
      b = Math.round(Math.min(255, Math.max(0, b + (b * percent))));

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return hex;
  }

  getCurrentTheme(): ThemeConfig | null {
    return this.currentTheme;
  }
}
