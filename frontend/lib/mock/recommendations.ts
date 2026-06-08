import type { Recommendation } from "./types";

export const HOME_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec-1",
    type: "paper",
    title: "Graph Neural Networks for Financial Fraud Detection",
    description: "Highly relevant to your AML research — 89% topic overlap",
    refId: "paper-5",
  },
  {
    id: "rec-2",
    type: "note",
    title: "Sparse Attention Ideas",
    description: "Connects to 3 papers in your library",
    refId: "note-3",
  },
  {
    id: "rec-3",
    type: "action",
    title: "Run novelty check",
    description: "Validate your sparse attention hypothesis",
    action: "novelty",
  },
];

export const LIBRARY_RECOMMENDATIONS: Recommendation[] = [
  {
    id: "lib-rec-1",
    type: "paper",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP",
    description: "Suggested based on your recent reading",
    refId: "paper-6",
  },
  {
    id: "lib-rec-2",
    type: "paper",
    title: "Chain-of-Thought Prompting Elicits Reasoning in LLMs",
    description: "Trending in your research area",
    refId: "paper-7",
  },
  {
    id: "lib-rec-3",
    type: "paper",
    title: "Anomaly Detection in Transaction Networks",
    description: "Complements your AML literature review",
    refId: "paper-8",
  },
];

export const HOME_SUGGESTED_ACTIONS: Recommendation[] = [
  {
    id: "action-1",
    type: "action",
    title: "Review unread papers",
    description: "3 papers added this week haven't been opened",
    action: "library",
  },
  {
    id: "action-2",
    type: "action",
    title: "Run novelty check",
    description: "Validate ideas from your recent notes",
    action: "novelty",
  },
];
