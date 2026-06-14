export const LibraryType = {
  Note: 'note',
  Paper: 'paper',
} as const;

export type LibraryType = (typeof LibraryType)[keyof typeof LibraryType];

export const LIBRARY_API_MESSAGES = {
  getAll: 'Library items retrieved successfully',
  getOne: 'Library item retrieved successfully',
  create: 'Library item created successfully',
  replace: 'Library item replaced successfully',
  update: 'Library item updated successfully',
  delete: 'Library item deleted successfully',
} as const;
