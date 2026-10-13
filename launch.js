
"use strict";

/*
 AUDIT DETECTIVE — FYP LAUNCH CONTROL
 Standalone enhancement.

 Does not modify case answers, XP calculations,
 Story Mode, or Final Boss.
*/

(() => {
  const $ = id => document.getElementById(id);

  const menu = $("welcome-screen");
  const dashboard = $("ad-dashboard");

  if (!menu || !dashboard) {
    console.warn("Launch Control: Main menu not found.");
    return;
  }

  const PROGRESS_KEY = "auditDetectiveProgress";
  const PROFILE_KEY = "auditDetectivePlayerProfile";

  function getProgress() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROGRESS_KEY)
      );

      const ids = Array.isArray(data?.completed)
        ? data.completed
        : [];

      return new Set(
        ids.filter(id =>
          Number.isInteger(id) && id >= 1 && id <= 10
        )
      );
    } catch {
      return new Set();
    }
  }

  function getName() {
    try {
      const profile = JSON.parse(
        localStorage.getItem(PROFILE_KEY)
      );

      if (
        typeof profile?.name === "string" &&
        profile.name.trim()
      ) {
        return profile.name.trim().slice(0, 24);
      }
    } catch {
      // Continue with default.
    }

    return "Detective";
  }

  const panel = document.createElement("section");
  panel.id = "launch-control";

  panel.innerHTML = `
    <div class="launch-kicker">
      ◈ FINANCIAL INVESTIGATION DIVISION
    </div>

    <h2 class="launch-title">
      FYP MISSION CONTROL
    </h2>

    <p id="launch-welcome" class="launch-desc"></p>

    <div class="launch-stats">
      <div class="launch-stat">
        <span id="launch-cases"
          class="launch-value">0/10</span>
        <span class="launch-label">
          CASES SOLVED
        </span>
      </div>

      <div class="launch-stat">
        <span id="launch-xp"
          class="launch-value">0</span>
        <span class="launch-label">
          TOTAL XP
        </span>
      </div>

      <div class="launch-stat">
        <span id="launch-status"
          class="launch-value">ACTIVE</span>
        <span class="launch-label">
          INVESTIGATION STATUS
        </span>
      </div>
    </div>

    <div class="launch-progress"
      role="progressbar"
      aria-label="Investigation completion"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="0"
      id="launch-progress-track">
      <div id="launch-progress-fill"
        class="launch-progress-fill"></div>
    </div>

    <p id="launch-progress-text"
      class="launch-desc"></p>

    <div class="launch-actions">
      <button id="launch-refresh"
        class="launch-btn secondary"
        type="button">
        ↻ REFRESH STATUS
      </button>

      <button id="launch-check"
        class="launch-btn"
        type="button">
        ✓ RUN LAUNCH CHECK
      </button>

      <button id="launch-reset"
        class="launch-btn danger"
        type="button">
        ↺ RESET DEMO PROGRESS
      </button>
    </div>

    <div id="launch-checks"
      class="launch-checks"
      hidden
      aria-live="polite"></div>

    <p class="launch-note">
      Demo reset clears completed case progress on
      this browser only. Your detective name and
      display settings are preserved.
    </p>
  `;

  dashboard.insertAdjacentElement("afterend", panel);

  function refresh() {
    const completed = getProgress();
    const count = completed.size;
    const percent = count * 10;

    $("launch-welcome").textContent =
      "Welcome, Detective " + getName() +
      ". Review your investigation status before the showcase.";

    $("launch-cases").textContent = count + "/10";
    $("launch-xp").textContent =
      (count * 100).toLocaleString("en-MY");

    $("launch-status").textContent =
      count === 10 ? "CLEARED" : "ACTIVE";

    $("launch-progress-fill").style.width =
      percent + "%";

    $("launch-progress-track").setAttribute(
      "aria-valuenow",
      String(percent)
    );

    $("launch-progress-text").textContent =
      count === 10
        ? "All 10 case files completed. Final audit cleared."
        : (10 - count) +
          " case file(s) remaining before full completion.";
  }

  function addCheck(container, ok, message) {
    const row = document.createElement("div");
    row.className = "launch-check-row";

    const indicator = document.createElement("strong");
    indicator.className = ok
      ? "launch-good"
      : "launch-warn";

    indicator.textContent = ok ? "✓ PASS — " : "⚠ CHECK — ";

    row.append(
      indicator,
      document.createTextNode(message)
    );

    container.appendChild(row);
  }

  async function runChecks() {
    const box = $("launch-checks");
    box.hidden = false;
    box.textContent = "Checking game files...";

    const results = [];

    results.push({
      ok: Boolean($("welcome-screen")),
      message: "Main menu exists"
    });

    results.push({
      ok: Boolean($("p3-launch")),
      message: "Detective login screen exists"
    });

    results.push({
      ok: Boolean($("story-hub")),
      message: "Story Mode is loaded"
    });

    results.push({
      ok: Boolean($("s2-board")),
      message: "Evidence Board is loaded"
    });

    results.push({
      ok: Boolean($("s2-ending")),
      message: "Cinematic Ending is loaded"
    });

    results.push({
      ok: location.protocol === "https:",
      message: location.protocol === "https:"
        ? "Website uses HTTPS"
        : "Local testing mode detected. HTTPS will be available after GitHub Pages deployment."
    });

    // Check file availability only when served over HTTP(S).
    // file:// browsers may block fetch even when files exist.
    if (
      location.protocol === "http:" ||
      location.protocol === "https:"
    ) {
      const requiredFiles = [
        "style.css",
        "script.js",
        "polish.css",
        "polish.js",
        "polish2.css",
        "polish2.js",
        "polish3.css",
        "polish3.js",
        "greeting.js",
        "story.css",
        "story.js",
        "story2.css",
        "story2.js",
        "launch.css",
        "launch.js"
      ];

      for (const filename of requiredFiles) {
        try {
          const url = new URL(
            filename,
            document.baseURI
          );

          const response = await fetch(url, {
            method: "GET",
            cache: "no-store"
          });

          results.push({
            ok: response.ok,
            message: filename +
              (response.ok
                ? " is accessible"
                : " returned HTTP " + response.status)
          });
        } catch {
          results.push({
            ok: false,
            message: filename +
              " could not be loaded"
          });
        }
      }
    }

    box.textContent = "";

    results.forEach(item => {
      addCheck(box, item.ok, item.message);
    });

    const passed = results.filter(
      item => item.ok
    ).length;

    const summary = document.createElement("p");
    summary.className = "launch-desc";
    summary.textContent =
      passed + "/" + results.length +
      " launch checks passed.";

    box.prepend(summary);
  }

  function resetDemo() {
    const firstConfirmation = confirm(
      "RESET DEMO PROGRESS?\n\n" +
      "This will clear completed case progress " +
      "and XP on this browser.\n\n" +
      "Your detective name will remain saved."
    );

    if (!firstConfirmation) return;

    const secondConfirmation = confirm(
      "FINAL CONFIRMATION\n\n" +
      "Reset all 10 case completions and " +
      "restart the game?\n\n" +
      "This cannot be undone automatically."
    );

    if (!secondConfirmation) return;

    try {
      localStorage.removeItem(PROGRESS_KEY);
      location.reload();
    } catch {
      alert(
        "Unable to reset browser storage. " +
        "Please check your browser settings."
      );
    }
  }

  $("launch-refresh").addEventListener(
    "click",
    refresh
  );

  $("launch-check").addEventListener(
    "click",
    runChecks
  );

  $("launch-reset").addEventListener(
    "click",
    resetDemo
  );

  window.addEventListener("storage", event => {
    if (
      event.key === PROGRESS_KEY ||
      event.key === PROFILE_KEY
    ) {
      refresh();
    }
  });

  document.addEventListener("click", event => {
    if (
      event.target instanceof Element &&
      event.target.closest(
        "#story-open, #story-close, " +
        "#story-next, #s2-ending-next"
      )
    ) {
      refresh();
    }
  });

  window.addEventListener("pageshow", refresh);

  refresh();

  console.log("FYP Mission Control ready.");
})();
