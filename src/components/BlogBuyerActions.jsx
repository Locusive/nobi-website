import React from "react";
import { useDemoForm } from "../context/DemoFormContext";
import { getSignupUrl } from "../utils/signupUrl";
import { trackEvent, trackDemoFormOpened } from "../utils/usageSignals";

const BuyerActionEvent = "Blog Buyer Action Clicked";
const LinkStyle = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";

/**
 * Gives comparison readers direct signup, demo, and pricing actions, with the article and placement recorded.
 * Commercial links keep incoming campaign parameters and support opening in another tab.
 *
 * @param {{articleSlug: string, placement: string}} props The article and the location of this call to action.
 */
export default function BlogBuyerActions({ articleSlug, placement }) {
  return (
    <aside className="not-prose my-8 rounded-2xl border border-black/10 bg-black/[.03] p-6 dark:border-white/15 dark:bg-white/5" aria-label="Evaluate Nobi for your store">
      <h3 className="m-0 text-xl font-semibold text-black dark:text-white">Test Nobi against your own catalog</h3>
      <p className="mt-2 text-base leading-relaxed text-black/70 dark:text-white/70">
        See how Nobi handles the searches your shoppers use, or talk through your requirements with our team.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <BlogBuyerLink articleSlug={articleSlug} placement={placement} href="https://dashboard.nobi.ai/signup" className={`${LinkStyle} bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/90`}>
          Preview Nobi free
        </BlogBuyerLink>
        <BlogBuyerLink articleSlug={articleSlug} placement={placement} href={`/blog/${articleSlug}?contact-us=1`} className={`${LinkStyle} border border-black/20 text-black hover:bg-black/5 dark:border-white/30 dark:text-white dark:hover:bg-white/10`}>
          Book a demo
        </BlogBuyerLink>
        <BlogBuyerLink articleSlug={articleSlug} placement={placement} href="/pricing" className={`${LinkStyle} text-black underline underline-offset-4 dark:text-white`}>
          See pricing
        </BlogBuyerLink>
      </div>
      <p className="mb-0 mt-3 text-sm leading-relaxed text-black/60 dark:text-white/60">
        The dashboard preview includes 100 free messages each month, with no credit card. A live-site trial requires a payment method.
      </p>
    </aside>
  );
}

/**
 * Gives article prose and CTA buttons the same attribution and action tracking.
 * Unrelated links retain their original behavior. Pricing forwards the same
 * acquisition parameters as signup so a later signup can still retain them.
 */
export function BlogBuyerLink({ articleSlug, placement = "article", href, onClick, ...props }) {
  const { onOpen } = useDemoForm();
  const articlePath = `/blog/${articleSlug}`;
  const action = href === "https://dashboard.nobi.ai/signup" ? "signup"
    : href === "/pricing" || href?.startsWith("/pricing#") ? "pricing"
    : href === `${articlePath}?contact-us=1` ? "demo" : null;

  if (!action) return <a href={href} onClick={onClick} {...props} />;

  const signupUrl = getSignupUrl();
  const demoParams = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  demoParams.set("contact-us", "1");
  const destination = action === "signup" ? signupUrl
    : action === "pricing" ? `/pricing${new URL(signupUrl).search}${href.slice("/pricing".length)}`
    : `${articlePath}?${demoParams}`;

  /** Records the action and opens the demo in place for an ordinary click. */
  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    trackBlogBuyerAction(articlePath, placement, action);
    if (action !== "demo" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    trackDemoFormOpened();
    onOpen();
  }

  return <a href={destination} onClick={handleClick} {...props} />;
}

/** Records an article reader's chosen commercial action in the existing analytics providers. */
export function trackBlogBuyerAction(articlePath, placement, action) {
  trackEvent(BuyerActionEvent, {
    article_path: articlePath,
    cta_placement: placement,
    action,
  });
}
