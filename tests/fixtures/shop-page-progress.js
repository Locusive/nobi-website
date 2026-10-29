// Script only the external assistant's arrival and draw inputs for actual ShopPage render assertions.
let progress;
export function setPageProgress(next) { progress = next; }
export function useAdoptedAssistantContainer() { return progress.assistantHasMounted; }
export function useLiveResultsHaveDrawn() { return progress.liveResultsHaveDrawn; }
