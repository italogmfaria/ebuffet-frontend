import { Injectable } from '@angular/core';
import {ThemeConfig} from "../../dtos/theme-dto";

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private theme!: ThemeConfig;

  async loadTheme(buffetId: string): Promise<void> {
    const res = await fetch(`assets/buffets/${buffetId}/theme.json`);
    this.theme = await res.json();
    this.applyToDocument();
  }

  getTheme(): ThemeConfig {
    return this.theme;
  }

  private applyToDocument() {
    document.documentElement.style.setProperty('--primary-color', this.theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', this.theme.secondaryColor);
    if (this.theme.backgroundImage) {
      document.body.style.backgroundImage = `url(${this.theme.backgroundImage})`;
    }
  }
}
