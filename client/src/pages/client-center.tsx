"use client";

import { useTranslation } from "@/components/theme-provider";

const CLIENT_PORTAL_URL =
  "https://customerservice.agentinsure.com/EzlynxCustomerService/insure/Account/LogIn";

export default function ClientCenter() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-white">
      <iframe
        src={CLIENT_PORTAL_URL}
        name="EZLynx Customer Service Portal"
        title="EZLynx Customer Service Portal"
        className="w-full h-full border-0 block"
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
  );
}
