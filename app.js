/**
 * Animal-Centred Wildfire Recovery Decision Support — app.js
 * ============================================================
 * Main application logic. All data comes from data/scenario.js (SCENARIO object).
 * This file is intentionally modular: rendering functions are separated from
 * data so verified sources can be swapped in without changing UI logic.
 *
 * ⚠️ PROTOTYPE — NOT VALIDATED
 * This tool is a human decision-support prototype for an Ethics of AI assignment.
 * It does NOT automatically issue or execute management instructions.
 */

"use strict";

/* ═══════════════════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════════════════ */
const STATE = {
  currentScreen: "case-overview",
  activeSpeciesTab: 0,
  compareView: "side-by-side",
  expertRecord: {
    evidenceVersion: "",
    supportingEvidence: "",
    reviewer: "",
    date: new Date().toISOString().split("T")[0],
    preferredOption: "",
    rationale: "",
    challengedItems: "",
    unresolvedRisks: "",
    additionalNotes: "",
    overriddenAssessments: "",
    reviewStatus: "draft",
    approvalConfirmed: false,
    signedOff: false,
    savedAt: null,
    humanNeedCategory: "unknown",
    humanNeed: "",
    animalSafeguards: "",
  },
  checklistOverrides: {},
  checklistReviewerNotes: "",
};

/* ═══════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════ */

function getStatusClass(status) {
  if (!status) return "unknown";
  const s = status.toLowerCase();
  if (s.includes("high")) return "high";
  if (s.includes("moderate")) return "moderate";
  if (s.includes("low")) return "low";
  return "unknown";
}

function getWelfareBadgeClass(status) {
  if (!status) return "badge-unknown";
  const s = status.toUpperCase();
  if (s.includes("HIGH")) return "badge-high";
  if (s.includes("MODERATE")) return "badge-moderate";
  if (s.includes("LOW")) return "badge-low";
  return "badge-unknown";
}

function getEvidenceBadgeClass(type) {
  if (!type) return "ev-unknown";
  const t = type.toLowerCase();
  if (t.includes("observation")) return "ev-observation";
  if (t.includes("inference")) return "ev-inference";
  return "ev-unknown";
}

function getWelfareIcon(domain) {
  const icons = { food: "🍃", water: "💧", shelter: "🏕️", breeding: "🥚", movement: "🏃" };
  return icons[domain] || "•";
}

function getStakeholderBadge(welfare) {
  if (!welfare) return "badge-unknown";
  const w = welfare.toUpperCase();
  if (w.includes("POSITIVE")) return "badge-positive";
  if (w.includes("NEGATIVE")) return "badge-negative";
  if (w.includes("NEUTRAL")) return "badge-neutral";
  if (w.includes("UNCERTAIN") || w.includes("MIXED")) return "badge-uncertain";
  return "badge-unknown";
}

function getUncertaintyDots(level) {
  const levels = {
    "very high": 4, "high": 3, "moderate": 2, "low": 1, "very low": 1,
  };
  const filled = levels[level ? level.toLowerCase().split(" —")[0].trim() : ""] || 2;
  const classes = ["filled-l", "filled-m", "filled-h", "filled-vh"];
  let html = '<div class="uncertainty-meter" aria-label="Uncertainty level: ' + level + '">';
  for (let i = 0; i < 4; i++) {
    html += `<div class="uncertainty-dot ${i < filled ? classes[filled - 1] : ""}"></div>`;
  }
  html += `<span style="font-size:0.7rem;color:var(--clr-text-muted);margin-left:4px;">${level || "Unknown"}</span>`;
  html += "</div>";
  return html;
}

