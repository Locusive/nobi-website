import { useEffect, useState } from "react";
import { haveLiveResultsDrawn, watchForLiveResults } from "../utils/shopNobiPrebuiltContent";

/**
 * Says whether the assistant bundle has drawn live products on this page yet.
 *
 * @returns {boolean} True from the first time live products are drawn.
 */
export function useLiveResultsHaveDrawn() {
  const [haveDrawn, setHaveDrawn] = useState(() => typeof window !== "undefined" && haveLiveResultsDrawn(window));

  useEffect(() => watchForLiveResults(window, () => setHaveDrawn(true)), []);

  return haveDrawn;
}
