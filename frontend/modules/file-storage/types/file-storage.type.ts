import type { ComponentProps } from "react";
import type { Accept } from "react-dropzone";
import type { Button } from "@/components/ui/button";

export type UploadFileResult = {
  fileUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type FileUploadSuccessPayload = {
  file: File;
  result: UploadFileResult;
};

export type FileUploadButtonProps = {
  onUploadSuccess: (payload: FileUploadSuccessPayload) => void;
  accept?: Accept;
  label?: string;
  disabled?: boolean;
  title?: string;
  description?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
};
