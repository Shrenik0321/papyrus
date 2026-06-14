export class WorkspaceResponseDto {
  id: string;
  title: string;
  userId: string;
  createdById: string;
  updatedById: string | null;
  createdAt: Date;
  updatedAt: Date;
}
