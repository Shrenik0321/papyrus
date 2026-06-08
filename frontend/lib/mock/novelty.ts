import type { NoveltyResult } from "./types";

export const MOCK_NOVELTY_RESULT: NoveltyResult = {
  score: 72,
  researchGaps: [
    "Existing AML graph methods lack efficient attention for long transaction sequences",
    "No work combines sparse attention with regulatory explainability requirements",
    "Cross-institution generalization remains underexplored in GNN-based AML",
  ],
  closestPapers: [
    { id: "paper-3", title: "Deep Learning for Anti-Money Laundering", similarity: 0.84 },
    { id: "paper-5", title: "Graph Neural Networks for Financial Fraud Detection", similarity: 0.79 },
    { id: "paper-8", title: "Anomaly Detection in Transaction Networks", similarity: 0.71 },
  ],
  potentialContributions: [
    "Novel sparse attention mechanism tailored to transaction graph topology",
    "Interpretable attention heads aligned with compliance audit requirements",
    "Benchmark suite for long-sequence AML detection at production scale",
  ],
  risksAndChallenges: [
    "High similarity to existing GNN-AML work may limit perceived novelty",
    "Regulatory validation of attention-based explanations is unproven",
    "Computational overhead of attention on billion-edge graphs",
  ],
  reasoning: [
    "Identified 12 papers in AML graph learning domain from workspace library",
    "Closest work uses full graph convolutions without sequence-level attention",
    "Sparse attention for financial sequences is emerging but not applied to AML compliance",
    "Novelty score reflects moderate differentiation with clear extension path",
  ],
};
