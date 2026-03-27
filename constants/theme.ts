

import { useColorScheme } from 'react-native';

const light = {
  background:   '#F8F8F8',
  surface:      '#FFFFFF',
  surfaceAlt:   '#F0F0F0',
  black:        '#0A0A0A',
  white:        '#FFFFFF',
  gold:         '#C9A84C',
  goldLight:    '#E8C97A',
  goldMuted:    '#F5EDD6',
  textPrimary:  '#1A1A1A',
  textSecondary:'#666666',
  textMuted:    '#999999',
  border:       '#EFEFEF',
  danger:       '#C62828',
  dangerBg:     '#FCE4EC',
  green:        '#2E7D32',
  greenBg:      '#E8F5E9',
  blue:         '#1565C0',
  blueBg:       '#E3F2FD',
  red:          '#C62828',
  redBg:        '#FCE4EC',
  statusBar:    'dark' as const,
  heroCard:     '#0A0A0A',
  heroText:     '#FFFFFF',
};

const dark = {
  background:   '#0D0D0D',
  surface:      '#1A1A1A',
  surfaceAlt:   '#242424',
  black:        '#0A0A0A',
  white:        '#FFFFFF',
  gold:         '#C9A84C',
  goldLight:    '#E8C97A',
  goldMuted:    '#2A2210',
  textPrimary:  '#F0F0F0',
  textSecondary:'#AAAAAA',
  textMuted:    '#666666',
  border:       '#2E2E2E',
  danger:       '#EF5350',
  dangerBg:     '#2C1010',
  green:        '#66BB6A',
  greenBg:      '#0F2410',
  blue:         '#42A5F5',
  blueBg:       '#0A1A2C',
  red:          '#EF5350',
  redBg:        '#2C1010',
  statusBar:    'light' as const,
  heroCard:     '#1A1A1A',
  heroText:     '#F0F0F0',
};

export type Theme = typeof light;

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}