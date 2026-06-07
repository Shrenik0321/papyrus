/** Browser calls same-origin `/api` (rewritten to Nest). Override for direct API access if needed. */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";
