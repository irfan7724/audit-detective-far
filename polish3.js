
"use strict";

/*
 AUDIT DETECTIVE — FAR EDITION
 ULTIMATE POLISH PART 3
 FINAL FYP LAUNCH EDITION

 Load after polish2.js.
*/

(() => {
  const $ = id => document.getElementById(id);

  const PROFILE_KEY = "auditDetectivePlayerProfile";
  const PROGRESS_KEY = "auditDetectiveProgress";

  const menu = $("welcome-screen");
  const dashboard = $("ad-dashboard");

  if (!menu || !dashboard) {
    console.error(
      "Part 3 requires the existing game and Part 1 dashboard."
    );
    return;
  }

  function readProfile() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROFILE_KEY)
      );

      return {
        name:
          typeof data?.name === "string"
            ? data.name.slice(0, 24)
            : ""
      };
    } catch {
      return { name: "" };
    }
  }

  function readCompleted() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROGRESS_KEY)
      );

      return new Set(
        Array.isArray(data?.completed)
          ? data.completed.filter(
              id =>
                Number.isInteger(id) &&
                id >= 1 &&
                id <= 10
            )
          : []
      );
    } catch {
      return new Set();
    }
  }

  function rank(count) {
    if (count >= 10) return "Legendary Audit Detective";
    if (count >= 9) return "Supreme Financial Detective";
    if (count >= 8) return "Elite Audit Detective";
    if (count >= 7) return "Expert Audit Detective";
    if (count >= 6) return "Chief Audit Detective";
    if (count >= 5) return "Master Financial Detective";
    if (count >= 4) return "Elite Financial Detective";
    if (count >= 3) return "Senior Financial Detective";
    if (count >= 2) return "Financial Investigator";
    return "Junior Detective";
  }

  // ====================================
  // CINEMATIC START SCREEN
  // ====================================

  const launch = document.createElement("div");
  launch.id = "p3-launch";
  launch.setAttribute("role", "dialog");
  launch.setAttribute("aria-modal", "true");
  launch.setAttribute(
    "aria-label",
    "Audit Detective start screen"
  );

  launch.innerHTML = `
    <div class="p3-launch-inner">
      <div class="p3-launch-tag">
        FINANCIAL INVESTIGATION DIVISION
      </div>

      <div class="p3-launch-emblem">🕵️</div>

      <h1 class="p3-launch-title">
        AUDIT<br><span>DETECTIVE</span>
      </h1>

      <div class="p3-launch-subtitle">
        FAR EDITION
      </div>

      <p class="p3-launch-description">
        Enter the world of financial investigations.
        Examine evidence, solve accounting mysteries,
        detect financial misstatements and rise
        through the detective ranks.
      </p>

      <div class="p3-launch-stats">
        <div class="p3-launch-stat">
          <strong>10</strong>
          <small>CASES</small>
        </div>
        <div class="p3-launch-stat">
          <strong>1,000</strong>
          <small>MAX XP</small>
        </div>
        <div class="p3-launch-stat">
          <strong>FAR</strong>
          <small>ACCOUNTING</small>
        </div>
      </div>

      <div class="p3-profile-box">
        <label for="p3-name">
          DETECTIVE NAME / CODENAME
        </label>

        <input
          id="p3-name"
          class="p3-name-input"
          type="text"
          maxlength="24"
          autocomplete="nickname"
          placeholder="Enter your detective name"
        >

        <p class="p3-profile-hint">
          Your codename is stored in this browser.
          You may use a nickname instead of your real name.
        </p>

        <div id="p3-name-error"
          class="p3-launch-error"
          role="alert"></div>
      </div>

      <button id="p3-enter" class="p3-primary">
        ▶ ENTER INVESTIGATION HQ
      </button>

      <p class="p3-small-note">
        Educational game · Financial Accounting
        and Reporting · FYP Project
      </p>
    </div>
  `;

  document.body.appendChild(launch);

  const existingProfile = readProfile();

  if (existingProfile.name) {
    $("p3-name").value = existingProfile.name;
    $("p3-enter").textContent =
      "▶ CONTINUE AS " +
      existingProfile.name.toUpperCase();
  }

  function saveName() {
    const name = $("p3-name").value.trim();

    if (!name) {
      $("p3-name-error").textContent =
        "Please enter a detective name to continue.";
      $("p3-name").focus();
      return false;
    }

    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ name })
      );
    } catch (error) {
      console.warn(
        "Profile could not be saved permanently.",
        error
      );
    }

    $("p3-name-error").textContent = "";
    updateProfile();
    return true;
  }

  function enterGame() {
    if (!saveName()) return;

    launch.hidden = true;
    document.body.style.overflow = "";

    // Return to the main menu, without changing
    // existing case progress or game logic.
    document.querySelectorAll(
      ".game-container > section"
    ).forEach(section => {
      section.hidden = true;
    });

    menu.hidden = false;

    window.scrollTo(0, 0);
  }

  $("p3-enter").addEventListener("click", enterGame);

  $("p3-name").addEventListener("keydown", event => {
    if (event.key === "Enter") {
      enterGame();
    }
  });

  // ====================================
  // MAIN MENU PROFILE TOOLS
  // ====================================

  const toolbar = document.createElement("div");
  toolbar.className = "p3-toolbar";

  toolbar.innerHTML = `
    <button id="p3-profile-btn" type="button">
      🕵️ PLAYER PROFILE
    </button>

    <button id="p3-guide-btn" type="button">
      📋 FYP GAME GUIDE
    </button>

    <button id="p3-check-btn" type="button">
      🚀 LAUNCH CHECKLIST
    </button>

    <button id="p3-title-btn" type="button">
      ◈ TITLE SCREEN
    </button>
  `;

  dashboard.appendChild(toolbar);

  const profile = document.createElement("section");
  profile.id = "p3-profile";
  profile.className = "p3-card";
  profile.hidden = true;

  profile.innerHTML = `
    <h3>🕵️ Detective Player Profile</h3>

    <div class="p3-profile-grid">
      <div class="p3-avatar">🔎</div>

      <div>
        <div id="p3-profile-name"
          class="p3-profile-name"></div>
        <div id="p3-profile-rank"
          class="p3-profile-rank"></div>
      </div>
    </div>

    <p id="p3-profile-progress"></p>

    <label for="p3-edit-name"
      style="display:block;margin-bottom:9px">
      Change Detective Codename
    </label>

    <input
      id="p3-edit-name"
      class="p3-name-input"
      type="text"
      maxlength="24"
      placeholder="New codename"
    >

    <button id="p3-save-profile"
      class="p3-primary">
      SAVE PROFILE
    </button>

    <p id="p3-profile-message"
      class="p3-small-note"
      role="status"></p>
  `;

  const guide = document.createElement("section");
  guide.id = "p3-guide";
  guide.className = "p3-card";
  guide.hidden = true;

  guide.innerHTML = `
    <h3>📋 FYP Game Guide</h3>

    <p>
      <strong>Game:</strong>
      Audit Detective — FAR Edition
    </p>

    <p>
      <strong>Purpose:</strong>
      Support learning of Financial Accounting
      and Reporting through interactive
      investigation-based activities.
    </p>

    <ol>
      <li>
        Create a detective codename.
      </li>
      <li>
        Start Case 001 and inspect the evidence.
      </li>
      <li>
        Answer questions, perform calculations
        and submit accounting decisions.
      </li>
      <li>
        Earn 100 XP for each case completed.
      </li>
      <li>
        Unlock the next case and complete
        all ten investigations.
      </li>
      <li>
        Finish Case 010 to obtain the
        Legendary Audit Detective achievement.
      </li>
    </ol>

    <p>
      <strong>Learning scope:</strong>
      Depreciation, inventory, bank reconciliation,
      accruals, prepayments, receivables,
      capital expenditure, loan interest,
      revenue recognition and financial
      misstatement analysis.
    </p>

    <p class="p3-small-note">
      Game completion is a participation and
      performance indicator. It is not proof
      of learning improvement without
      separate evaluation data.
    </p>
  `;

  const check = document.createElement("section");
  check.id = "p3-launch-check";
  check.className = "p3-card";
  check.hidden = true;

  check.innerHTML = `
    <h3>🚀 FYP Launch Readiness</h3>

    <p>
      This panel checks basic browser and game
      setup. It does not test every accounting
      answer or guarantee that hosting is ready.
    </p>

    <div id="p3-check-list"
      class="p3-check-list"></div>

    <button id="p3-run-check"
      class="p3-secondary">
      ↻ RUN CHECK AGAIN
    </button>

    <p class="p3-small-note">
      Before publishing, verify that all
      image files exist, all 10 cases work,
      and the game loads on both desktop
      and mobile devices.
    </p>
  `;

  dashboard.append(profile, guide, check);

  function updateProfile() {
    const player = readProfile();
    const completed = readCompleted();
    const count = completed.size;

    $("p3-profile-name").textContent =
      player.name || "Unknown Detective";

    $("p3-profile-rank").textContent = rank(count);

    $("p3-profile-progress").textContent =
      count + "/10 cases completed · " +
      (count * 100).toLocaleString("en-MY") +
      " XP earned";

    $("p3-edit-name").value = player.name;
  }

  function togglePanel(panel) {
    const wasHidden = panel.hidden;

    [profile, guide, check].forEach(item => {
      item.hidden = true;
    });

    panel.hidden = !wasHidden;

    if (!panel.hidden) {
      panel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }

  $("p3-profile-btn").addEventListener("click", () => {
    updateProfile();
    togglePanel(profile);
  });

  $("p3-guide-btn").addEventListener("click", () => {
    togglePanel(guide);
  });

  $("p3-check-btn").addEventListener("click", () => {
    runChecks();
    togglePanel(check);
  });

  $("p3-title-btn").addEventListener("click", () => {
    const player = readProfile();
    $("p3-name").value = player.name;

    $("p3-enter").textContent =
      player.name
        ? "▶ CONTINUE AS " + player.name.toUpperCase()
        : "▶ ENTER INVESTIGATION HQ";

    launch.hidden = false;
    document.body.style.overflow = "hidden";
    launch.scrollTop = 0;
    $("p3-name").focus();
  });

  $("p3-save-profile").addEventListener("click", () => {
    const name = $("p3-edit-name").value.trim();

    if (!name) {
      $("p3-profile-message").textContent =
        "Please enter a valid codename.";
      return;
    }

    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ name })
      );
      $("p3-profile-message").textContent =
        "✓ Profile saved successfully.";
    } catch {
      $("p3-profile-message").textContent =
        "Profile updated for this session, but storage is unavailable.";
    }

    $("p3-name").value = name;
    updateProfile();
  });

  // ====================================
  // BASIC LAUNCH READINESS CHECK
  // ====================================

  function runChecks() {
    const tests = [
      {
        name: "Main menu found",
        pass: !!$("welcome-screen")
      },
      {
        name: "Case selection grid found",
        pass: !!document.querySelector(".case-grid")
      },
      {
        name: "All 10 case launch buttons found",
        pass: Array.from(
          { length: 10 },
          (_, i) => !!$("start-case" + (i + 1))
        ).every(Boolean)
      },
      {
        name: "Premium dashboard loaded",
        pass: !!$("ad-dashboard")
      },
      {
        name: "Learning dashboard loaded",
        pass: !!$("p2-learning")
      },
      {
        name: "Final boss screen loaded",
        pass: !!$("case10-screen")
      },
      {
        name: "Player profile available",
        pass: !!readProfile().name
      },
      {
        name: "Game opened through HTTP/HTTPS",
        pass: ["http:", "https:"].includes(
          window.location.protocol
        )
      }
    ];

    const list = $("p3-check-list");
    list.innerHTML = "";

    tests.forEach(test => {
      const row = document.createElement("div");
      row.className =
        "p3-check-item " +
        (test.pass ? "good" : "warn");

      const symbol = document.createElement("span");
      symbol.textContent = test.pass ? "✓" : "!";

      const label = document.createElement("span");
      label.textContent = test.name;

      row.append(symbol, label);
      list.appendChild(row);
    });
  }

  $("p3-run-check").addEventListener(
    "click",
    runChecks
  );

  // ====================================
  // INITIALISE
  // ====================================

  updateProfile();

  document.body.style.overflow = "hidden";

  console.log(
    "Audit Detective FYP Launch Edition ready."
  );
})();
