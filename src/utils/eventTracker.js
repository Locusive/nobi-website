import MixpanelClient from '../service-clients/mixpanel-client';
import { EVENTS } from '../constants/events';

function toGaEventName(eventName) {
  return String(eventName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Track an event to multiple analytics providers
 * Currently supports: Mixpanel and Google Analytics via Google Tag Manager.
 *
 * @param {string} eventName - The name of the event
 * @param {Object} properties - Event properties
 * @param {Object} options - Provider-specific options
 * @param {string} options.gaEventName - Override for the GA/GTM event name
 * @param {Object} options.gaProperties - GA/GTM-specific event properties
 * @param {Object} options.mixpanelProperties - Mixpanel-specific event properties
 * @param {string} options.visitorContext - Context to add to the Nobi visitor profile
 */
export function trackEvent(eventName, properties = {}, options = {}) {
  const mixpanelProperties = options.mixpanelProperties || properties;
  const gaProperties = options.gaProperties || properties;

  // Track to Mixpanel
  MixpanelClient.track(eventName, mixpanelProperties);

  // Track to GA through GTM. GA event names should be stable snake_case,
  // while Mixpanel can keep the readable event names above.
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: options.gaEventName || toGaEventName(eventName),
      mixpanel_event_name: eventName,
      ...gaProperties,
    });
  }

  if (
    options.visitorContext &&
    typeof window !== 'undefined' &&
    window.Nobi?.addVisitorContext
  ) {
    window.Nobi.addVisitorContext(options.visitorContext);
  }
}

/**
 * Track demo form opened
 */
export function trackDemoFormOpened() {
  trackEvent(EVENTS.DEMO_FORM_OPENED, {
    source: 'website'
  });
}

/**
 * Track scroll preview interaction
 * @param {string} previewText - The text content of the preview at time of click
 */
export function trackScrollPreviewClicked(previewText) {
  trackEvent(EVENTS.SCROLL_PREVIEW_CLICKED, {
    preview_text: previewText,
    source: 'website'
  });
}
