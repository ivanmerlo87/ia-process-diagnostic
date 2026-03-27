"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-MXR302MVW3";
const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "w0g51etiuj";

type AnalyticsAttributes = {
  eventName: string;
  label?: string;
  placement?: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

function normalizeEventPart(value?: string) {
  return value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function trackCustomEvent({
  eventName,
  label,
  placement,
}: AnalyticsAttributes) {
  if (GA_MEASUREMENT_ID && typeof window.gtag === "function") {
    window.gtag("event", eventName, {
      event_category: "engagement",
      event_label: label ?? placement ?? eventName,
      cta_label: label,
      cta_placement: placement,
      transport_type: "beacon",
    });
  }

  if (typeof window.clarity === "function") {
    const clarityEventName = [
      normalizeEventPart(eventName),
      normalizeEventPart(placement),
      normalizeEventPart(label),
    ]
      .filter(Boolean)
      .join("_")
      .slice(0, 128);

    window.clarity("event", clarityEventName || eventName);
  }
}

export function SiteAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") {
      return;
    }

    const search = window.location.search;
    const pagePath = search ? `${pathname}${search}` : pathname;

    window.gtag("config", GA_MEASUREMENT_ID, {
      page_location: window.location.href,
      page_path: pagePath,
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const trackedLink = target.closest<HTMLAnchorElement>("a[data-analytics-event]");

      if (!trackedLink) {
        return;
      }

      const eventName = trackedLink.dataset.analyticsEvent;

      if (!eventName) {
        return;
      }

      trackCustomEvent({
        eventName,
        label: trackedLink.dataset.analyticsLabel ?? trackedLink.textContent?.trim(),
        placement: trackedLink.dataset.analyticsPlacement,
      });

      if (trackedLink.dataset.analyticsLead === "true" && typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          currency: "USD",
          value: 1,
          lead_source: "diagnostic_tool",
          method: "whatsapp",
          event_label: trackedLink.dataset.analyticsLabel ?? eventName,
          cta_label: trackedLink.dataset.analyticsLabel,
          cta_placement: trackedLink.dataset.analyticsPlacement,
          transport_type: "beacon",
        });
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <>
      {GA_MEASUREMENT_ID ? (
        <>
          <Script
            id="google-analytics"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = window.gtag || gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
            `}
          </Script>
        </>
      ) : null}

      {CLARITY_PROJECT_ID ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>
      ) : null}
    </>
  );
}
