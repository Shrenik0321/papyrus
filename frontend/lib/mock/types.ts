export type PaperAvailability = "open_access" | "paywall" | "preprint";

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  source: string;
  tags: string[];
  availability: PaperAvailability;
  pdfUrl: string;
  lastViewedAt: string;
  addedAt: string;
}

export type NoteType = "literature" | "experiment" | "idea" | "general";

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tags: string[];
  type: NoteType;
}

export type ActivityType = "paper" | "note" | "analysis";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  timestamp: string;
  refId: string;
}

export interface PaperInsight {
  paperId: string;
  summary: string;
  keyFindings: string[];
  methods: string;
  futureWork: string[];
  researchGaps: string[];
  relatedPapers: { id: string; title: string }[];
}

export interface NoveltyResult {
  score: number;
  researchGaps: string[];
  closestPapers: { id: string; title: string; similarity: number }[];
  potentialContributions: string[];
  risksAndChallenges: string[];
  reasoning: string[];
}
