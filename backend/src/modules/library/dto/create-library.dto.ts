import type { LibraryType } from '../utils';

export class CreateLibraryDto {
  workspaceId: string;
  fileUrl: string;
  type?: LibraryType;
  title?: string;
}
