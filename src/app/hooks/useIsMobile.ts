import { useEffect, useState } from "react";

function computeIsMobileLayout(): boolean {
  if (typeof window === "undefined") return false;

  const isPhoneWidth = window.matchMedia("(max-width: 767px)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const isTabletWidth = window.matchMedia("(max-width: 1024px)").matches;

  // Phones always mobile; tablets only if touch.
  return isPhoneWidth || (isTouchDevice && isTabletWidth);
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(computeIsMobileLayout());

    update();

    const mqlPhone = window.matchMedia("(max-width: 767px)");
    const mqlTablet = window.matchMedia("(max-width: 1024px)");

    mqlPhone.addEventListener?.("change", update);
    mqlTablet.addEventListener?.("change", update);
    window.addEventListener("orientationchange", update);

    return () => {
      mqlPhone.removeEventListener?.("change", update);
      mqlTablet.removeEventListener?.("change", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return isMobile;
}
