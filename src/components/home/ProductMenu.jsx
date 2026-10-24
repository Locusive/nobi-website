import React, { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import ScrollLink from "./ScrollLink";
import EnterpriseTag from "../features/EnterpriseTag";
import { ALL_FEATURES_PATH, FEATURE_GROUPS, buildFeaturePath, listFeaturesInGroup } from "../../content/features";

// How long the menu waits after the pointer leaves before closing, so a diagonal move to the panel does not close it.
const CLOSE_DELAY_MS = 140;

/** One feature in the menu: its name, its tag when it is an enterprise feature, and one line on what it does. */
function MenuFeatureLink({ feature, onChoose }) {
  return (
    <ScrollLink to={buildFeaturePath(feature.slug)} onClick={onChoose} className="nb-menu-link" style={{ display: "block", padding: "10px 12px", borderRadius: 12, textDecoration: "none" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#1b1626" }}>{feature.name}</span>
        {feature.enterprise && <EnterpriseTag />}
      </span>
      <span style={{ display: "block", marginTop: 3, fontSize: 13, lineHeight: 1.4, color: "#615b70", whiteSpace: "normal" }}>{feature.menuLine}</span>
    </ScrollLink>
  );
}

/** One column of the menu: the group's name, then each of its features. */
function MenuGroup({ group, onChoose }) {
  return (
    <div>
      <div style={{ padding: "0 12px 8px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6d3bff" }}>{group.name}</div>
      {listFeaturesInGroup(group.id).map((feature) => (
        <MenuFeatureLink key={feature.slug} feature={feature} onChoose={onChoose} />
      ))}
    </div>
  );
}

/** A featured group shown in the menu footer: its name, its one line, and a link to its feature. */
function MenuFeaturedGroup({ group, onChoose }) {
  const feature = listFeaturesInGroup(group.id)[0];

  return (
    <ScrollLink to={buildFeaturePath(feature.slug)} onClick={onChoose} className="nb-menu-link" style={{ display: "block", flex: "1 1 240px", padding: "12px 14px", borderRadius: 14, textDecoration: "none", background: "#ffffff", border: "1px solid rgba(20,16,40,0.08)" }}>
      <span style={{ display: "block", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6d3bff" }}>{group.name}</span>
      <span style={{ display: "block", marginTop: 4, fontSize: 14.5, color: "#1b1626", whiteSpace: "normal" }}>{group.summary}</span>
    </ScrollLink>
  );
}

/** The open menu: the main feature groups as columns, with featured groups and the all-features link below. */
function MenuPanel({ id, onChoose }) {
  const columnGroups = FEATURE_GROUPS.filter((group) => !group.featured);
  const featuredGroups = FEATURE_GROUPS.filter((group) => group.featured);

  return (
    <div id={id} className="nb-product-menu" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", paddingTop: 12, width: "min(1040px, calc(100vw - 32px))", zIndex: 10 }}>
      <div style={{ background: "#ffffff", border: "1px solid rgba(20,16,40,0.08)", borderRadius: 24, boxShadow: "0 30px 70px -20px rgba(60,40,110,0.35)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columnGroups.length},1fr)`, gap: 8, padding: "22px 14px 14px" }}>
          {columnGroups.map((group) => (
            <MenuGroup key={group.id} group={group} onChoose={onChoose} />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: "16px 16px 8px" }}>
          {featuredGroups.map((group) => (
            <MenuFeaturedGroup key={group.id} group={group} onChoose={onChoose} />
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
