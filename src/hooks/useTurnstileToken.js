import { useCallback, useEffect, useRef, useState } from "react";
import { readTurnstileSiteKey } from "../utils/storeSubmission";

/** Cloudflare's Turnstile script, the same one the Shop Nobi search loads. */
const TurnstileScriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js";

/** Draws the check only when the visitor has to do something, so most visitors see nothing. */
const TurnstileAppearance = "interaction-only";

/**
 * Runs Cloudflare's Turnstile human check in the given element and keeps its latest token. A token works once, so
 * the caller resets the check after each request.
 *
 * @param {{ current: HTMLElement | null }} containerRef The element the check is drawn into when Cloudflare asks.
 * @returns {{token: string, resetToken: () => void}} The token, empty until the check passes, and a way to start over.
 */
export function useTurnstileToken(containerRef) {
  const [token, setToken] = useState("");
  const widgetIdRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    loadTurnstile().then((turnstile) => {
      if (!isMounted || !turnstile || !containerRef.current) {
        return;
      }
      widgetIdRef.current = turnstile.render(containerRef.current, {
        sitekey: readTurnstileSiteKey(),
        appearance: TurnstileAppearance,
        callback: (newToken) => setToken(newToken),
        "expired-callback": () => setToken(""),
        "error-callback": () => setToken(""),
      });
    });
    return () => {
      isMounted = false;
      removeWidget(widgetIdRef.current);
    };
  }, [containerRef]);

  const resetToken = useCallback(() => {
    setToken("");
    if (widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, []);

  return { token, resetToken };
}

/** Takes the check off the page when the form closes. */
function removeWidget(widgetId) {
  if (widgetId === null || !window.turnstile) {
    return;
  }
  try {
    window.turnstile.remove(widgetId);
  } catch (error) {
    // The check is already gone, which is what we wanted.
  }
}

/**
 * Loads Cloudflare's script once and gives back the turnstile object, or null when it cannot load. On /shop the
 * search may already be loading the same script, so an existing script element is waited on, not added again.
 */
function loadTurnstile() {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }
  return new Promise((resolve) => {
    const existingScript = document.querySelector(`script[src="${TurnstileScriptUrl}"]`);
    const script = existingScript || document.createElement("script");
    script.addEventListener("load", () => resolve(window.turnstile || null));
    script.addEventListener("error", () => resolve(null));
    if (!existingScript) {
      script.src = TurnstileScriptUrl;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}
