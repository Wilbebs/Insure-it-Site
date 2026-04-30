"use client";

import { useState } from "react";
import { ShieldCheck, Lock, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navigation />

      <main className="pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                {t.clientCenter.portalNote}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              {t.clientCenter.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              {t.clientCenter.subtitle}
            </p>
          </div>

          <div
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-slate-200 overflow-hidden"
            data-testid="client-center-portal-wrapper"
          >
            <iframe
              src={CLIENT_PORTAL_URL}
              name="EZLynx Customer Service Portal"
              title="EZLynx Customer Service Portal"
              className="w-full block border-0"
              style={{ height: "1600px" }}
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

          <p className="text-center text-xs text-slate-500 mt-3">
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

          <div className="mt-10 sm:mt-12 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-slate-50 ring-1 ring-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="hidden sm:flex w-12 h-12 rounded-full bg-blue-100 items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                  {t.clientCenter.newToInsureIt}
                </h2>
              </div>
            </div>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
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
