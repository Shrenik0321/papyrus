import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export const FileStorageDriver = {
  Local: 'local',
  Server: 'server',
} as const;

export type FileStorageDriver =
  (typeof FileStorageDriver)[keyof typeof FileStorageDriver];

export function getFileStorageConfig() {
  const root = process.env.FILE_STORAGE_ROOT ?? 'files';
  const publicBaseUrl = (
    process.env.FILE_STORAGE_PUBLIC_BASE_URL ?? 'http://localhost:8000/files'
  ).replace(/\/$/, '');
  const driver =
    (process.env.FILE_STORAGE_DRIVER as FileStorageDriver | undefined) ??
    FileStorageDriver.Local;

  return { root, publicBaseUrl, driver };
}

export function createFileStorageUploadConfig() {
  const { root } = getFileStorageConfig();

  return diskStorage({
    destination: (_request, _file, callback) => {
      const directory = join(process.cwd(), root);
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
      }

      callback(null, directory);
    },
    filename: (_request, file, callback) => {
      callback(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  });
}

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
