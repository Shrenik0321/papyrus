import type { Note } from "./types";

export const MOCK_NOTES: Note[] = [
  {
    id: "note-1",
    title: "AML Literature Review",
    content: `# AML Literature Review

## Key themes
- Graph-based methods dominate transaction network analysis
- Deep learning approaches show promise but lack interpretability
- Real-world deployment faces regulatory constraints

## Open questions
- How to combine GNNs with explainability requirements?
- What benchmarks reflect production-scale transaction volumes?`,
    updatedAt: "2026-06-06T10:00:00Z",
    tags: ["aml", "literature"],
    type: "literature",
  },
  {
    id: "note-2",
    title: "Scaling Laws Experiments",
    content: `# Scaling Laws Experiments

Chinchilla-optimal compute allocation suggests we should increase data relative to parameters.

**Hypothesis:** Doubling data with fixed compute improves downstream AML detection F1 by 2-3%.`,
    updatedAt: "2026-06-04T15:30:00Z",
    tags: ["scaling", "experiments"],
    type: "experiment",
  },
  {
    id: "note-3",
    title: "Sparse Attention Ideas",
    content: `# Sparse Attention Ideas

Exploring local+global attention patterns for long transaction sequences.

- Local window: 128 transactions
- Global tokens: account summary embeddings`,
    updatedAt: "2026-06-02T09:00:00Z",
    tags: ["architecture", "attention"],
    type: "idea",
  },
  {
    id: "note-4",
    title: "Research Notes",
    content: `# New Research Note

Capture your first research insight here.`,
    updatedAt: "2026-06-07T08:00:00Z",
    tags: [],
    type: "general",
  },
];

export function getNoteById(id: string): Note | undefined {
  return MOCK_NOTES.find((n) => n.id === id);
}
