"use client";

import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import QuoteModal from "@/components/quote-modal";
import { useTranslation } from "@/components/theme-provider";

const CLIENT_PORTAL_URL =
  "https://customerservice.agentinsure.com/EzlynxCustomerService/insure/Account/LogIn";

export default function ClientCenter() {
  const { t } = useTranslation();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 flex flex-col">
        <div
          className="relative w-full bg-white"
          data-testid="client-center-portal-wrapper"
        >
          <iframe
            src={CLIENT_PORTAL_URL}
            name="EZLynx Customer Service Portal"
            title="EZLynx Customer Service Portal"
            className="w-full block border-0 h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)]"
            data-testid="client-center-iframe"
          />
          <noscript>
            <div className="p-6 text-center text-sm text-slate-600">
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
            </div>
          </noscript>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <p className="text-center text-xs text-slate-500 mb-5">
            {t.clientCenter.iframeFallback}{" "}
            <a
              href={CLIENT_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
              data-testid="client-center-fallback-link"
            >
              {t.clientCenter.fallbackLinkText}
            </a>
            .
          </p>

          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-blue-50 via-white to-slate-50 ring-1 ring-slate-200 px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-blue-100 items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
                {t.clientCenter.newToInsureIt}
              </h2>
            </div>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap"
              data-testid="client-center-get-quote-cta"
            >
              {t.clientCenter.getQuoteCta}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer onGetQuote={() => setQuoteModalOpen(true)} />
      <QuoteModal open={quoteModalOpen} onOpenChange={setQuoteModalOpen} />
    </div>
  );
}
