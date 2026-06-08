"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import { toast } from "sonner";

const CATEGORIES = ["Idea", "Method", "Finding", "Future Work"] as const;

interface InsightModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
}

export function InsightModal({
  open,
  onOpenChange,
  selectedText,
}: InsightModalProps) {
  const [category, setCategory] = React.useState<string>("Finding");

  const aiSummary = `This passage discusses: "${selectedText.slice(0, 120)}${selectedText.length > 120 ? "…" : ""}" — key concept relevant to your research context.`;

  const handleSave = () => {
    toast.success("Insight saved", {
      description: `${category} captured from paper highlight`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Save Insight</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-[10px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>AI Summary</Label>
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              {aiSummary}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Selected text</Label>
            <p className="rounded-xl border border-border bg-muted/20 p-3 text-sm italic">
              &ldquo;{selectedText.slice(0, 200)}
              {selectedText.length > 200 ? "…" : ""}&rdquo;
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Insight</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
