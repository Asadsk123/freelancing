import { File, FileImage, FileText, FileVideo, FileArchive, FileCode, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const iconMap: Record<string, LucideIcon> = {
  "image/png": FileImage,
  "image/jpeg": FileImage,
  "image/jpg": FileImage,
  "image/gif": FileImage,
  "image/svg+xml": FileImage,
  "image/webp": FileImage,
  "image/avif": FileImage,
  "application/pdf": FileText,
  "video/mp4": FileVideo,
  "video/webm": FileVideo,
  "video/quicktime": FileVideo,
  "application/zip": FileArchive,
  "application/x-rar-compressed": FileArchive,
  "application/x-7z-compressed": FileArchive,
  "text/html": FileCode,
  "text/css": FileCode,
  "application/javascript": FileCode,
};

type FileIconProps = {
  mimeType?: string;
  className?: string;
};

export function FileIcon({ mimeType, className }: FileIconProps) {
  const Icon: LucideIcon = (mimeType ? iconMap[mimeType] : undefined) ?? File;
  return <Icon className={cn("h-4 w-4 text-[var(--muted-foreground)]", className)} />;
}
