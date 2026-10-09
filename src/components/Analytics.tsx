import { useEffect } from "react";
import { useConsent } from "@/lib/cookie-consent";

const GA_ID = "G-XXXXXXX"; // your real Measurement ID

declare global {
  interface Window {
    dataLayer: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

export const Analytics = () => {
  const analyticsOn = useConsent("analytics");

  useEffect(() => {
    // Switched off (or never switched on): tell GA to stay quiet
    window[`ga-disable-${GA_ID}`] = !analyticsOn;
    if (!analyticsOn) return;

    // Already loaded earlier this session
    if (document.getElementById("ga-script")) return;

    const s = document.createElement("script");
    s.id = "ga-script";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", GA_ID);
  }, [analyticsOn]);

  return null;
};

// This file is for Google analytics if added.