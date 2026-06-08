"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { SkeletonPdfReader } from "@/components/loader";
import { HighlightMenu } from "@/components/workspace/shared/highlight-menu";
import { InsightModal } from "@/components/workspace/shared/insight-modal";
import { useActiveTab } from "@/lib/stores/workspace-store";
import { usePaper } from "@/modules/research/hooks/usePapers";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false },
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

export function PaperTab() {
  const activeTab = useActiveTab();
  const paperId = activeTab?.meta?.paperId as string | undefined;
  const { data: paper, isLoading } = usePaper(paperId);

  const [numPages, setNumPages] = React.useState<number>(0);
  const [pageNumber, setPageNumber] = React.useState(1);
  const [pdfReady, setPdfReady] = React.useState(false);
  const [selection, setSelection] = React.useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);
  const [insightOpen, setInsightOpen] = React.useState(false);
  const [insightText, setInsightText] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    import("react-pdf").then((mod) => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
      setPdfReady(true);
    });
  }, []);

  React.useEffect(() => {
    const handleMouseUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || !containerRef.current) {
        setSelection(null);
        return;
      }
      const range = sel?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      if (rect) {
        setSelection({
          text,
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (isLoading || !pdfReady) {
    return <SkeletonPdfReader />;
  }

  if (!paper) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Paper not found
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-4">
        <span className="truncate text-sm font-medium">{paper.title}</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="min-w-[80px] text-center text-xs text-muted-foreground">
            {pageNumber} / {numPages || "—"}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex flex-1 justify-center overflow-auto bg-muted/20 p-6"
      >
        <Document
          file={paper.pdfUrl}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          loading={<SkeletonPdfReader />}
          className="shadow-sm"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer
            renderAnnotationLayer
            className="rounded-lg bg-white shadow-md"
            width={Math.min(720, typeof window !== "undefined" ? window.innerWidth - 120 : 720)}
          />
        </Document>
      </div>

      {selection && (
        <HighlightMenu
          position={{ x: selection.x, y: selection.y }}
          selectedText={selection.text}
          onSaveInsight={(text) => {
            setInsightText(text);
            setInsightOpen(true);
          }}
          onClose={() => {
            setSelection(null);
            window.getSelection()?.removeAllRanges();
          }}
        />
      )}

      <InsightModal
        open={insightOpen}
        onOpenChange={setInsightOpen}
        selectedText={insightText}
      />
    </div>
  );
}
