export interface Position {
  x: string | number; // vh/vw format like "10vw" or "20vh"
  y: string | number; // vh/vw format like "15vh" or "25vw"
}

export interface Size {
  width: string; // vh/vw format like "12vw"
  height: string; // vh/vw format like "8vh"
}

export interface Stat {
  id: string;
  name: string;
  content: string;
  description: string;
  image: string;
  position: Position;
  size: Size;
  font_sizes?: {
    [key: string]: string;
  };
}

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export interface Auth0User {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  linked_email?: string | null;
  "cusec/roles"?: string[];
}

export interface DbUser {
  _id: string;
  email: string;
  name?: string;
  linked_email?: string | null;
  points?: number; // Calculated dynamically from claimedItems minus redeemedPoints
  claimedItems: string[];
  claim_attempts?: ClaimAttempt[];
}

export interface ClaimAttempt {
  identifier: string;
  success: boolean;
  timestamp: string;
  item_id?: string;
}

export interface HuntItem {
  _id: string;
  name: string;
  description: string;
  identifier: string;
  points: number;
  maxClaims: number | null;
  claimCount: number;
  active: boolean;
  activationStart: string | null;
  activationEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HuntItemFormData {
  name: string;
  description: string;
  identifier: string;
  points: number;
  maxClaims: number | null;
  active: boolean;
  activationStart: string | null;
  activationEnd: string | null;
}

export interface ShopItem {
  _id: string;
  name: string;
  description: string;
  cost: number;
  limited: boolean;
  remaining: number;
  moderated: boolean;
  imageSlug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShopItemFormData {
  name: string;
  description: string;
  cost: number;
  limited: boolean;
  remaining: number;
  moderated: boolean;
  imageSlug: string;
}

export interface Day {
  _id?: string;
  day: string;
  date: string;
  timestamp: number; // Numeric format: YYYYMMDD (e.g., 20260101 for Jan 1, 2026)
  schedule: ScheduleItem[];
}

export interface ScheduleItem {
  _id?: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  detailedDescription?: string;
  location?: string;
  track: "A" | "B" | "C";
  color?: "primary" | "secondary" | "accent" | "sunset" | "sea" | "white";
}

export type Sponsor = {
  image: string;
  link: string;
};

export interface Speaker {
  name: string;
  pronouns?: string;
  title?: string;
  talkTitle?: string;
  talkDescription?: string;
  bio: string;
  image: string;
  socials?: {
    linkedin?: string;
    x?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
    bsky?: string;
    website?: string;
    tiktok?: string;
    mastodon?: string;
    misc?: string;
  };
}

export interface TeamMember {
  name: string;
  pronouns: string;
  teamRole: string;
  professionalTitle?: string;
  primaryImage: string;
  secondaryImage?: string;
  infoTitle: string;
  infoDescription: string;
  education: {
    major: string;
    institution: string;
    logo: string;
  };
  socials?: {
    linkedin?: string;
    x?: string;
    github?: string;
    website?: string;
  };
}
