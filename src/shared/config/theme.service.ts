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

    // Apply primary color
    root.style.setProperty('--ion-color-primary', theme.primaryColor);
    root.style.setProperty('--ion-color-primary-rgb', this.hexToRgb(theme.primaryColor));
    root.style.setProperty('--ion-color-primary-contrast', this.getContrastColor(theme.primaryColor));
    root.style.setProperty('--ion-color-primary-contrast-rgb', this.hexToRgb(this.getContrastColor(theme.primaryColor)));
    root.style.setProperty('--ion-color-primary-shade', this.getShade(theme.primaryColor));
    root.style.setProperty('--ion-color-primary-tint', this.getTint(theme.primaryColor));

    // Apply secondary color
    root.style.setProperty('--ion-color-secondary', theme.secondaryColor);
    root.style.setProperty('--ion-color-secondary-rgb', this.hexToRgb(theme.secondaryColor));
    root.style.setProperty('--ion-color-secondary-contrast', this.getContrastColor(theme.secondaryColor));
    root.style.setProperty('--ion-color-secondary-contrast-rgb', this.hexToRgb(this.getContrastColor(theme.secondaryColor)));
    root.style.setProperty('--ion-color-secondary-shade', this.getShade(theme.secondaryColor));
    root.style.setProperty('--ion-color-secondary-tint', this.getTint(theme.secondaryColor));

    // Apply accent/accent color
    root.style.setProperty('--ion-color-accent', theme.accentColor);
    root.style.setProperty('--ion-color-accent-rgb', this.hexToRgb(theme.accentColor));
    root.style.setProperty('--ion-color-accent-contrast', this.getContrastColor(theme.accentColor));
    root.style.setProperty('--ion-color-accent-contrast-rgb', this.hexToRgb(this.getContrastColor(theme.accentColor)));
    root.style.setProperty('--ion-color-accent-shade', this.getShade(theme.accentColor));
    root.style.setProperty('--ion-color-accent-tint', this.getTint(theme.accentColor));
  }

  private applyDefaultTheme(): void {
    const defaultTheme: ThemeConfig = {
      primaryColor: '',
      secondaryColor: '',
      accentColor: '',
      logo: '',
      banner: ''
    };
    this.applyTheme(defaultTheme);
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    return '0, 0, 0';
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
