export const Colors = {
  primary: '#E42278',
  primarySoft: '#ED7BAB',
  primaryMuted: '#F5D3DD',
  primaryPale: '#F9F9F9',
  dark: '#0D111A',
  surface: '#FFFFFF',
  border: '#F5D3DD',
  textPrimary: '#0D111A',
  textSecondary: '#6B7280',
  textOnPrimary: '#FFFFFF',
  textDisabled: '#C4C4C4',
  success: '#22A06B',
  warning: '#F59E0B',
  error: '#E53935',
  info: '#2196F3',
};

// Typography configuration using DM Sans
// We will load the fonts in the root layout
export const Typography = {
  h1: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 28,
    lineHeight: 42, // 1.5x
  },
  h2: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 22,
    lineHeight: 33,
  },
  h3: {
    fontFamily: 'DMSans_600SemiBold',
    fontSize: 18,
    lineHeight: 27,
  },
  h4: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 15,
    lineHeight: 22.5,
  },
  small: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 13,
    lineHeight: 19.5,
  },
  tiny: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    lineHeight: 16.5,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#0D111A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2, // For Android
  },
  button: {
    shadowColor: '#E42278',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 4,
  },
};
