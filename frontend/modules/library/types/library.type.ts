export type LibraryType = "note" | "paper";

export type LibraryItem = {
  id: string;
  title: string;
  type: LibraryType;
  fileUrl: string;
  workspaceId: string;
  createdById: string;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AddLibraryItemInput = {
  workspaceId: string;
  fileUrl: string;
  type?: LibraryType;
  title?: string;
};
