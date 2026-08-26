"use client";

import { Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AddToDesktop({ page }: { page: "admin" | "dashboard" }) {
  return (
    <Button asChild variant="outline" size="sm">
      <a href={`/api/shortcut?page=${page}`} download>
        <Monitor className="mr-1.5 h-4 w-4" />
        Add to Desktop
      </a>
    </Button>
  );
}
