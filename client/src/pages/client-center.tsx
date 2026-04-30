"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import QuoteModal from "@/components/quote-modal";
import { useTranslation } from "@/components/theme-provider";

const CLIENT_PORTAL_URL =
  "https://customerservice.agentinsure.com/EzlynxCustomerService/insure/Account/LogIn";

export default function ClientCenter() {
  const { t } = useTranslation();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted dot-pattern flex flex-col">
      <Navigation />

      <main className="flex-1 flex flex-col pt-12 sm:pt-16 pb-24 sm:pb-24">
        <div
          className="relative w-full max-w-[988px] mx-auto px-4 sm:px-6 py-6 sm:py-8"
          data-testid="client-center-portal-wrapper"
        >
          <iframe
            src={CLIENT_PORTAL_URL}
            name="EZLynx Customer Service Portal"
            title="EZLynx Customer Service Portal"
            className="w-full max-w-[940px] mx-auto block border-0 h-[1240px] sm:h-[600px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl ring-1 ring-slate-200"
            data-testid="client-center-iframe"
          />
          <noscript>
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-slate-600 bg-white">
              <p>
                {t.clientCenter.iframeFallback}{" "}
                <a
                  href={CLIENT_PORTAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {t.clientCenter.fallbackLinkText}
                </a>
                .
              </p>
            </div>
          </noscript>
        </div>
      </main>

      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-2rem)] pointer-events-none">
        <div className="pointer-events-auto inline-flex w-auto rounded-full bg-white/95 backdrop-blur-md ring-1 ring-slate-200 shadow-2xl px-3 py-2 sm:px-4 sm:py-2.5 items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex w-8 h-8 rounded-full bg-blue-100 items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
            {t.clientCenter.newToInsureIt}
          </h2>
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap"
            data-testid="client-center-get-quote-cta"
          >
            {t.clientCenter.getQuoteCta}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
