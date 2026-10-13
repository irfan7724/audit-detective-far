
"use strict";

/*
 AUDIT DETECTIVE — GAME LOBBY
 Load LAST, after scroll-fix.js.

 Organizes existing menu sections.
 Does not rewrite cases, scores or accounts.
*/

(() => {
  const $ = id => document.getElementById(id);

  const PROGRESS_KEY = "auditDetectiveProgress";
  const PROFILE_KEY = "auditDetectivePlayerProfile";
  const ACCOUNTS_KEY = "adLocalAccountsV1";
  const SESSION_KEY = "adActiveAccountV1";

  const welcome = $("welcome-screen");
  const dashboard = $("ad-dashboard");

  if (!welcome || !dashboard) {
    console.warn("Game Lobby: Main menu not found.");
    return;
  }

  function readJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function currentAccount() {
    const id = sessionStorage.getItem(SESSION_KEY);
    const accounts = readJSON(ACCOUNTS_KEY, []);

    return Array.isArray(accounts)
      ? accounts.find(a => a.id === id)
      : null;
  }

  function getName() {
    const account = currentAccount();
    if (account) return account.name;

    const profile = readJSON(PROFILE_KEY, {});
    return typeof profile.name === "string"
      ? profile.name
      : "Detective";
  }

  function completed() {
    const data = readJSON(PROGRESS_KEY, {});
    const ids = Array.isArray(data.completed)
      ? data.completed
      : [];

    return new Set(
      ids.filter(n =>
        Number.isInteger(n) && n >= 1 && n <= 10
      )
    );
  }

  // ==================================
  // CREATE LOBBY
  // ==================================

  const lobby = document.createElement("section");
  lobby.id = "game-lobby";

  lobby.innerHTML = `
    <div class="lobby-shell">
      <header class="lobby-header">
        <div class="lobby-brand">
          <div class="lobby-logo">🕵️</div>
          <div>
            <strong>AUDIT DETECTIVE</strong>
            <small>FAR EDITION</small>
          </div>
        </div>

        <button id="lobby-logout"
          class="lobby-logout"
          type="button">
          ↪ LOGOUT
        </button>
      </header>

      <section class="lobby-hero">
        <div class="lobby-kicker">
          FINANCIAL INVESTIGATION HQ
        </div>

        <h1 class="lobby-heading">
          Welcome back,
          <span id="lobby-player"></span>
        </h1>

        <p class="lobby-muted">
          Your next investigation awaits.
          Choose a destination to continue.
        </p>

        <div class="lobby-progress-top">
          <span>Investigation Progress</span>
          <strong id="lobby-count">0 / 10</strong>
        </div>

        <div class="lobby-track">
          <div id="lobby-fill"
            class="lobby-fill"></div>
        </div>

        <div class="lobby-stats">
          <div id="lobby-xp"
            class="lobby-stat">0 XP</div>
          <div id="lobby-rank"
            class="lobby-stat">ROOKIE</div>
        </div>
      </section>

      <h2 class="lobby-section-title">
        SELECT YOUR DESTINATION
      </h2>

      <div class="lobby-cards">
        <button class="lobby-card"
          data-lobby-page="story"
          type="button">
          <span class="lobby-card-icon">📖</span>
          <span class="lobby-card-title">STORY MODE</span>
          <span class="lobby-card-desc">
            Follow The Ledger Conspiracy
            across four chapters.
          </span>
          <span class="lobby-card-arrow">↗</span>
        </button>

        <button class="lobby-card"
          data-lobby-page="cases"
          type="button">
          <span class="lobby-card-icon">🔎</span>
          <span class="lobby-card-title">CASE FILES</span>
          <span class="lobby-card-desc">
            Investigate ten Financial Accounting
            and Reporting cases.
          </span>
          <span class="lobby-card-arrow">↗</span>
        </button>

        <button class="lobby-card"
          data-lobby-page="evidence"
          type="button">
          <span class="lobby-card-icon">🧩</span>
          <span class="lobby-card-title">EVIDENCE BOARD</span>
          <span class="lobby-card-desc">
            Examine unlocked findings
            and review accounting evidence.
          </span>
          <span class="lobby-card-arrow">↗</span>
        </button>

        <button class="lobby-card"
          data-lobby-page="achievements"
          type="button">
          <span class="lobby-card-icon">🏆</span>
          <span class="lobby-card-title">ACHIEVEMENTS</span>
          <span class="lobby-card-desc">
            View detective rank, XP,
            badges and learning progress.
          </span>
          <span class="lobby-card-arrow">↗</span>
        </button>
      </div>

      <div class="lobby-bottom">
        <button id="lobby-settings"
          class="lobby-settings-btn"
          type="button">
          ⚙ SETTINGS & DEMO TOOLS
        </button>
      </div>
    </div>
  `;

  const view = document.createElement("section");
  view.id = "lobby-view";
  view.hidden = true;

  view.innerHTML = `
    <div class="lobby-view-header">
      <h2 id="lobby-view-title"
        class="lobby-view-title"></h2>

      <button id="lobby-back"
        class="lobby-back"
        type="button">
        ← BACK TO LOBBY
      </button>
    </div>

    <div id="lobby-view-content"></div>
  `;

  document.body.insertBefore(lobby, document.body.firstChild);
  lobby.insertAdjacentElement("afterend", view);

  const content = $("lobby-view-content");

  // Save each element's original location.
  // This allows moving the actual element without
  // deleting its existing event listeners.
  const anchors = new Map();

  function moveToView(element) {
    if (!element) return;

    if (!anchors.has(element)) {
      const marker = document.createComment(
        "Original position: " + (element.id || "section")
      );

      element.parentNode.insertBefore(marker, element);
      anchors.set(element, marker);
    }

    content.appendChild(element);
    element.hidden = false;
    element.style.display = "";
  }

  function restoreElements() {
    for (const [element, marker] of anchors) {
      if (marker.parentNode) {
        marker.parentNode.insertBefore(element, marker);
      }
    }

    anchors.clear();
    content.innerHTML = "";
  }

  function refreshLobby() {
    const count = completed().size;

    $("lobby-player").textContent = getName();
    $("lobby-count").textContent = count + " / 10";
    $("lobby-fill").style.width = (count * 10) + "%";
    $("lobby-xp").textContent = (count * 100) + " XP";

    $("lobby-rank").textContent =
      count === 10
        ? "LEGENDARY DETECTIVE"
        : count >= 7
          ? "SENIOR INVESTIGATOR"
          : count >= 4
            ? "INVESTIGATOR"
            : "ROOKIE DETECTIVE";
  }

  function showLobby() {
    restoreElements();

    view.hidden = true;
    lobby.hidden = false;

    document.body.classList.remove("lobby-section");
    document.body.classList.add("lobby-home");

    refreshLobby();
    window.scrollTo(0, 0);
  }

  function emptyMessage(message) {
    const box = document.createElement("div");
    box.className = "lobby-empty";
    box.textContent = message;
    content.appendChild(box);
  }

  function showPage(page) {
    restoreElements();

    lobby.hidden = true;
    view.hidden = false;

    document.body.classList.remove("lobby-home");
    document.body.classList.add("lobby-section");

    const titles = {
      story: "📖 STORY MODE",
      cases: "🔎 CASE FILES",
      evidence: "🧩 EVIDENCE BOARD",
      achievements: "🏆 ACHIEVEMENTS",
      settings: "⚙ SETTINGS & DEMO TOOLS"
    };

    $("lobby-view-title").textContent =
      titles[page] || "INVESTIGATION HQ";

    if (page === "story") {
      const story = $("story-hub");

      if (story) {
        moveToView(story);

        // Refresh Story Mode through its existing
        // entry button when available.
        const openButton = $("story-open");
        if (openButton) openButton.click();

        story.hidden = false;
      } else {
        emptyMessage("Story Mode is not available.");
      }
    }

    if (page === "cases") {
      const caseGrid = welcome.querySelector(".case-grid");

      if (caseGrid) {
        moveToView(caseGrid);
      } else {
        emptyMessage(
          "Case grid not found. Check the .case-grid element in index.html."
        );
      }
    }

    if (page === "evidence") {
      const board = $("s2-board");

      if (board) {
        moveToView(board);

        // Use existing Story Part 2 button
        // to refresh its progress and evidence.
        const boardButton = document.querySelector(
          "#story-hub .story-button"
        );

        const allButtons = [
          ...document.querySelectorAll(
            "#story-hub button"
          )
        ];

        const openEvidence = allButtons.find(
          b => b.textContent.includes("OPEN EVIDENCE BOARD")
        );

        if (openEvidence && board.hidden) {
          openEvidence.click();
        }

        board.hidden = false;
      } else {
        emptyMessage("Evidence Board is not available.");
      }
    }

    if (page === "achievements") {
      const learning = $("p2-learning");

      if (learning) {
        moveToView(learning);
      }

      // Dashboard contains the existing rank,
      // badges, XP and achievement widgets.
      if (dashboard) {
        moveToView(dashboard);
      }

      if (!learning && !dashboard) {
        emptyMessage("Achievements are not available.");
      }
    }

    if (page === "settings") {
      const launch = $("launch-control");

      if (launch) {
        moveToView(launch);
      }

      emptyMessage(
        "Additional sound and presentation controls remain available in the existing game dashboard."
      );
    }

    window.scrollTo(0, 0);
  }

  // ==================================
  // NAVIGATION
  // ==================================

  document.querySelectorAll(
    "[data-lobby-page]"
  ).forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.lobbyPage);
    });
  });

  $("lobby-settings").addEventListener(
    "click",
    () => showPage("settings")
  );

  $("lobby-back").addEventListener(
    "click",
    showLobby
  );

  // Reuse the original logout button so
  // account saving remains handled by accounts.js.
  $("lobby-logout").addEventListener("click", () => {
    const oldLogout = document.querySelector(
      "#detective-account-bar .account-bar-button"
    );

    if (oldLogout) {
      oldLogout.click();
    } else {
      alert("Logout control was not found.");
    }
  });

  // Case buttons still execute their original
  // handlers. Hide the lobby view while playing.
  document.addEventListener("click", event => {
    const button = event.target.closest(
      '[id^="start-case"]'
    );

    if (!button) return;

    view.hidden = true;
    document.body.classList.remove("lobby-section");
  });

  // Preserve existing login behavior.
  // Only activate lobby for an active account.
  function initialize() {
    if (!currentAccount()) {
      lobby.hidden = true;
      view.hidden = true;
      return;
    }

    showLobby();
  }

  initialize();

  window.addEventListener("pageshow", () => {
    if (!currentAccount()) {
      lobby.hidden = true;
      view.hidden = true;
    } else {
      refreshLobby();
    }
  });

  console.log("Audit Detective Game Lobby ready.");
})();
