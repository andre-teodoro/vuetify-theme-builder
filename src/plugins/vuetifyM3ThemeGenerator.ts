import {
  argbFromHex,
  DynamicColor,
  DynamicScheme,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeFidelity,
  sourceColorFromImage,
} from "@material/material-color-utilities";
import kebabCase from "just-kebab-case";

export function vuetifyColorsFromHex(
  token: string,
  color: string,
  isDark: boolean,
  contrast: number) {
  const argb = argbFromHex(color);
  const source = Hct.fromInt(argb);
  const scheme = new SchemeFidelity(source, isDark, contrast);

  return getDynamicColorsByToken(token, scheme);
}

export function getDynamicColorsByToken(
  token: string,
  scheme: DynamicScheme) {
  const tokens = Object.keys(
    MaterialDynamicColors
  ) as (keyof typeof MaterialDynamicColors)[];

  const filtered = tokens.filter((t) =>
    t.toLocaleLowerCase().includes(token.toLocaleLowerCase())
  );
  return filtered
    .map((f) => {
      const key = kebabCase(f);
      const value = MaterialDynamicColors[f] as DynamicColor;
      if (!value.getArgb) return [key, null];

      return [key, hexFromArgb(value.getArgb(scheme))];
    })
    .filter(([, value]) => value !== null);
}

export function getDynamicColors(scheme: DynamicScheme) {
  const tokens = Object.keys(
    MaterialDynamicColors
  ) as (keyof typeof MaterialDynamicColors)[];

  return Object.fromEntries(
    tokens
      .map((token) => {
        const key = kebabCase(token);
        const value = MaterialDynamicColors[token] as DynamicColor;
        if (!value.getArgb) return [key, null];
        return [key, hexFromArgb(value.getArgb(scheme))];
      })
      .filter(([, value]) => value !== null)
  );
}

export function vuetifyThemeFromColor(
  sourceColor: number,
  dark: boolean,
  contrast = 0.3,
  variables: Record<string, string | number> = {}
) {
  const source = Hct.fromInt(sourceColor);
  const scheme = new SchemeFidelity(source, dark, contrast);
  const colors = getDynamicColors(scheme);

  return {
    dark,
    colors,
    variables: {},
  };
}

export function vuetifyThemeFromHex(
  hex: string,
  dark: boolean,
  contrast = 0.3,
  variables: Record<string, string | number> = {}
) {
  return vuetifyThemeFromColor(argbFromHex(hex), dark, contrast, variables);
}

export async function vuetifyThemeFromImage(
  image: HTMLImageElement,
  dark: boolean,
  contrast = 0.3,
  variables: Record<string, string | number> = {}
) {
  const color = await sourceColorFromImage(image);
  return vuetifyThemeFromColor(color, dark);
}

export type Colors = {
  primary: string;
  secondary: string;
  tertiary: string,
  error: string,
  warning: string,
  info: string,
  success: string,
  background: string,
  surface: string
}

export function vuetifyThemeFromColors(
  colors: Colors,
  dark: boolean,
  contrast = 0.00,
  variables: Record<string, string | number> = {}
) {
  const renameEntries = (entries: string[][], name: string) => {
    return entries.map(([key, value]) => {
      if (key.includes('primary')) {
        const restOfKey = key.replace('primary', '').replace(/^-/, '');
        return [`${name}${restOfKey ? '-' + restOfKey : ''}`, value];
      }
      return [key, value];
    });
  };

  // Cria esquemas separados para cada cor
  const schemePrimary = vuetifyThemeFromHex(colors.primary, dark, contrast, variables);
  const schemeSecondary = vuetifyColorsFromHex('primary', colors.secondary, dark, contrast);
  const schemeTertiary = vuetifyColorsFromHex('primary', colors.tertiary, dark, contrast);
  const schemeError = vuetifyColorsFromHex('primary', colors.error, dark, contrast);
  const schemeWarning = vuetifyColorsFromHex('primary', colors.warning, dark, contrast);
  const schemeInfo = vuetifyColorsFromHex('primary', colors.info, dark, contrast);
  const schemeSuccess = vuetifyColorsFromHex('primary', colors.success, dark, contrast);

  // Extrai as cores dinâmicas de cada esquema e faz merge das propriedades
  const mergedColors = Object.assign(
    {},
    schemePrimary.colors,
    Object.fromEntries(renameEntries(schemeSecondary, 'secondary')),
    Object.fromEntries(renameEntries(schemeTertiary, 'tertiary')),
    Object.fromEntries(renameEntries(schemeError, 'error')),
    Object.fromEntries(renameEntries(schemeWarning, 'warning')),
    Object.fromEntries(renameEntries(schemeInfo, 'info')),
    Object.fromEntries(renameEntries(schemeSuccess, 'success')),
    'background' in colors ? { background: colors.background } : {},
    'surface' in colors ? { surface: colors.surface } : {},
  );
  console.log(mergedColors)

  return {
    dark,
    colors: mergedColors,
    variables: schemePrimary.variables,
  };
}
