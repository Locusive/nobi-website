import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import ScrollLink from "./ScrollLink";
import EnterpriseTag from "../features/EnterpriseTag";
import { ALL_FEATURES_PATH, FEATURE_GROUPS, buildFeaturePath, listFeaturesInGroup } from "../../content/features";

// How long the menu waits after the pointer leaves before closing, so a diagonal move to the panel does not close it.
const CLOSE_DELAY_MS = 140;

/** One feature in the menu: its icon, name, enterprise tag, and one line on what it does. */
function MenuFeatureLink({ feature, onChoose }) {
  const Icon = feature.icon;

  return (
    <ScrollLink to={buildFeaturePath(feature.slug)} onClick={onChoose} className="nb-menu-link" style={{ display: "flex", gap: 10, padding: "10px 10px", borderRadius: 12, textDecoration: "none" }}>
      <span style={{ flex: "none", width: 30, height: 30, borderRadius: 8, background: "#f1ecff", color: "#6d3bff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={16} strokeWidth={2.1} />
      </span>
      <span style={{ flex: 1, minWidth: 0, whiteSpace: "normal" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", rowGap: 3 }}>
          <span style={{ fontSize: 14.5, fontWeight: 600, color: "#1b1626", lineHeight: 1.2 }}>{feature.name}</span>
          {feature.enterprise && <EnterpriseTag />}
        </span>
        <span style={{ display: "block", marginTop: 3, fontSize: 12.5, lineHeight: 1.35, color: "#615b70" }}>{feature.menuLine}</span>
      </span>
    </ScrollLink>
  );
}

/** One column of the menu: the group's name, then each of its features. */
function MenuGroup({ group, onChoose }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ padding: "0 10px 8px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6d3bff" }}>{group.name}</div>
      {listFeaturesInGroup(group.id).map((feature) => (
        <MenuFeatureLink key={feature.slug} feature={feature} onChoose={onChoose} />
      ))}
    </div>
  );
}

/** The open menu: every feature group as a column, with the all-features link below. */
function MenuPanel({ id, onChoose }) {
  return (
    <div id={id} className="nb-product-menu" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 12, width: "min(1180px, calc(100vw - 24px))", zIndex: 10 }}>
      <div style={{ background: "#ffffff", border: "1px solid rgba(20,16,40,0.08)", borderRadius: 24, boxShadow: "0 30px 70px -20px rgba(60,40,110,0.35)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${FEATURE_GROUPS.length}, minmax(0, 1fr))`, gap: 4, padding: "22px 12px 14px" }}>
          {FEATURE_GROUPS.map((group) => (
            <MenuGroup key={group.id} group={group} onChoose={onChoose} />
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 26px", background: "#f7f5fc", borderTop: "1px solid rgba(20,16,40,0.06)" }}>
          <ScrollLink to={ALL_FEATURES_PATH} onClick={onChoose} className="nb-menu-link" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14.5, fontWeight: 700, color: "#6d3bff", textDecoration: "none", padding: "4px 0" }}>
            Explore all features <ArrowRight size={16} />
          </ScrollLink>
          <span style={{ fontSize: 13, color: "#8a8498" }}>Enterprise features are set up by our team.</span>
        </div>
      </div>
    </div>
  );
}

/** Closes the menu when the visitor presses Escape or clicks anywhere outside it. */
function useCloseOnEscapeOrOutsideClick(isOpen, wrapperRef, triggerRef, close) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      close();
      triggerRef.current?.focus();
    };
    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, wrapperRef, triggerRef, close]);
}

/** The Product item in the desktop nav. It opens on hover or click and lists every feature by group. */
export default function ProductMenu({ linkStyle }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const panelId = useId();

  const cancelClose = () => clearTimeout(closeTimer.current);
  const open = () => {
    cancelClose();
    setIsOpen(true);
  };
  const close = () => {
    cancelClose();
    setIsOpen(false);
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS);
  };

  useCloseOnEscapeOrOutsideClick(isOpen, wrapperRef, triggerRef, close);
  useEffect(() => cancelClose, []);

  return (
    <div ref={wrapperRef} onPointerEnter={(event) => event.pointerType === "mouse" && open()} onPointerLeave={(event) => event.pointerType === "mouse" && closeSoon()}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => (isOpen ? close() : open())}
        className="nb-menu-trigger"
        style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, fontFamily: "inherit", fontSize: "inherit" }}
      >
        Product
        <ChevronDown size={15} strokeWidth={2.4} style={{ transition: "transform .18s ease", transform: isOpen ? "rotate(180deg)" : "none" }} />
      </button>
      {isOpen && <MenuPanel id={panelId} onChoose={close} />}
    </div>
  );
}
