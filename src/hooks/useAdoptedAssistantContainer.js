import { useEffect, useState } from "react";

// The container id the assistant bundle creates when it boots in full-page
// search mode. The Shop Nobi page adopts that container into its own layout.
const AssistantContainerId = "nobi-app-container";

/**
 * Moves the container the assistant bundle appends to the body into the given
 * slot, and back to the body on unmount so the running app survives.
 *
 * @param {{ current: HTMLElement | null }} slotRef The element that holds the container.
 * @returns {boolean} True once the container has arrived in the slot.
 */
export function useAdoptedAssistantContainer(slotRef) {
  const [hasArrived, setHasArrived] = useState(false);

  useEffect(() => {
    const slot = slotRef.current;
    let adoptedContainer = null;

    function adoptContainer() {
      const container = document.getElementById(AssistantContainerId);
      if (!container || !slot || container.parentElement === slot) {
        return false;
      }
      slot.appendChild(container);
      adoptedContainer = container;
      setHasArrived(true);
      return true;
    }

    // React can detach the page before this cleanup runs, which takes the
    // container out of the document too, so it is moved by reference, not id.
    function returnContainerToBody() {
      if (adoptedContainer && adoptedContainer.parentElement !== document.body) {
        document.body.appendChild(adoptedContainer);
      }
    }

    if (adoptContainer()) {
      return returnContainerToBody;
    }

    const observer = new MutationObserver(() => {
      if (adoptContainer()) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
    return () => {
      observer.disconnect();
      returnContainerToBody();
    };
  }, [slotRef]);

  return hasArrived;
}
