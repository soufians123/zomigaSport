export type Channel = {
  id: number;
  name: string;
  time: string;
  streamUrl: string;
  thumbnailUrl: string;
};

export type BettingProvider = {
  id: number;
  name: string;
  logoUrl: string;
  rating: number | null;
  reviewUrl: string;
};

export type SocialLink = {
  id: number;
  name: 'WhatsApp' | 'Facebook' | 'Telegram';
  url: string;
};

export type NewsArticle = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
};

export type Settings = {
  socialIconSize: 'sm' | 'md' | 'lg';
};

export type ThemeSettings = {
  // General
  radius: number;
  
  // Fonts
  fontBody: string;
  fontHeadline: string;
  
  // Identity
  logoUrl: string;
  siteTitle: string;
  headerLogoSize: number;
  headerTitleSize: string;
  headerNavFontSize: string;
  footerFontSize: string;
  
  // Colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  createdAt: string;
};

export type Match = {
  league: string;
  team1: string;
  team1Logo: string;
  team2: string;
  team2Logo: string;
  score: string;
  status: string;
  broadcastingChannels?: string[];
};
