export function parseDurationToSeconds(value: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(value?.trim());
  if (!match) {
    return 15 * 60;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's':
      return amount;
    case 'm':
      return amount * 60;
    case 'h':
      return amount * 60 * 60;
    case 'd':
      return amount * 24 * 60 * 60;
    default:
      return 15 * 60;
  }
}

// Shared API envelope type and helper used by all modules to return { data, message }.
export type Response<T> = {
  data: T;
  message: string;
};

export function ApiResponse<T>(data: T, message: string): Response<T> {
  return { data, message };
}