function domainLabel(d) {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════ */

function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  // Remove active from all nav items
  document.querySelectorAll(".nav-item").forEach((n) => {
    n.classList.remove("active");
    n.removeAttribute("aria-current");
  });

  // Show target screen
  const target = document.getElementById("screen-" + screenId);
  if (target) {
    target.classList.add("active");
    target.focus && target.setAttribute("tabindex", "-1");
  }

  // Set active nav
  const navItem = document.getElementById("nav-" + screenId);
  if (navItem) {
    navItem.classList.add("active");
    navItem.setAttribute("aria-current", "page");
  }

  // Update breadcrumb
  const labels = {
    "demo-start": "Understand the case",
    "demo-options": "Compare options",
    "demo-decision": "Explain and export",
    "case-overview": "Explore wildfire",
    "ecological-evidence": "Ecological evidence",
    "biodiversity-comparison": "Biodiversity comparison",
    "ai-assistant": "AI Ecological Assistant",
    "restoration-summary": "Restoration summary",
    "welfare-context": "Animal Welfare Context",
    "compare-pathways": "Compare Pathways",
    "expert-review": "Expert Review & Record",
    "design-for-values": "Design for Values",
    "evaluation": "Evaluation Checklist",
  };
  const bc = document.getElementById("breadcrumb-current");
  if (bc) bc.textContent = labels[screenId] || screenId;

  STATE.currentScreen = screenId;
  if (target) target.focus({preventScroll: true});
  if (screenId === "case-overview" && typeof areaMap !== "undefined" && areaMap) requestAnimationFrame(() => areaMap.invalidateSize());

  // Close sidebar on mobile
  if (window.innerWidth <= 768) {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("hamburger").setAttribute("aria-expanded", "false");
  }

  // Lazy-render screens that need it
  if (screenId === "compare-pathways") renderCompareView();
  if (screenId === "design-for-values") renderValuesMatrix();
  if (screenId === "evaluation") renderEvaluationChecklist();
  if (typeof renderDemoScreen === "function") renderDemoScreen(screenId);
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger");
  const isOpen = sidebar.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

/* ═══════════════════════════════════════════════════════════
   SCREEN A: CASE OVERVIEW
═══════════════════════════════════════════════════════════ */

function renderCaseOverview() {
  const { caseOverview } = SCENARIO;

  // Evidence sources table
  const tableEl = document.getElementById("evidence-sources-table");
  if (tableEl) {
    const rows = caseOverview.evidenceSources
      .map(
        (src) => `
      <tr>
        <td><strong>${escapeHtml(src.label)}</strong></td>
        <td><span class="badge badge-neutral">${escapeHtml(src.type)}</span></td>
        <td>${escapeHtml(src.date)}</td>
        <td>
          <span class="badge ${src.confidence.toLowerCase().includes("very low") ? "badge-high"
            : src.confidence.toLowerCase().includes("low") ? "badge-moderate"
            : "badge-low"}">${escapeHtml(src.confidence)}</span>
        </td>
        <td style="font-size:0.8rem;color:var(--clr-text-muted);max-width:280px;">${escapeHtml(src.limitations)}</td>
        <td><span class="badge ${src.verified ? "badge-positive" : "badge-high"}">${src.verified ? "✓ Verified" : "⚠ Unverified"}</span></td>
      </tr>`
      )
      .join("");

    tableEl.innerHTML = `
      <div class="table-wrapper">
        <table aria-label="Evidence sources">
          <thead>
            <tr>
              <th>Source</th><th>Type</th><th>Date</th><th>Confidence</th><th>Key Limitations</th><th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  // Limitations list
  const limEl = document.getElementById("limitations-list");
  if (limEl) {
    limEl.innerHTML = caseOverview.keyLimitations
      .map(
        (l) => `
      <li style="display:flex;gap:8px;align-items:flex-start;padding:8px 12px;background:var(--clr-surface-2);border-radius:var(--r-sm);font-size:0.875rem;">
        <span style="color:var(--clr-yellow);flex-shrink:0;" aria-hidden="true">⚠</span>
        <span>${escapeHtml(l)}</span>
      </li>`
      )
      .join("");
  }

  // Draw habitat schematic map
  drawHabitatMap();
}

function drawHabitatMap() {
  const canvas = document.getElementById("habitat-map");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const W = canvas.width, H = canvas.height;

  // Background
  ctx.fillStyle = "#161b22";
  ctx.fillRect(0, 0, W, H);

  // Habitat zones (illustrative blobs)
  const zones = [
    { x: 0.05, y: 0.1, w: 0.35, h: 0.5, color: "#dc2626", alpha: 0.5, label: "High-severity burn" },
    { x: 0.28, y: 0.3, w: 0.3, h: 0.45, color: "#ea580c", alpha: 0.45, label: "Moderate burn" },
    { x: 0.55, y: 0.08, w: 0.4, h: 0.45, color: "#16a34a", alpha: 0.4, label: "Unburned woodland" },
    { x: 0.62, y: 0.5, w: 0.32, h: 0.38, color: "#15803d", alpha: 0.35, label: "Unburned shrubland" },
    { x: 0.15, y: 0.62, w: 0.5, h: 0.28, color: "#b45309", alpha: 0.3, label: "Low-severity burn" },
  ];

  zones.forEach((z) => {
    ctx.save();
    ctx.globalAlpha = z.alpha;
    ctx.fillStyle = z.color;
    // Rounded rectangle
    const rx = z.x * W, ry = z.y * H, rw = z.w * W, rh = z.h * H, rad = 12;
    ctx.beginPath();
    ctx.moveTo(rx + rad, ry);
    ctx.lineTo(rx + rw - rad, ry);
    ctx.arcTo(rx + rw, ry, rx + rw, ry + rad, rad);
    ctx.lineTo(rx + rw, ry + rh - rad);
    ctx.arcTo(rx + rw, ry + rh, rx + rw - rad, ry + rh, rad);
    ctx.lineTo(rx + rad, ry + rh);
    ctx.arcTo(rx, ry + rh, rx, ry + rh - rad, rad);
    ctx.lineTo(rx, ry + rad);
    ctx.arcTo(rx, ry, rx + rad, ry, rad);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  // Riparian corridor
  ctx.save();
  ctx.strokeStyle = "#0d9488";
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.6;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(0.1 * W, 0.75 * H);
  ctx.bezierCurveTo(0.3 * W, 0.65 * H, 0.5 * W, 0.8 * H, 0.9 * W, 0.7 * H);
  ctx.stroke();
  ctx.restore();

  // Species refugia markers (coarse — no precise GPS)
  const refugia = [
    { x: 0.62, y: 0.2, emoji: "🐾", label: "Hypothetical mammal refuge" },
    { x: 0.8, y: 0.6, emoji: "🦎", label: "Lizard refuge" },
    { x: 0.5, y: 0.72, emoji: "🐸", label: "Amphibian pool" },
    { x: 0.7, y: 0.3, emoji: "🦅", label: "Raptor nest zone" },
  ];

  refugia.forEach((r) => {
    ctx.save();
    ctx.font = "16px serif";
    ctx.fillText(r.emoji, r.x * W - 8, r.y * H + 6);
    ctx.restore();
  });

  // Legend
  const legend = [
    { color: "#dc2626", label: "High-severity" },
    { color: "#ea580c", label: "Moderate" },
    { color: "#b45309", label: "Low-severity" },
    { color: "#16a34a", label: "Unburned" },
    { color: "#0d9488", label: "Riparian" },
  ];

  let lx = 8, ly = H - 24;
  ctx.font = "bold 9px Inter, sans-serif";
  legend.forEach((l) => {
    ctx.fillStyle = l.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(lx, ly, 10, 10);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#8b949e";
    ctx.fillText(l.label, lx + 13, ly + 9);
    lx += 80;
  });

  // Title
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "bold 10px Inter, sans-serif";
  ctx.fillText("⚠️ SCHEMATIC ILLUSTRATION — NOT REAL GIS DATA", 8, 14);
}

/* ═══════════════════════════════════════════════════════════
   SCREEN B: WELFARE CONTEXT
═══════════════════════════════════════════════════════════ */

function renderWelfareContext() {
  const { focalSpecies } = SCENARIO;

  // Species tabs
  const tabsEl = document.getElementById("species-tabs");
  if (tabsEl) {
    tabsEl.innerHTML = focalSpecies
      .map(
        (sp, i) => `
      <button class="tab-btn ${i === STATE.activeSpeciesTab ? "active" : ""}"
              onclick="selectSpeciesTab(${i})"
              role="tab"
              aria-selected="${i === STATE.activeSpeciesTab}"
              aria-controls="welfare-detail-panel"
              id="sp-tab-${i}">
        ${sp.emoji} ${sp.commonName.split("/")[0].trim()}
      </button>`
      )
      .join("");
  }

  renderWelfareDetail(STATE.activeSpeciesTab);
}

function selectSpeciesTab(index) {
  STATE.activeSpeciesTab = index;
  document.querySelectorAll("#species-tabs .tab-btn").forEach((t, i) => {
    t.classList.toggle("active", i === index);
    t.setAttribute("aria-selected", i === index ? "true" : "false");
  });
  renderWelfareDetail(index);
}

function renderWelfareDetail(index) {
  const sp = SCENARIO.focalSpecies[index];
  if (!sp) return;
  const panel = document.getElementById("welfare-detail-panel");
  if (!panel) return;

  const domains = ["food", "water", "shelter", "breeding", "movement"];

  const welfareGrid = domains
    .map((d) => {
      const dw = sp.welfareContext[d];
      const statusClass = getStatusClass(dw.status);
      return `
    <div class="welfare-cell status-${statusClass}"
         onclick="openWelfareModal('${escapeHtml(sp.id)}', '${d}')"
         tabindex="0"
         role="button"
         aria-label="${domainLabel(d)}: ${dw.status} for ${sp.commonName}"
         onkeydown="if(event.key==='Enter'||event.key===' ')openWelfareModal('${escapeHtml(sp.id)}', '${d}')">
      <div class="welfare-cell-icon" aria-hidden="true">${getWelfareIcon(d)}</div>
      <div class="welfare-cell-label">${domainLabel(d)}</div>
      <div style="margin-top:4px;">${renderBadge(dw.status)}</div>
      <div style="margin-top:6px;font-size:0.65rem;color:var(--clr-text-faint);" aria-label="Evidence type: ${dw.evidenceType}">
        ${renderEvBadge(dw.evidenceType)}
      </div>
    </div>`;
    })
    .join("");

  // Summary worst concerns
  const highDomains = domains.filter((d) => sp.welfareContext[d].status.toUpperCase().includes("HIGH"));
  const gaps = domains.filter((d) => sp.welfareContext[d].knowledgeGap && sp.welfareContext[d].knowledgeGap !== "None identified");

  panel.innerHTML = `
    <div class="card fade-in">
      <div class="card-header">
        <span style="font-size:2.5rem;" aria-hidden="true">${sp.emoji}</span>
        <div>
          <div class="card-title" style="font-size:1.2rem;">${escapeHtml(sp.commonName)}</div>
          <div style="font-style:italic;font-size:0.8rem;color:var(--clr-text-muted);">${escapeHtml(sp.scientificName)}</div>
          <div style="margin-top:4px;display:flex;gap:6px;flex-wrap:wrap;">
            <span class="pill">${escapeHtml(sp.guild)}</span>
            <span class="pill">🔥 Sensitivity: ${escapeHtml(sp.sensitivityToFire)}</span>
            <span class="pill">🏃 Mobility: ${escapeHtml(sp.mobilityPotential)}</span>
          </div>
        </div>
        <div style="margin-left:auto;">
          <span class="badge badge-synthetic" aria-label="Conservation and legal status not inferred">${escapeHtml(sp.protectionStatus)}</span>
        </div>
      </div>

      ${highDomains.length > 0 ? `
      <div class="callout callout-danger" style="margin-bottom:16px;">
        <span class="callout-icon" aria-hidden="true">🚨</span>
        <div><strong>High concern domains:</strong> ${highDomains.map((d) => `<strong>${domainLabel(d)}</strong>`).join(", ")}
        — review detail by clicking each cell below.</div>
      </div>` : ""}

      <h3 style="font-size:0.875rem;font-weight:700;color:var(--clr-text-muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;">
        Welfare Domain Assessment
      </h3>
      <div class="welfare-grid" role="list" aria-label="Welfare domains for ${escapeHtml(sp.commonName)}">
        ${welfareGrid}
      </div>

      <div class="callout callout-info" style="margin-top:16px;">
        <span class="callout-icon" aria-hidden="true">🔍</span>
        <div>
          <strong>${gaps.length} knowledge gaps identified</strong> for this species.
          ${gaps.length > 0 ? `Domains with gaps: ${gaps.map((d) => `<em>${domainLabel(d)}</em>`).join(", ")}.` : ""}
          These gaps must NOT be interpreted as confirmation that impacts do not exist.
        </div>
      </div>

      <div style="margin-top:16px;">
        <div class="gap-flag">
          <span aria-hidden="true">⚠️</span>
          <span>${escapeHtml(sp.note)}</span>
        </div>
      </div>
    </div>`;
}

function renderBadge(status) {
  if (!status) return '<span class="badge badge-unknown">Unknown</span>';
  const s = status.toUpperCase();
  if (s.includes("HIGH")) return `<span class="badge badge-high">${escapeHtml(status)}</span>`;
  if (s.includes("MODERATE")) return `<span class="badge badge-moderate">${escapeHtml(status)}</span>`;
  if (s.includes("LOW")) return `<span class="badge badge-low">${escapeHtml(status)}</span>`;
  return `<span class="badge badge-unknown">${escapeHtml(status)}</span>`;
}

function renderEvBadge(type) {
  const cls = getEvidenceBadgeClass(type);
  return `<span class="badge ${cls}">${escapeHtml(type || "Unknown")}</span>`;
}

/* ═══════════════════════════════════════════════════════════
   WELFARE MODAL
═══════════════════════════════════════════════════════════ */

let modalReturnFocus;
function openWelfareModal(speciesId, domain) {
  modalReturnFocus = document.activeElement;
  activeWelfareModal={groupId:speciesId,domain};
  const sp = SCENARIO.focalSpecies.find((s) => s.id === speciesId);
  if (!sp) return;
  const dw = sp.welfareContext[domain];
  if (!dw) return;

  document.getElementById("modal-species-emoji").textContent = sp.emoji;
  document.getElementById("modal-title").textContent = `${sp.commonName} — ${domainLabel(domain)}`;
  document.getElementById("modal-subtitle").textContent = sp.scientificName;

  document.getElementById("modal-body").innerHTML = renderWelfareDetails(sp,domain,dw);

  const overlay = document.getElementById("welfare-modal");
  overlay.classList.add("open");
  overlay.querySelector(".modal-close").focus();
}

function closeWelfareModal() {
  const modal = document.getElementById("welfare-modal");
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open");
  activeWelfareModal=null;
  if (modalReturnFocus) modalReturnFocus.focus();
}

function closeModal(e) {
  if (e.target === document.getElementById("welfare-modal")) closeWelfareModal();
}

/* ═══════════════════════════════════════════════════════════
   SCREEN C: COMPARE PATHWAYS
═══════════════════════════════════════════════════════════ */

function setCompareView(view) {
  STATE.compareView = view;
  document.getElementById("view-side-btn").className = "btn btn-sm " + (view === "side-by-side" ? "btn-primary" : "btn-secondary");
  document.getElementById("view-stack-btn").className = "btn btn-sm " + (view === "stacked" ? "btn-primary" : "btn-secondary");
  document.getElementById("view-species-btn").className = "btn btn-sm " + (view === "species" ? "btn-primary" : "btn-secondary");
  renderCompareView();
}

function renderCompareView() {
  const container = document.getElementById("compare-container");
  if (!container) return;

  if (STATE.compareView === "side-by-side") {
    renderSideBySide(container);
  } else if (STATE.compareView === "stacked") {
    renderStacked(container);
  } else if (STATE.compareView === "species") {
    renderBySpecies(container);
    container.innerHTML += SCENARIO.recoveryPathways.map(renderPathwayValues).join("");
  }
}

function renderSideBySide(container) {
  const { recoveryPathways } = SCENARIO;

  const cards = recoveryPathways.map((opt) => {
    const benefitList = opt.potentialBenefits.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
    const harmList = opt.potentialHarms.map((h) => `<li class="harm-item">${escapeHtml(h)}</li>`).join("");
    const stakeRows = opt.affectedStakeholders
      .map((s) => `
        <tr>
          <td style="font-weight:500;">${escapeHtml(s.group)}</td>
          <td><span class="badge ${getStakeholderBadge(s.welfare)}">${escapeHtml(s.welfare)}</span></td>
          <td style="font-size:0.8rem;color:var(--clr-text-muted);">${escapeHtml(s.notes)}</td>
        </tr>`)
      .join("");

    const evidenceLevelClass = opt.evidence.strength.toLowerCase().startsWith("mod") ? "badge-moderate"
      : opt.evidence.strength.toLowerCase().startsWith("low") ? "badge-high"
      : "badge-low";

    const ethicsHtml = opt.ethicsFlags.map((f) => `
      <div class="callout callout-warning" style="margin-bottom:8px;">
        <span class="callout-icon" aria-hidden="true">⚖️</span>
        <div style="font-size:0.8rem;">${escapeHtml(f)}</div>
      </div>`).join("");

    const missingHtml = opt.missingStakeholders.map((m) => `
      <div class="gap-flag" style="margin-bottom:4px;">
        <span aria-hidden="true">🔍</span><span>${escapeHtml(m)}</span>
      </div>`).join("");

    const uncHtml = opt.evidence.keyUncertainties.map((u) => `
      <li style="font-size:0.8rem;color:var(--clr-text-muted);margin-bottom:4px;">› ${escapeHtml(u)}</li>`).join("");

    const fieldHtml = opt.fieldChecksNeeded.map((f) => `
      <li style="font-size:0.8rem;color:var(--clr-text-muted);margin-bottom:4px;">☐ ${escapeHtml(f)}</li>`).join("");

    return `
    <div class="option-card fade-in" style="border-color:${escapeHtml(opt.color)}33;">
      <div class="option-header" style="background:${escapeHtml(opt.color)}18;border-bottom:1px solid ${escapeHtml(opt.color)}33;">
        <div class="option-dot" style="background:${escapeHtml(opt.color)};" aria-hidden="true"></div>
        <div>
          <div style="font-weight:800;font-size:0.9rem;">${escapeHtml(opt.shortLabel)}</div>
          <div style="font-size:0.75rem;color:var(--clr-text-muted);">${escapeHtml(opt.name)}</div>
        </div>
      </div>
      <div class="option-body">
        <p style="font-size:0.8rem;color:var(--clr-text-muted);line-height:1.6;margin-bottom:12px;">${escapeHtml(opt.description)}</p>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
          <span class="pill">⏱ ${escapeHtml(opt.timeframe)}</span>
          <span class="pill">💰 ${escapeHtml(opt.cost)}</span>
          <span class="pill">🔧 ${escapeHtml(opt.managementIntensity)} intensity</span>
        </div>

        <div class="callout callout-warning"><div><strong>When inappropriate:</strong> ${escapeHtml(opt.inappropriate)}<br><strong>Review:</strong> ${escapeHtml(opt.reviewRequired)}</div></div>
        <!-- Benefits -->
        <details open>
          <summary style="cursor:pointer;font-size:0.8rem;font-weight:700;color:var(--clr-green);margin-bottom:8px;list-style:none;">
            ✅ Potential Benefits (${opt.potentialBenefits.length})
          </summary>
          <ul class="section-list" style="margin-bottom:12px;">${benefitList}</ul>
        </details>

        <!-- Harms -->
        <details open>
          <summary style="cursor:pointer;font-size:0.8rem;font-weight:700;color:var(--clr-yellow);margin-bottom:8px;list-style:none;">
            ⚠️ Potential Harms (${opt.potentialHarms.length})
          </summary>
          <ul class="section-list" style="margin-bottom:12px;">${harmList}</ul>
        </details>

        <!-- Stakeholders -->
        <details>
          <summary style="cursor:pointer;font-size:0.8rem;font-weight:700;color:var(--clr-text-muted);margin-bottom:8px;list-style:none;">
            👥 Affected Stakeholders (${opt.affectedStakeholders.length})
          </summary>
          <div class="table-wrapper" style="margin-bottom:12px;">
            <table aria-label="Stakeholder welfare impacts for ${escapeHtml(opt.shortLabel)}">
              <thead><tr><th>Group</th><th>Welfare</th><th>Notes</th></tr></thead>
              <tbody>${stakeRows}</tbody>
            </table>
          </div>
        </details>

        <!-- Missing stakeholders -->
        <details>
          <summary style="cursor:pointer;font-size:0.8rem;font-weight:700;color:#c084fc;margin-bottom:8px;list-style:none;">
            🔍 Missing / Underrepresented (${opt.missingStakeholders.length})
          </summary>
          <div style="margin-bottom:12px;">${missingHtml}</div>
        </details>

        <!-- Evidence & Uncertainty -->
        <hr class="divider">
        <div style="margin-bottom:12px;">
          <div style="font-size:0.75rem;font-weight:600;color:var(--clr-text-faint);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Evidence Strength</div>
          <span class="badge ${evidenceLevelClass}">${escapeHtml(opt.evidence.strength)}</span>
          <p style="font-size:0.75rem;color:var(--clr-text-muted);margin-top:6px;">Sources: ${opt.evidence.sources.join(", ")}</p>
        </div>

        <details>
          <summary style="cursor:pointer;font-size:0.8rem;font-weight:700;color:var(--clr-text-muted);margin-bottom:8px;list-style:none;">
            🎯 Key Uncertainties
          </summary>
          <ul style="list-style:none;margin-bottom:12px;">${uncHtml}</ul>
        </details>

        <details>
          <summary style="cursor:pointer;font-size:0.8rem;font-weight:700;color:var(--clr-text-muted);margin-bottom:8px;list-style:none;">
            🔬 Field Checks Needed
          </summary>
          <ul style="list-style:none;margin-bottom:12px;">${fieldHtml}</ul>
        </details>

        ${renderPathwayValues(opt)}
        <!-- Ethics flags -->
        <hr class="divider">
        <div style="font-size:0.75rem;font-weight:600;color:var(--clr-text-faint);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">⚖️ Ethics Flags</div>
        ${ethicsHtml}
      </div>
    </div>`;
  }).join("");

  container.innerHTML = `
    <div class="comparison-grid" role="region" aria-label="Side-by-side pathway comparison">
      ${cards}
    </div>`;
}

function renderStacked(container) {
  const { recoveryPathways } = SCENARIO;

  const rows = recoveryPathways.map((opt) => `
    <div class="card fade-in" style="border-left:4px solid ${escapeHtml(opt.color)};margin-bottom:16px;">
      <div class="card-header">
        <div class="option-dot" style="background:${escapeHtml(opt.color)};width:16px;height:16px;border-radius:50%;" aria-hidden="true"></div>
        <div>
          <div class="card-title">${escapeHtml(opt.name)}</div>
          <div class="card-subtitle">${escapeHtml(opt.timeframe)} · ${escapeHtml(opt.cost)} · ${escapeHtml(opt.managementIntensity)} intensity</div>
        </div>
      </div>
      ${renderPathwayValues(opt)}
      <p style="font-size:0.875rem;line-height:1.7;color:var(--clr-text-muted);">${escapeHtml(opt.description)}</p><p>${escapeHtml(opt.inappropriate)} ${escapeHtml(opt.reviewRequired)}</p>
      <div style="display:flex;gap:16px;margin-top:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-size:0.75rem;font-weight:700;color:var(--clr-green);margin-bottom:6px;">✅ Benefits</div>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:4px;">
            ${opt.potentialBenefits.map((b) => `<li style="font-size:0.8rem;">› ${escapeHtml(b)}</li>`).join("")}
          </ul>
        </div>
        <div style="flex:1;min-width:200px;">
          <div style="font-size:0.75rem;font-weight:700;color:var(--clr-yellow);margin-bottom:6px;">⚠️ Harms</div>
          <ul style="list-style:none;display:flex;flex-direction:column;gap:4px;">
            ${opt.potentialHarms.map((h) => `<li style="font-size:0.8rem;">⚠ ${escapeHtml(h)}</li>`).join("")}
          </ul>
        </div>
      </div>
      <div style="margin-top:12px;">
        ${opt.ethicsFlags.map((f) => `<div class="callout callout-warning" style="margin-bottom:4px;padding:8px 12px;"><span aria-hidden="true">⚖️</span> <span style="font-size:0.8rem;">${escapeHtml(f)}</span></div>`).join("")}
      </div>
    </div>`).join("");

  container.innerHTML = `<div role="region" aria-label="Stacked pathway comparison">${rows}</div>`;
}

function renderBySpecies(container) {
  const { focalSpecies, recoveryPathways } = SCENARIO;

  const rows = focalSpecies.map((sp) => {
    const cells = recoveryPathways.map((opt) => {
      const sh = opt.affectedStakeholders.find(
        (s) => s.group.toLowerCase().includes(sp.commonName.split("/")[0].trim().toLowerCase()) ||
               s.group.toLowerCase().includes(sp.guild.split("—")[0].trim().toLowerCase().split(" ")[0])
      );
      const welfare = sh ? sh.welfare : "Not explicitly addressed";
      const notes = sh ? sh.notes : "This species/group is not explicitly included in stakeholder analysis for this option.";
      const badgeClass = sh ? getStakeholderBadge(sh.welfare) : "badge-high";
      return `
        <td style="vertical-align:top;padding:12px 16px;border-bottom:1px solid var(--clr-border-faint);">
          <div style="display:flex;gap:4px;margin-bottom:4px;flex-wrap:wrap;">
            <div style="width:10px;height:10px;border-radius:50%;background:${escapeHtml(opt.color)};display:inline-block;margin-top:2px;" aria-hidden="true"></div>
            <span class="badge ${badgeClass}" style="font-size:0.65rem;">${escapeHtml(welfare)}</span>
          </div>
          <div style="font-size:0.75rem;color:var(--clr-text-muted);">${escapeHtml(notes)}</div>
        </td>`;
    }).join("");

    return `
      <tr>
        <td style="padding:12px 16px;font-weight:600;white-space:nowrap;border-bottom:1px solid var(--clr-border-faint);background:var(--clr-surface-2);">
          <span aria-hidden="true">${sp.emoji}</span> ${escapeHtml(sp.commonName)}
        </td>
        ${cells}
      </tr>`;
  }).join("");

  const headers = recoveryPathways.map((opt) => `
    <th style="padding:12px 16px;">
      <div style="display:flex;align-items:center;gap:6px;">
        <div style="width:10px;height:10px;border-radius:50%;background:${escapeHtml(opt.color)};" aria-hidden="true"></div>
        ${escapeHtml(opt.shortLabel)}
      </div>
    </th>`).join("");

  container.innerHTML = `
    <div role="region" aria-label="Per-species welfare comparison across pathways">
      <p style="font-size:0.85rem;color:var(--clr-text-muted);margin-bottom:16px;">
        This view shows per-species welfare projections across all three options.
        <strong>Welfare impacts are not aggregated into a single score</strong> — each species must be reviewed individually.
        Absence of explicit mention in a stakeholder list is itself a red flag.
      </p>
      <div class="table-wrapper">
        <table aria-label="Species welfare by pathway">
          <thead>
            <tr>
              <th style="padding:12px 16px;">Species / Group</th>
              ${headers}
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════
   SCREEN D: EXPERT REVIEW
═══════════════════════════════════════════════════════════ */

function renderExpertReview() {
  const form = document.getElementById("expert-review-form");
  if (!form) return;

  const optionOptions = ["(not yet decided)", ...SCENARIO.recoveryPathways.map((o) => o.shortLabel + " — " + o.name)];

  form.innerHTML = `
    <div class="grid-2" style="gap:16px;margin-bottom:16px;">
      <!-- Reviewer info -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon" style="background:rgba(249,115,22,0.15);" aria-hidden="true">🧑‍💼</div>
          <div>
            <div class="card-title">Reviewer Information</div>
            <div class="card-subtitle">Required for decision record</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="reviewer-name">Reviewer name / role</label>
          <input type="text" id="reviewer-name" placeholder="e.g. Dr. J. García, Ecologist"
                 value="${escapeHtml(STATE.expertRecord.reviewer)}"
                 oninput="STATE.expertRecord.reviewer=this.value" />
        </div>
        <div class="form-group">
          <label class="form-label" for="review-date">Date of review</label>
          <input type="date" id="review-date"
                 value="${escapeHtml(STATE.expertRecord.date)}"
                 oninput="STATE.expertRecord.date=this.value" />
        </div>
        <div class="form-group">
          <label class="form-label" for="preferred-option">Preferred option (after review)</label>
          <select id="preferred-option" onchange="STATE.expertRecord.preferredOption=this.value" aria-label="Select preferred recovery option">
            ${optionOptions.map((o, i) => `<option value="${escapeHtml(o)}" ${STATE.expertRecord.preferredOption === o ? "selected" : ""}>${escapeHtml(o)}</option>`).join("")}
          </select>
        </div>
      </div>

      ${renderReviewControls()}
      <!-- Decision rationale -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon" style="background:rgba(22,163,74,0.15);" aria-hidden="true">📋</div>
          <div>
            <div class="card-title">Decision Rationale</div>
            <div class="card-subtitle">Human decision basis — mandatory for record</div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="decision-rationale">
            Which human and animal interests conflict, and why is this decision justified?
            <span style="color:var(--clr-text-faint);font-weight:400;"> (Be specific — animal welfare, evidence, feasibility, etc.)</span>
          </label>
          <textarea id="decision-rationale" rows="6"
                    placeholder="Record human objectives, animal interests, less harmful alternatives, missing evidence, safeguards and monitoring. If animal interests are outweighed, explain necessity and proportionality. A modest welfare priority guides closely balanced choices; human safety and essential needs still matter. You may defer when evidence is insufficient and it is safe to wait."
                    oninput="STATE.expertRecord.rationale=this.value">${escapeHtml(STATE.expertRecord.rationale)}</textarea>
        </div>
      </div>
    </div>

    <!-- Challenge / override -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <div class="card-icon" style="background:rgba(220,38,38,0.15);" aria-hidden="true">🚩</div>
        <div>
          <div class="card-title">Challenge / Override Tool Assessments</div>
          <div class="card-subtitle">Record any disagreements with the tool's welfare assessments or option analysis</div>
        </div>
      </div>
      <div class="callout callout-info" style="margin-bottom:16px;">
        <span class="callout-icon" aria-hidden="true">ℹ️</span>
        <div style="font-size:0.8rem;">
          This tool is a decision-support prototype, not an authority. If your expert judgement or field knowledge
          contradicts an assessment, record it here. Overrides are part of the audit trail.
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="challenged-items">Challenged assessments</label>
        <textarea id="challenged-items" rows="4"
                  placeholder="Identify an individual assumption, explain your objection, and record what evidence could resolve it."
                  oninput="STATE.expertRecord.challengedItems=this.value">${escapeHtml(STATE.expertRecord.challengedItems)}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label" for="override-assessments">Overridden assessments (specify original → your override)</label>
        <textarea id="override-assessments" rows="3"
                  placeholder="e.g. 'Amphibians / Breeding / UNKNOWN → needs seasonal field survey'"
                  oninput="STATE.expertRecord.overriddenAssessments=this.value">${escapeHtml(STATE.expertRecord.overriddenAssessments)}</textarea>
      </div>
    </div>

    <!-- Unresolved risks -->
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <div class="card-icon" style="background:rgba(202,138,4,0.15);" aria-hidden="true">⚠️</div>
        <div>
          <div class="card-title">Unresolved Risks</div>
          <div class="card-subtitle">Risks that cannot be resolved with current information</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="unresolved-risks">List unresolved risks that must be addressed before implementation:</label>
        <textarea id="unresolved-risks" rows="4"
                  placeholder="Record missing surveys, water-quality concerns, disturbance risks and consultation needs that must be resolved before action."
                  oninput="STATE.expertRecord.unresolvedRisks=this.value">${escapeHtml(STATE.expertRecord.unresolvedRisks)}</textarea>
      </div>
    </div>

    <!-- Additional notes -->
    <div class="card" style="margin-bottom:24px;">
      <div class="card-header">
        <div class="card-icon" style="background:rgba(147,51,234,0.15);" aria-hidden="true">📝</div>
        <div>
          <div class="card-title">Additional Notes</div>
          <div class="card-subtitle">Any other observations or context</div>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label" for="additional-notes">Additional context, caveats or next steps:</label>
        <textarea id="additional-notes" rows="4"
                  placeholder="e.g. 'This review was conducted under time pressure — a full multi-expert review panel is recommended before implementation. This tool prototype has not been validated.'"
                  oninput="STATE.expertRecord.additionalNotes=this.value">${escapeHtml(STATE.expertRecord.additionalNotes)}</textarea>
      </div>
    </div>

    <div class="card form-group">
      <label class="form-label" for="supporting-evidence">Supporting evidence (source, date, limitations; reasons for rejecting alternatives)</label>
      <textarea id="supporting-evidence" rows="4" oninput="STATE.expertRecord.supportingEvidence=this.value">${escapeHtml(STATE.expertRecord.supportingEvidence)}</textarea>
    </div>
    <!-- Sign-off and export -->
    <div class="decision-box">
      <h3 style="margin-bottom:12px;">Human review · local prototype record</h3>
      <div class="callout callout-danger" style="margin-bottom:16px;">
        <span class="callout-icon" aria-hidden="true">⚠️</span>
        <div style="font-size:0.8rem;">
          When saving this prototype assessment, record that: (1) you have reviewed the tool's assessments critically;
          (2) you take responsibility for the decision rationale recorded above;
          (3) you understand this is a <strong>prototype with mixed evidence and unvalidated hypotheses</strong> and
          the tool has NOT been validated for this or any use case;
          (4) management instructions will NOT be issued automatically from this record.
        </div>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <button class="btn btn-primary" onclick="saveExpertRecord()" aria-label="Save expert decision record">
          💾 Save locally
        </button>
        <button class="btn btn-secondary" onclick="exportRecord()" aria-label="Export decision record as JSON file">
          ⬇ Export as JSON
        </button>
        <button class="btn btn-secondary" onclick="viewSummary()">View restoration summary</button>
        <button class="btn btn-danger" onclick="clearRecord()" aria-label="Clear all entered review data">
          🗑 Clear Record
        </button>
        <div id="save-status" style="font-size:0.8rem;color:var(--clr-text-muted);" aria-live="polite"></div>
      </div>
    </div>`;
}

function saveExpertRecord() {
  persistLocalRecord();
}

function clearRecord() {
  if (!confirm("Clear all review data? This cannot be undone.")) return;
  STATE.expertRecord = {
    evidenceVersion: "", supportingEvidence: "", reviewer: "", date: new Date().toISOString().split("T")[0],
    preferredOption: "", rationale: "", challengedItems: "",
    unresolvedRisks: "", additionalNotes: "", overriddenAssessments: "",
    reviewStatus: "draft",
    approvalConfirmed: false,
    signedOff: false, savedAt: null,
    humanNeedCategory: "unknown", humanNeed: "", animalSafeguards: "",
  };
  try { localStorage.removeItem(RECORD_KEY); } catch {}
  renderExpertReview();
}

/* ═══════════════════════════════════════════════════════════
   SCREEN E: DESIGN FOR VALUES
═══════════════════════════════════════════════════════════ */


function renderEvaluationChecklist() {
  const el = document.getElementById("eval-checklist");
  if (!el) return;

  const categories = [...new Set(SCENARIO.evaluationChecklist.map((c) => c.category))];

  const categoryHtml = categories.map((cat) => {
    const items = SCENARIO.evaluationChecklist.filter((c) => c.category === cat);
    const itemHtml = items.map((item) => {
      const override = STATE.checklistOverrides[item.id];
      const isPass = override !== undefined ? override : item.passed;
      return `
        <div class="check-item ${isPass ? "" : "check-fail"}">
          <span class="check-icon" aria-hidden="true">${isPass ? "✅" : "❌"}</span>
          <div class="check-text">
            <div class="check-label">${escapeHtml(item.item)}</div>
            <div class="check-note">${escapeHtml(item.notes)}</div>
          </div>
          <button class="btn btn-ghost btn-sm"
                  onclick="toggleChecklistItem('${escapeHtml(item.id)}', ${isPass})"
                  aria-label="${isPass ? "Mark as failed" : "Mark as passed"}: ${escapeHtml(item.item)}"
                  style="flex-shrink:0;margin-left:8px;">
            ${isPass ? "Mark ❌" : "Mark ✅"}
          </button>
        </div>`;
    }).join("");

    const passCount = items.filter((i) => (STATE.checklistOverrides[i.id] !== undefined ? STATE.checklistOverrides[i.id] : i.passed)).length;

    return `
      <div style="margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <h3 style="font-size:0.95rem;">${escapeHtml(cat)}</h3>
          <span class="badge ${passCount === items.length ? "badge-positive" : "badge-moderate"}">
            ${passCount}/${items.length} passed
          </span>
        </div>
        <div class="checklist">${itemHtml}</div>
      </div>`;
  }).join("");

  const total = SCENARIO.evaluationChecklist.length;
  const passed = SCENARIO.evaluationChecklist.filter((i) =>
    STATE.checklistOverrides[i.id] !== undefined ? STATE.checklistOverrides[i.id] : i.passed
  ).length;

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;flex-wrap:wrap;">
        <div>
          <div class="stat-value">${passed}/${total}</div>
          <div class="stat-label">Items passed</div>
        </div>
        <div style="flex:1;">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${(passed/total*100).toFixed(0)}%;background:${passed===total ? 'var(--clr-green)' : 'var(--clr-yellow)'};"
                 role="progressbar" aria-valuenow="${passed}" aria-valuemin="0" aria-valuemax="${total}"
                 aria-label="${passed} of ${total} checklist items passed"></div>
          </div>
          <div style="font-size:0.75rem;color:var(--clr-text-faint);margin-top:4px;">
            Note: "Passed" here means the prototype satisfies the criterion in its current state.
            It does NOT mean the tool has been externally validated.
          </div>
        </div>
      </div>
      ${categoryHtml}
    </div>`;
}

function toggleChecklistItem(id, currentPass) {
  STATE.checklistOverrides[id] = !currentPass;
  renderEvaluationChecklist();
}

function saveChecklistNotes(event) {
  STATE.checklistReviewerNotes = document.getElementById("reviewer-checklist-notes")?.value || "";
  const btn = event.target;
  const orig = btn.textContent;
  btn.textContent = "✓ Saved";
  btn.disabled = true;
  setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
}

/* ═══════════════════════════════════════════════════════════
   EXPORT
═══════════════════════════════════════════════════════════ */

function exportRecord() {
  const record = {
    exportedAt: new Date().toISOString(),
    toolVersion: "4.0-prototype",
    liveEvidenceAndAI: liveReport(exportConsent().review),
    recordStatus: "Local prototype draft; no verified sign-off or authority approval",
    geography: STUDY_AREA,
    evidenceSources: SCENARIO.caseOverview.evidenceSources,
    restorationAlternatives: SCENARIO.recoveryPathways,
    restorationSummary: restorationSummary(exportConsent().review,exportConsent().notes),
    dataStatus: "MIXED — real source records, derived outputs when available, unvalidated hypotheses",
    scenario: {
      id: SCENARIO.meta.id,
      label: SCENARIO.meta.label,
      disclaimer: SCENARIO.meta.disclaimer,
    },
    expertReview: exportReview(),
    checklistOverrides: STATE.checklistOverrides,
    checklistReviewerNotes: exportConsent().notes ? STATE.checklistReviewerNotes : 'Withheld by export privacy settings',
    warning: "This export is from a prototype tool with mixed evidence and unvalidated hypotheses. It has not been independently validated. Do NOT use for real management decisions.",
  };

  const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wildfire-recovery-decision-record-" + new Date().toISOString().split("T")[0] + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ═══════════════════════════════════════════════════════════
   KEYBOARD NAVIGATION
═══════════════════════════════════════════════════════════ */

document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("welfare-modal");
  if (e.key === "Tab" && modal.classList.contains("open")) {
    e.preventDefault();
    modal.querySelector(".modal-close").focus();
  }
  // Escape closes modal
  if (e.key === "Escape") closeWelfareModal();
});

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */

function init() {
  restoreLocalRecord();
  // Render case overview (loaded on start)
  renderCaseOverview();
  // Render welfare context (pre-render)
  renderWelfareContext();
  // Render expert review
  renderExpertReview();
  // Show default screen
  showScreen("case-overview");

  // Accessibility: announce page to screen readers
  document.title = `Animal-Centred Wildfire Recovery DST — ${SCENARIO.meta.label}`;
}

// Boot
document.addEventListener("DOMContentLoaded", init);
