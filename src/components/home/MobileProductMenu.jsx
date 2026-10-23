import React, { useId, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import ScrollLink from "./ScrollLink";
import EnterpriseTag from "../features/EnterpriseTag";
import { ALL_FEATURES_PATH, FEATURE_GROUPS, buildFeaturePath, listFeaturesInGroup } from "../../content/features";

/** The Product row in the phone menu. Tapping it shows every feature by group, plus a link to all features. */
export default function MobileProductMenu({ linkStyle, onChoose }) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => setIsOpen((value) => !value)}
        className="nb-menu-trigger"
        style={{ ...linkStyle, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 16, padding: "15px 16px", borderRadius: 12, background: "none", border: "none", fontFamily: "inherit", textAlign: "left" }}
      >
        Product
        <ChevronDown size={18} style={{ transition: "transform .18s ease", transform: isOpen ? "rotate(180deg)" : "none" }} />
      </button>
      {isOpen && (
        <div id={listId} style={{ padding: "2px 0 10px" }}>
          {FEATURE_GROUPS.map((group) => (
            <div key={group.id} style={{ padding: "8px 0" }}>
              <div style={{ padding: "0 8px 4px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6d3bff" }}>{group.name}</div>
              {listFeaturesInGroup(group.id).map((feature) => (
                <ScrollLink key={feature.slug} to={buildFeaturePath(feature.slug)} onClick={onChoose} className="nb-menu-link" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 8px", borderRadius: 10, fontSize: 15, color: "#1b1626", textDecoration: "none" }}>
                  {feature.name}
                  {feature.enterprise && <EnterpriseTag />}
                </ScrollLink>
              ))}
            </div>
          ))}
          <ScrollLink to={ALL_FEATURES_PATH} onClick={onChoose} className="nb-menu-link" style={{ display: "inline-flex", alignItems: "center", gap: 7, margin: "6px 8px 0", padding: "6px 0", fontSize: 15, fontWeight: 700, color: "#6d3bff", textDecoration: "none" }}>
            Explore all features <ArrowRight size={16} />
          </ScrollLink>
        </div>
      )}
    </div>
  );
}
