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
  "cusec/roles"?: string[];
}

export interface DbUser {
  _id: string;
  email: string;
  name?: string;
  points: number;
  history: string[];
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
  createdAt: string;
  updatedAt: string;
}

export interface HuntItemFormData {
  name: string;
  description: string;
  identifier: string;
  points: number;
}

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  location?: string;
  items?: ScheduleItem[];
}

export type Sponsor = {
  image: string;
  link: string;
};
