import type { LinkedKnowledge } from "./types";

export const MOCK_LINKED_KNOWLEDGE: Record<string, LinkedKnowledge> = {
  "note-1": {
    noteId: "note-1",
    linkedItems: [
      { type: "finding", title: "GNNs outperform tabular baselines on AML graphs" },
      { type: "gap", title: "Explainability gap in production AML systems" },
    ],
    connectedPapers: [
      { id: "paper-3", title: "Deep Learning for Anti-Money Laundering" },
      { id: "paper-5", title: "Graph Neural Networks for Financial Fraud Detection" },
    ],
    relatedNotes: [
      { id: "note-3", title: "Sparse Attention Ideas" },
    ],
    researchQuestions: [
      "Can sparse attention reduce compute while preserving AML detection recall?",
      "What explainability format do compliance teams actually need?",
    ],
    researchIdeas: [
      "Hybrid GNN + sparse transformer for transaction sequences",
      "Attention rollout visualization for audit trails",
    ],
  },
  "note-2": {
    noteId: "note-2",
    linkedItems: [
      { type: "hypothesis", title: "Data scaling improves AML F1 more than parameter scaling" },
    ],
    connectedPapers: [
      { id: "paper-2", title: "Scaling Laws for Neural Language Models" },
    ],
    relatedNotes: [
      { id: "note-1", title: "AML Literature Review" },
    ],
    researchQuestions: [
      "Do Chinchilla-optimal ratios hold for tabular/fraud detection tasks?",
    ],
    researchIdeas: [
      "Compute-optimal training recipe for AML classifiers",
    ],
  },
  "note-3": {
    noteId: "note-3",
    linkedItems: [
      { type: "idea", title: "Local+global attention for transaction sequences" },
    ],
    connectedPapers: [
      { id: "paper-1", title: "Attention Is All You Need" },
      { id: "paper-3", title: "Deep Learning for Anti-Money Laundering" },
    ],
    relatedNotes: [
      { id: "note-1", title: "AML Literature Review" },
    ],
    researchQuestions: [
      "What window size captures typical money laundering patterns?",
    ],
    researchIdeas: [
      "Sparse attention with account-level global tokens",
    ],
  },
  "note-4": {
    noteId: "note-4",
    linkedItems: [],
    connectedPapers: [],
    relatedNotes: [],
    researchQuestions: [],
    researchIdeas: [],
  },
};

export function getLinkedKnowledge(noteId: string): LinkedKnowledge {
  return (
    MOCK_LINKED_KNOWLEDGE[noteId] ?? {
      noteId,
      linkedItems: [],
      connectedPapers: [],
      relatedNotes: [],
      researchQuestions: [],
      researchIdeas: [],
    }
  );
}
