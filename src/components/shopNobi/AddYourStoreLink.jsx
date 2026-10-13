import React, { useCallback, useState } from "react";
import AddYourStoreForm from "./AddYourStoreForm";

/**
 * A small link under the Shop Nobi search for store owners, which opens the "Add your store" form. The link hides
 * once live results are drawn, but an open form stays open.
 *
 * @param {{isLinkHidden: boolean}} props Whether the link is hidden.
 */
export default function AddYourStoreLink({ isLinkHidden }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const closeForm = useCallback(() => setIsFormOpen(false), []);

  return (
    <>
      {!isLinkHidden && (
        <p className="px-4 py-6 text-center text-sm text-black/60 dark:text-white/60">
          Run an online store?{" "}
          <button type="button" className="underline hover:text-black dark:hover:text-white" onClick={() => setIsFormOpen(true)}>
            Add it to Shop Nobi
          </button>
        </p>
      )}
      {isFormOpen && <AddYourStoreForm onClose={closeForm} />}
    </>
  );
}
