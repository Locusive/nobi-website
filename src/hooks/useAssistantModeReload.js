import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isShopNobiPath } from "../utils/shopNobiPage";

// The assistant bundle starts once per page load, as Shop Nobi or as the
// site's floating assistant, based on the page the visitor first opened.
const StartedOnShopNobiPage = typeof window !== "undefined" && isShopNobiPath(window.location.pathname);

/**
 * Reloads the page when a link or the back button crosses between Shop Nobi
 * and the rest of the site, so the assistant bundle restarts in the right mode.
 */
export function useAssistantModeReload() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isShopNobiPath(pathname) !== StartedOnShopNobiPage) {
      window.location.reload();
    }
  }, [pathname]);
}
