import React, { useId, useState } from "react";
import { useDemoForm } from "../context/DemoFormContext";
import { BUNDLE_STOPS } from "../utils/bundleStops";

const LAST_STOP = BUNDLE_STOPS.length - 1;

/** Lets a visitor slide through the monthly bundles and see each one's price. */
export default function BundleSlider({ initialStop = 0 }) {
  const id = useId();
  const [stopIndex, setStopIndex] = useState(initialStop);
  const { onOpen: openDemoForm } = useDemoForm();
  const stop = BUNDLE_STOPS[stopIndex];

  return <div className="pp-slider">
    <label htmlFor={`${id}-range`} className="pp-slider-label">
      <strong>{stop.messages}</strong> messages a month
    </label>
    <input id={`${id}-range`} type="range" min="0" max={LAST_STOP} step="1" value={stopIndex}
      aria-valuetext={stop.valueText} onChange={event => setStopIndex(Number(event.target.value))} />
    <div className="pp-slider-ends" aria-hidden="true"><span>{BUNDLE_STOPS[0].messages}</span><span>{BUNDLE_STOPS[LAST_STOP].messages}</span></div>
    {stop.custom ? <div className="pp-base pp-base-custom">
      <strong>Custom pricing</strong>
      <button type="button" className="pp-sales" onClick={openDemoForm}>Talk to sales</button>
    </div> : <div className="pp-base">
      <strong>{stop.price}</strong><span>/ month<br />{stop.pricePerMessage} per message</span>
    </div>}
  </div>;
}
