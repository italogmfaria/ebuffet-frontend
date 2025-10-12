import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  banner: string;
  buffetId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: ThemeConfig | null = null;

  // BehaviorSubjects para as cores do tema
  private primaryColorSubject = new BehaviorSubject<string>('#3dc2ff');
  private secondaryColorSubject = new BehaviorSubject<string>('#3880ff');
  private accentColorSubject = new BehaviorSubject<string>('#ffffff');
  private logoSubject = new BehaviorSubject<string>('');
  private bannerSubject = new BehaviorSubject<string>('');
  private buffetIdSubject = new BehaviorSubject<number | null>(null);

  // Observables públicos
  public primaryColor$ = this.primaryColorSubject.asObservable();
  public secondaryColor$ = this.secondaryColorSubject.asObservable();
  public accentColor$ = this.accentColorSubject.asObservable();
  public logo$ = this.logoSubject.asObservable();
  public banner$ = this.bannerSubject.asObservable();
  public buffetId$ = this.buffetIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  async loadTheme(): Promise<void> {
    try {
      const themePath = `assets/buffets/${environment.buffetId}/theme.json`;

      const theme = await this.http.get<ThemeConfig>(themePath).toPromise();

      if (!theme) {
        throw new Error('Theme data is empty or invalid');
      }

      if (!theme.primaryColor || !theme.secondaryColor || !theme.accentColor) {
        throw new Error('Theme is missing required color properties');
      }

      this.currentTheme = theme;
      this.updateColorSubjects(theme);
      this.buffetIdSubject.next(theme.buffetId ?? null);
      this.applyTheme(theme);

      document.body.classList.remove('theme-loading');
    } catch (error) {
      console.error('Failed to load theme:', error);
      this.applyFallbackTheme();
      document.body.classList.remove('theme-loading');
      if (!environment.production) {
        this.showThemeError();
      }
    }
  }

  getBuffetIdSync(): number | null {
    return this.currentTheme?.buffetId ?? null;
  }

  private applyFallbackTheme(): void {
    const fallbackTheme: ThemeConfig = {
      primaryColor: '#3dc2ff',
      secondaryColor: '#3880ff',
      accentColor: '#ffffff',
      logo: '',
      banner: '',

    };

    this.currentTheme = fallbackTheme;
    this.updateColorSubjects(fallbackTheme);
    this.applyTheme(fallbackTheme);
    console.log('Applied fallback theme');
  }

  private updateColorSubjects(theme: ThemeConfig): void {
    this.primaryColorSubject.next(theme.primaryColor);
    this.secondaryColorSubject.next(theme.secondaryColor);
    this.accentColorSubject.next(theme.accentColor);
    this.logoSubject.next(theme.logo);
    this.bannerSubject.next(theme.banner);
  }

  private showThemeError(): void {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #f8f8f8;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
        ">
          <h2 style="color: #d32f2f; margin-bottom: 1rem;">Erro ao Carregar Tema</h2>
          <p style="color: #666; margin-bottom: 1.5rem;">
            Não foi possível carregar o arquivo de tema da aplicação.
            Verifique se o arquivo theme.json existe e está configurado corretamente.
          </p>
          <button onclick="window.location.reload()" style="
            background: #d32f2f;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          ">
            Tentar Novamente
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(errorDiv);
  }

  private applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement;

    const primary = theme.primaryColor;
    const secondary = theme.secondaryColor;
    const accent = theme.accentColor;

    root.style.setProperty('--ion-color-primary', primary);
    root.style.setProperty('--ion-color-primary-rgb', this.hexToRgb(primary));
    root.style.setProperty('--ion-color-primary-contrast', this.getContrastColor(primary));
    root.style.setProperty('--ion-color-primary-contrast-rgb', this.hexToRgb(this.getContrastColor(primary)));
    root.style.setProperty('--ion-color-primary-shade', this.getShade(primary));
    root.style.setProperty('--ion-color-primary-tint', this.getTint(primary));

    root.style.setProperty('--ion-color-secondary', secondary);
    root.style.setProperty('--ion-color-secondary-rgb', this.hexToRgb(secondary));
    root.style.setProperty('--ion-color-secondary-contrast', this.getContrastColor(secondary));
    root.style.setProperty('--ion-color-secondary-contrast-rgb', this.hexToRgb(this.getContrastColor(secondary)));
    root.style.setProperty('--ion-color-secondary-shade', this.getShade(secondary));
    root.style.setProperty('--ion-color-secondary-tint', this.getTint(secondary));

    root.style.setProperty('--ion-color-accent', accent);
    root.style.setProperty('--ion-color-accent-rgb', this.hexToRgb(accent));
    root.style.setProperty('--ion-color-accent-contrast', this.getContrastColor(accent));
    root.style.setProperty('--ion-color-accent-contrast-rgb', this.hexToRgb(this.getContrastColor(accent)));
    root.style.setProperty('--ion-color-accent-shade', this.getShade(accent));
    root.style.setProperty('--ion-color-accent-tint', this.getTint(accent));

    root.style.setProperty('--theme-logo', `url('${theme.logo}')`);
    root.style.setProperty('--theme-banner', `url('${theme.banner}')`);
    root.style.setProperty('--theme-logo-path', theme.logo);
    root.style.setProperty('--theme-banner-path', theme.banner);
  }

  private hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `${r}, ${g}, ${b}`;
    }
    throw new Error(`Invalid hex color: ${hex}`);
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
    throw new Error(`Invalid hex color: ${hex}`);
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
    throw new Error(`Invalid hex color: ${hex}`);
  }

  getCurrentTheme(): ThemeConfig | null {
    return this.currentTheme;
  }
}
