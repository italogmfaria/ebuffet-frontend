import { readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const rootDir = join(__dirname, '..');

// Configuração dos tamanhos de ícones Android
const iconSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

// Verifica se Sharp está disponível
function hasSharp(): boolean {
  try {
    require.resolve('sharp');
    return true;
  } catch {
    return false;
  }
}

// Lê o buffetId do environment.ts
function getBuffetIdFromEnvironment(): string {
  try {
    const envPath = join(rootDir, 'src/environments/environment.ts');
    const envContent = readFileSync(envPath, 'utf-8');
    const buffetIdMatch = envContent.match(/buffetId:\s*['"]([^'"]+)['"]/);

    if (!buffetIdMatch) {
      throw new Error('buffetId não encontrado no environment.ts');
    }

    return buffetIdMatch[1];
  } catch (error) {
    console.error('❌ Erro ao ler environment:', error);
    process.exit(1);
  }
}

// Carrega o theme.json do buffet
function loadBuffetTheme(buffetId: string): any {
  try {
    const themePath = join(rootDir, `src/assets/buffets/${buffetId}/theme.json`);
    const themeContent = readFileSync(themePath, 'utf-8');
    return JSON.parse(themeContent);
  } catch (error) {
    console.error('❌ Erro ao carregar theme.json:', error);
    return null;
  }
}

// Atualiza a cor de background do adaptive icon
function updateAdaptiveIconBackground(primaryColor: string): void {
  const backgroundXmlPath = join(rootDir, 'android/app/src/main/res/values/ic_launcher_background.xml');

  const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${primaryColor}</color>
</resources>
`;

  writeFileSync(backgroundXmlPath, xmlContent, 'utf-8');
  console.log(`✅ Background color atualizado para: ${primaryColor}`);
}

// Atualiza o nome do app no strings.xml do Android
function updateAndroidStrings(appName: string): void {
  const stringsPath = join(rootDir, 'android/app/src/main/res/values/strings.xml');

  if (!existsSync(stringsPath)) {
    console.warn('⚠️  strings.xml não encontrado');
    return;
  }

  let stringsContent = readFileSync(stringsPath, 'utf-8');

  // Atualiza app_name
  stringsContent = stringsContent.replace(
    /<string name="app_name">.*?<\/string>/,
    `<string name="app_name">${appName}</string>`
  );

  // Atualiza title_activity_main
  stringsContent = stringsContent.replace(
    /<string name="title_activity_main">.*?<\/string>/,
    `<string name="title_activity_main">${appName}</string>`
  );

  writeFileSync(stringsPath, stringsContent, 'utf-8');
  console.log(`✅ Nome do app atualizado para: ${appName}`);
}

// Gera ícones foreground usando logo.png do buffet
async function generateAdaptiveIconForegrounds(buffetId: string): Promise<void> {
  const sharp = require('sharp');
  const logoPath = join(rootDir, `src/assets/buffets/${buffetId}/logo.png`);
  const androidResPath = join(rootDir, 'android/app/src/main/res');

  if (!existsSync(logoPath)) {
    console.error(`❌ Erro: Logo não encontrado em ${logoPath}`);
    process.exit(1);
  }


  // Gera ic_launcher_foreground para cada tamanho de mipmap
  for (const iconSize of iconSizes) {
    const outputFolder = join(androidResPath, iconSize.folder);

    if (!existsSync(outputFolder)) {
      mkdirSync(outputFolder, { recursive: true });
    }

    const foregroundPath = join(outputFolder, 'ic_launcher_foreground.png');

    // Adaptive icons usam um grid de 108dp, onde apenas 72dp no centro é a safe zone
    // Então o foreground deve ter 108dp, mas o logo deve estar centralizado em 72dp
    const foregroundSize = Math.round(iconSize.size * 1.5); // 108dp equivalente
    const logoSize = iconSize.size; // 72dp equivalente (safe zone)

    await sharp(logoPath)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .extend({
        top: Math.round((foregroundSize - logoSize) / 2),
        bottom: Math.round((foregroundSize - logoSize) / 2),
        left: Math.round((foregroundSize - logoSize) / 2),
        right: Math.round((foregroundSize - logoSize) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(foregroundPath);

    console.log(`✅ Foreground: ${iconSize.folder}/ic_launcher_foreground.png`);
  }

  // Também gera para drawable como fallback
  const drawableFolder = join(androidResPath, 'drawable');
  if (!existsSync(drawableFolder)) {
    mkdirSync(drawableFolder, { recursive: true });
  }

  const drawableForegroundPath = join(drawableFolder, 'ic_launcher_foreground.png');
  await sharp(logoPath)
    .resize(432, 432, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(drawableForegroundPath);

  console.log('✅ Foreground: drawable/ic_launcher_foreground.png');
}



// Fallback sem Sharp
function copyIconsWithoutSharp(buffetId: string): void {
  const logoPath = join(rootDir, `src/assets/buffets/${buffetId}/logo.png`);
  const androidResPath = join(rootDir, 'android/app/src/main/res');

  if (!existsSync(logoPath)) {
    console.error(`❌ Erro: Logo não encontrado em ${logoPath}`);
    process.exit(1);
  }

  for (const iconSize of iconSizes) {
    const outputFolder = join(androidResPath, iconSize.folder);

    if (!existsSync(outputFolder)) {
      mkdirSync(outputFolder, { recursive: true });
    }

    // Copia logo como foreground
    copyFileSync(logoPath, join(outputFolder, 'ic_launcher_foreground.png'));

    console.log(`✅ Copiado para: ${iconSize.folder}`);
  }
}

// Execução principal
async function main() {
  console.log('\n🚀 Configurando app Android para o buffet...\n');

  const buffetId = getBuffetIdFromEnvironment();
  console.log(`📱 Buffet ID: ${buffetId}`);

  const theme = loadBuffetTheme(buffetId);
  if (!theme) {
    console.error('❌ Erro: não foi possível carregar o theme.json');
    process.exit(1);
  }

  const appName = theme.nameBuffet || `eBuffet - ${buffetId}`;
  const primaryColor = theme.primaryColor || '#FFFFFF';

  console.log(`🎨 Nome do App: ${appName}`);
  console.log(`🎨 Cor Primária: ${primaryColor}\n`);

  // Atualiza o nome do app no Android
  updateAndroidStrings(appName);

  // Atualiza a cor de background do adaptive icon
  updateAdaptiveIconBackground(primaryColor);

  console.log('\n📦 Gerando ícones Android...\n');

  if (hasSharp()) {
    console.log('✨ Usando Sharp para gerar ícones otimizados\n');

    // Gera foregrounds (adaptive icons) com logo.png
    await generateAdaptiveIconForegrounds(buffetId);


  } else {
    console.log('⚠️  Sharp não instalado. Copiando ícones...\n');
    copyIconsWithoutSharp(buffetId);
    console.log('\n💡 Para gerar ícones otimizados, instale: npm install --save-dev sharp');
  }

  console.log(`\n🎉 App Android configurado com sucesso!`);
  console.log(`   Nome: ${appName}`);
  console.log(`   Background: ${primaryColor} (adaptive icon)`);
  console.log(`   Foreground: logo.png (adaptive icon)\n`);
}

main().catch(error => {
  console.error('❌ Erro ao configurar app Android:', error);
  process.exit(1);
});

