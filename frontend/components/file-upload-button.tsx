"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatFileSize } from "@/lib/utils";
import { useUploadFile } from "@/modules/file-storage/hooks/useFileStorage";
import type { FileUploadButtonProps } from "@/modules/file-storage/types/file-storage.type";
import { FileIcon, Loader2Icon, UploadIcon } from "lucide-react";
import * as React from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";

export function FileUploadButton({
  onUploadSuccess,
  accept,
  label = "Upload",
  disabled = false,
  title = "Upload file",
  description = "Drag and drop a file here, or click to browse.",
  variant,
  size,
  className,
  open: openProp,
  onOpenChange,
  showTrigger = true,
}: FileUploadButtonProps) {
  const uploadMutation = useUploadFile();
  const isUploading = uploadMutation.isPending;

  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(nextOpen);
      } else {
        setInternalOpen(nextOpen);
      }
    },
    [onOpenChange],
  );
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [rejectionMessage, setRejectionMessage] = React.useState<string | null>(
    null,
  );

  const resetState = React.useCallback(() => {
    setSelectedFile(null);
    setRejectionMessage(null);
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isUploading) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      resetState();
    }
  };

  const onDrop = React.useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setRejectionMessage(null);

      if (fileRejections.length > 0) {
        const message =
          fileRejections[0]?.errors[0]?.message ?? "File type not accepted";
        setRejectionMessage(message);
        setSelectedFile(null);
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      multiple: false,
      disabled: isUploading,
    });

  const handleUpload = () => {
    if (!selectedFile || isUploading) return;

    const file = selectedFile;

    uploadMutation.mutate(file, {
      onSuccess: (result) => {
        toast.success(`Uploaded ${file.name}`);
        onUploadSuccess({ file, result });
        resetState();
        setOpen(false);
      },
      onError: (error) => {
        toast.error(error.message || "Upload failed");
      },
    });
  };

  return (
    <>
      {showTrigger && (
        <Button
          type="button"
          variant={variant}
          size={size}
          className={cn("rounded-[10px]", className)}
          disabled={disabled || isUploading}
          onClick={() => setOpen(true)}
        >
          {isUploading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <UploadIcon className="size-4" />
          )}
          {label}
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div
            {...getRootProps()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
              isDragActive && !isDragReject && "border-primary bg-primary/5",
              isDragReject && "border-destructive bg-destructive/5",
              !isDragActive &&
                !isDragReject &&
                "border-border bg-muted/30 hover:bg-muted/50",
              isUploading && "pointer-events-none opacity-50",
            )}
          >
            <input {...getInputProps()} />
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
              <UploadIcon className="size-6 text-muted-foreground" />
            </div>
            {isDragReject ? (
              <p className="text-sm font-medium text-destructive">
                File type not accepted
              </p>
            ) : isDragActive ? (
              <p className="text-sm font-medium text-primary">
                Drop file here
              </p>
            ) : (
              <>
                <p className="text-sm font-medium">
                  Drag and drop a file here
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  or click to browse
                </p>
              </>
            )}
          </div>

          {rejectionMessage && (
            <p className="text-sm text-destructive">{rejectionMessage}</p>
          )}

          {selectedFile && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileIcon className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <UploadIcon className="size-4" />
              )}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
