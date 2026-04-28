import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "./theme-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const EZLYNX_QUOTE_URL =
  "https://www.agentinsure.com/compare/auto-insurance-home-insurance/insure/quote.aspx";

const NATURAL_WIDTH = 768;
const NATURAL_HEIGHT = 1500;

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const { t } = useTranslation();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      setIframeLoaded(false);
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      return;
    }

    fallbackTimerRef.current = setTimeout(() => {
      setIframeLoaded(true);
    }, 8000);

    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setScale(Math.min(1, w / NATURAL_WIDTH));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  const scaledHeight = Math.round(NATURAL_HEIGHT * scale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="custom-scrollbar max-w-3xl max-h-[90vh] overflow-y-auto border shadow-2xl rounded-3xl max-sm:w-screen max-sm:max-w-[100vw] max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:rounded-none max-sm:border-0 max-sm:p-0 max-sm:gap-0"
        style={{
          background: "#ffffff",
          borderColor: "hsla(210, 40%, 88%, 0.5)",
        }}
        aria-describedby="quote-form-description"
      >
        <DialogHeader className="pb-2 max-sm:sr-only">
          <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 text-center">
            {t.quote.dialogTitle}
          </DialogTitle>
          <p
            id="quote-form-description"
            className="text-slate-600 text-center text-sm"
          >
            {t.quote.dialogSubtitle}
          </p>
        </DialogHeader>

        <DialogClose
          className="hidden max-sm:flex fixed top-2 right-2 z-[60] items-center justify-center w-10 h-10 rounded-full bg-white/95 shadow-lg ring-1 ring-slate-200 text-slate-700 active:scale-95 transition-transform"
          aria-label="Close"
          data-testid="button-close-quote-modal-mobile"
        >
          <X className="h-5 w-5" />
        </DialogClose>

        <div
          ref={containerRef}
          className="relative w-full min-w-0 overflow-hidden bg-white rounded-2xl max-sm:rounded-none"
          style={{ height: `${scaledHeight}px` }}
        >
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white rounded-2xl max-sm:rounded-none z-10 transition-opacity duration-500 ease-out ${
              iframeLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-hidden={iframeLoaded}
          >
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
            </div>
            <p className="text-slate-600 text-sm font-medium">
              {t.quote.loadingQuote}
            </p>
          </div>
          <iframe
            src={EZLYNX_QUOTE_URL}
            title={t.quote.dialogTitle}
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="block border-0 bg-white"
            style={{
              width: `${NATURAL_WIDTH}px`,
              height: `${NATURAL_HEIGHT}px`,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
            }}
            data-testid="iframe-ezlynx-quote"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
