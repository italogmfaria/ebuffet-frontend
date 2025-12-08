import type { CapacitorConfig } from '@capacitor/cli';
import { readFileSync } from 'fs';
import { join } from 'path';

// Lê o environment para determinar o buffet atual
let buffetId = 'buffet1'; // fallback
let appName = 'eBuffet';

try {
  const envPath = join(__dirname, 'src/environments/environment.ts');
  const envContent = readFileSync(envPath, 'utf-8');

  const buffetIdMatch = envContent.match(/buffetId:\s*['"]([^'"]+)['"]/);
  if (buffetIdMatch) {
    buffetId = buffetIdMatch[1];
  }

  // Tenta ler o theme.json do buffet para pegar nome customizado se existir
  try {
    const themePath = join(__dirname, `src/assets/buffets/${buffetId}/theme.json`);
    const theme = JSON.parse(readFileSync(themePath, 'utf-8'));
    if (theme.nameBuffet) {
      appName = theme.nameBuffet;
    } else {
      appName = `eBuffet - ${buffetId.charAt(0).toUpperCase() + buffetId.slice(1)}`;
    }
  } catch {
    appName = `eBuffet - ${buffetId.charAt(0).toUpperCase() + buffetId.slice(1)}`;
  }
} catch (error) {
  console.warn('⚠️  Não foi possível ler o buffetId do environment, usando padrão');
}

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: appName,
  webDir: 'www',
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'native',
      style: 'dark'
    }
  }
};

console.log(`📱 Capacitor Config: ${appName} (${buffetId})`);

export default config;
