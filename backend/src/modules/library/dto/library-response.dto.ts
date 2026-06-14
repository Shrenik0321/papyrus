import type { LibraryType } from '../utils';

export class LibraryResponseDto {
  id: string;
  title: string;
  type: LibraryType;
  fileUrl: string;
  workspaceId: string;
  createdById: string;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
}
