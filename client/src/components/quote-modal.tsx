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

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuoteModal({ open, onOpenChange }: QuoteModalProps) {
  const { t } = useTranslation();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
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
    if (typeof window === "undefined") return;
    let lastBucket = window.innerWidth < 640 ? "mobile" : "desktop";
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const evaluate = () => {
      const bucket = window.innerWidth < 640 ? "mobile" : "desktop";
      if (bucket !== lastBucket) {
        lastBucket = bucket;
        setReloadKey((k) => k + 1);
      }
    };

    const onOrientation = () => setReloadKey((k) => k + 1);
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(evaluate, 250);
    };

    window.addEventListener("orientationchange", onOrientation);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("orientationchange", onOrientation);
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="custom-scrollbar max-w-3xl max-h-[90vh] overflow-y-auto border shadow-2xl rounded-3xl max-sm:w-screen max-sm:max-w-[100vw] max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:rounded-none max-sm:border-0 max-sm:p-0 max-sm:gap-0 max-sm:flex max-sm:flex-col max-sm:overflow-hidden"
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

        <div className="relative w-full min-w-0 bg-white rounded-2xl max-sm:rounded-none max-sm:flex-1 max-sm:h-full">
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
            key={reloadKey}
            src={EZLYNX_QUOTE_URL}
            title={t.quote.dialogTitle}
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="block border-0 bg-white w-full h-[1500px] max-sm:h-full"
            data-testid="iframe-ezlynx-quote"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
