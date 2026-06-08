import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1280;

type Breakpoint = "mobile" | "tablet" | "desktop";

function getBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < MOBILE_BREAKPOINT) return "mobile";
  if (width < DESKTOP_BREAKPOINT) return "tablet";
  return "desktop";
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(getBreakpoint);

  React.useEffect(() => {
    const update = () => {
      setBreakpoint(getBreakpoint());
    };

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
    isCompact: breakpoint === "mobile" || breakpoint === "tablet",
  };
}
