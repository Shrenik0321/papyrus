import type { PaperInsight } from "./types";

export const MOCK_INSIGHTS: Record<string, PaperInsight> = {
  "paper-1": {
    paperId: "paper-1",
    summary:
      "Introduces the Transformer architecture, replacing recurrence with self-attention for sequence modeling. Achieves state-of-the-art results on machine translation with significantly improved parallelization.",
    keyFindings: [
      "Self-attention captures long-range dependencies more effectively than RNNs",
      "Multi-head attention allows attending to different representation subspaces",
      "Positional encodings inject sequence order without recurrence",
    ],
    methods:
      "Encoder-decoder Transformer with scaled dot-product attention, multi-head attention (8 heads), feed-forward layers, residual connections, and layer normalization. Trained on WMT 2014 EN-DE and EN-FR.",
    futureWork: [
      "Apply to other modalities beyond text",
      "Investigate attention patterns for interpretability",
      "Reduce computational cost for very long sequences",
    ],
    researchGaps: [
      "Quadratic complexity limits applicability to very long sequences",
      "Limited analysis of attention head specialization",
    ],
    relatedPapers: [
      { id: "paper-2", title: "Scaling Laws for Neural Language Models" },
      { id: "paper-7", title: "Chain-of-Thought Prompting Elicits Reasoning in LLMs" },
    ],
  },
  "paper-3": {
    paperId: "paper-3",
    summary:
      "Presents a graph-based deep learning approach for AML detection using transaction network structure. Demonstrates improved detection rates over traditional rule-based systems.",
    keyFindings: [
      "Graph structure captures suspicious transaction patterns missed by tabular features",
      "Semi-supervised learning helps with scarce labeled fraud cases",
      "Ensemble of GNN layers improves recall on rare events",
    ],
    methods:
      "Graph convolutional network on transaction graphs with node features (account metadata) and edge features (transaction amount, type). Trained on synthetic and real-world AML datasets.",
    futureWork: [
      "Integrate temporal dynamics in graph updates",
      "Improve model explainability for regulatory compliance",
    ],
    researchGaps: [
      "Limited evaluation on cross-institution generalization",
      "Explainability methods not validated with compliance officers",
    ],
    relatedPapers: [
      { id: "paper-5", title: "Graph Neural Networks for Financial Fraud Detection" },
      { id: "paper-8", title: "Anomaly Detection in Transaction Networks" },
    ],
  },
  "paper-4": {
    paperId: "paper-4",
    summary:
      "Proposes reward relabeling techniques to improve offline reinforcement learning from fixed datasets, addressing distribution shift between behavior and target policies.",
    keyFindings: [
      "Relabeling rewards with learned value functions reduces overestimation",
      "Conservative Q-learning variants benefit from relabeled targets",
      "Works on D4RL benchmarks without online interaction",
    ],
    methods:
      "Offline RL with learned reward model from transitions. Applies relabeling via fitted Q-iteration and conservative policy evaluation.",
    futureWork: [
      "Extend to continuous control with high-dimensional observations",
      "Combine with model-based planning for sample efficiency",
    ],
    researchGaps: [
      "Reward relabeling sensitivity to reward model quality underexplored",
    ],
    relatedPapers: [
      { id: "paper-2", title: "Scaling Laws for Neural Language Models" },
    ],
  },
};

const DEFAULT_INSIGHT: Omit<PaperInsight, "paperId"> = {
  summary: "AI-generated summary will appear here after paper analysis.",
  keyFindings: ["Key finding 1", "Key finding 2"],
  methods: "Methodology summary pending analysis.",
  futureWork: ["Future research direction"],
  researchGaps: ["Identified gap in current literature"],
  relatedPapers: [],
};

export function getPaperInsights(paperId: string): PaperInsight {
  return (
    MOCK_INSIGHTS[paperId] ?? {
      paperId,
      ...DEFAULT_INSIGHT,
    }
  );
}
