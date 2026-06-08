export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessageAt: string;
  messages?: ChatMessage[];
}

export const MOCK_CHATS: ChatSession[] = [
  {
    id: "chat-1",
    title: "Summarize AML papers",
    lastMessageAt: "2026-06-06T12:00:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Summarize the key findings from my AML graph learning papers.",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Based on your library, three papers stand out: GNN-AML (2024) introduces heterogeneous graph attention for transaction networks; SparseFlow (2023) reduces compute via adaptive sparsity; and AML-Bench (2025) provides a standardized evaluation suite. Common themes include scalability on large transaction graphs and improved recall on rare fraud patterns.",
      },
    ],
  },
  {
    id: "chat-2",
    title: "Novelty check: sparse attention",
    lastMessageAt: "2026-06-05T09:30:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "How novel is my sparse attention approach compared to recent work?",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Your approach differs from standard sparse transformers by using domain-specific sparsity patterns derived from transaction graph topology. I found 4 related papers from the last 18 months — your method appears moderately novel with a clear differentiator in adaptive edge pruning.",
      },
    ],
  },
  {
    id: "chat-3",
    title: "Gap analysis in notes",
    lastMessageAt: "2026-06-04T16:15:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "What gaps exist in my research notes on GNN-AML?",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Your notes cover model architecture well but lack: (1) ablation study plans, (2) baseline comparison methodology, and (3) dataset licensing constraints. I'd recommend adding a section on evaluation protocol before drafting the experiment plan.",
      },
    ],
  },
  {
    id: "chat-4",
    title: "Experiment ideas for GNN-AML",
    lastMessageAt: "2026-06-03T11:00:00Z",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Suggest experiment ideas for validating my GNN-AML model.",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Consider: (1) cross-dataset generalization on Elliptic vs. AMLSim, (2) sparsity ablation at 25/50/75% edge retention, (3) comparison against GraphSAGE and GAT baselines, and (4) latency benchmarks on graphs >1M nodes.",
      },
    ],
  },
];

export function getChatById(id: string): ChatSession | undefined {
  return MOCK_CHATS.find((c) => c.id === id);
}
