export interface Position {
  x: string; // vh/vw format like "10vw" or "20vh"
  y: string; // vh/vw format like "15vh" or "25vw"
}

export interface Size {
  width: string; // vh/vw format like "12vw"
  height: string; // vh/vw format like "8vh"
}

export interface Sponsor {
  id: string;
  name: string;
  image: string;
  position: Position;
  size: Size;
  rotation?: number; // Optional rotation in degrees
  zIndex?: number; // Optional z-index for layering
  website?: string; // Optional website URL
}

export interface Stat {
  id: string;
  name: string;
  content: React.ReactNode;
  image: string;
  position: Position;
  size: Size;
}

export interface FAQItem {
  question: string;
  answer: React.ReactNode;
}
