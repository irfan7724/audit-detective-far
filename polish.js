
"use strict";

/*
 AUDIT DETECTIVE — ULTIMATE POLISH PART 1
 Premium Dashboard, Achievements and Sound Controls

 Does not replace or modify existing case functions.
*/

(() => {
  const STORAGE = "auditDetectiveProgress";
  const SETTINGS = "auditDetectivePolishSettings";
  const TOTAL_CASES = 10;
  const $ = id => document.getElementById(id);

  const menu = $("welcome-screen");

  if (!menu) {
    console.error("Polish: Welcome screen not found.");
    return;
  }

  let soundEnabled = false;
  let audioContext = null;
  let lastCompleted = -1;

  try {
    const saved = JSON.parse(
      localStorage.getItem(SETTINGS)
    );
    soundEnabled = saved?.soundEnabled === true;
  } catch {
    soundEnabled = false;
  }

  function getCompleted() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE)
      );

      const valid = Array.isArray(saved?.completed)
        ? saved.completed.filter(
            n => Number.isInteger(n) &&
                 n >= 1 &&
                 n <= TOTAL_CASES
          )
        : [];

      return new Set(valid);
    } catch {
      return new Set();
    }
  }

  function getRank(count) {
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

  function saveSettings() {
    try {
      localStorage.setItem(
        SETTINGS,
        JSON.stringify({ soundEnabled })
      );
    } catch (error) {
      console.warn("Could not save sound settings.", error);
    }
  }

  function playTone(frequency = 600, duration = 0.08) {
    if (!soundEnabled) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioCtx) return;

      if (!audioContext) {
        audioContext = new AudioCtx();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gain.gain.setValueAtTime(
        0.035,
        audioContext.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(
        audioContext.currentTime + duration
      );
    } catch (error) {
      console.warn("Sound unavailable:", error);
    }
  }

  // ---------------------------------------
  // BUILD DASHBOARD
  // ---------------------------------------

  const dashboard = document.createElement("section");
  dashboard.className = "ad-dashboard";
  dashboard.id = "ad-dashboard";

  dashboard.innerHTML = `
    <div class="ad-dashboard-top">
      <div>
        <div class="ad-eyebrow">
          ◈ FINANCIAL INVESTIGATION DIVISION
        </div>
        <h2 class="ad-dashboard-title">
          DETECTIVE COMMAND CENTER
        </h2>
      </div>
      <span class="ad-chip" id="ad-rank">
        JUNIOR DETECTIVE
      </span>
    </div>

    <div class="ad-stats">
      <div class="ad-stat">
        <span class="ad-stat-label">
          CASES COMPLETED
        </span>
        <strong class="ad-stat-value"
          id="ad-completed">0 / 10</strong>
      </div>

      <div class="ad-stat">
        <span class="ad-stat-label">
          TOTAL EXPERIENCE
        </span>
        <strong class="ad-stat-value"
          id="ad-xp">0 XP</strong>
      </div>

      <div class="ad-stat">
        <span class="ad-stat-label">
          GAME PROGRESS
        </span>
        <strong class="ad-stat-value"
          id="ad-percentage">0%</strong>
      </div>
    </div>

    <div class="ad-progress-heading">
      <strong>INVESTIGATION PROGRESS</strong>
      <span id="ad-progress-caption">0 OF 10 CLEARED</span>
    </div>

    <div class="ad-progress-track"
      role="progressbar"
      aria-label="Investigation progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="0"
      id="ad-progress-track">
      <div id="ad-progress-fill"
        class="ad-progress-fill"></div>
    </div>

    <div class="ad-milestones" id="ad-milestones"></div>

    <div class="ad-achievements">
      <div class="ad-achievement" id="ad-achievement-1">
        <span class="ad-achievement-icon">🥉</span>
        <div>
          <strong>FIRST BREAKTHROUGH</strong>
          <small>Complete your first case</small>
        </div>
      </div>

      <div class="ad-achievement" id="ad-achievement-5">
        <span class="ad-achievement-icon">🥈</span>
        <div>
          <strong>HALFWAY HERO</strong>
          <small>Complete five cases</small>
        </div>
      </div>

      <div class="ad-achievement" id="ad-achievement-10">
        <span class="ad-achievement-icon">🏆</span>
        <div>
          <strong>FAR LEGEND</strong>
          <small>Complete all ten cases</small>
        </div>
      </div>
    </div>

    <div class="ad-controls">
      <button id="ad-sound"
        class="ad-control-btn"
        type="button">
        🔇 SOUND OFF
      </button>

      <button id="ad-how-to"
        class="ad-control-btn"
        type="button">
        ❔ HOW TO PLAY
      </button>
    </div>

    <div id="ad-guide" class="ad-completion-banner" hidden>
      <strong>HOW TO PLAY</strong>
      <p>
        Start with Case 001. Investigate evidence,
        answer accounting questions, and complete
        the final calculation. Each solved case
        earns 100 XP and unlocks the next case.
        Complete all ten cases to become a
        Legendary Audit Detective.
      </p>
    </div>

    <div id="ad-completion-banner"
      class="ad-completion-banner" hidden>
      <strong>🏆 ALL INVESTIGATIONS COMPLETE</strong>
      <p>
        Congratulations! You have completed
        all 10 cases in Audit Detective — FAR Edition.
        Your final rank is Legendary Audit Detective.
      </p>
    </div>
  `;

  const caseGrid = menu.querySelector(".case-grid");

  if (caseGrid) {
    menu.insertBefore(dashboard, caseGrid);
  } else {
    menu.appendChild(dashboard);
  }

  // ---------------------------------------
  // UPDATE DASHBOARD
  // ---------------------------------------

  function refreshDashboard() {
    const completed = getCompleted();
    const count = completed.size;
    const xp = count * 100;
    const percent = Math.round(
      count / TOTAL_CASES * 100
    );
    const rank = getRank(count);

    $("ad-completed").textContent =
      count + " / " + TOTAL_CASES;

    $("ad-xp").textContent =
      xp.toLocaleString("en-MY") + " XP";

    $("ad-percentage").textContent =
      percent + "%";

    $("ad-rank").textContent =
      "★ " + rank.toUpperCase();

    $("ad-progress-caption").textContent =
      count + " OF " + TOTAL_CASES + " CLEARED";

    $("ad-progress-fill").style.width =
      percent + "%";

    $("ad-progress-track").setAttribute(
      "aria-valuenow",
      String(percent)
    );

    const milestones = $("ad-milestones");
    milestones.innerHTML = "";

    for (let id = 1; id <= TOTAL_CASES; id++) {
      const cell = document.createElement("div");
      cell.className = "ad-milestone";

      if (completed.has(id)) {
        cell.classList.add("complete");
        cell.textContent = "✓";
        cell.title = "Case " + id + " completed";
      } else {
        cell.textContent = String(id);
        cell.title = "Case " + id + " incomplete";

        if (id === 1 || completed.has(id - 1)) {
          cell.classList.add("next");
        }
      }

      milestones.appendChild(cell);
    }

    [1, 5, 10].forEach(target => {
      const badge = $("ad-achievement-" + target);
      badge.classList.toggle(
        "earned",
        count >= target
      );
    });

    $("ad-completion-banner").hidden =
      count !== TOTAL_CASES;

    // Correct the displayed XP/rank when returning
    // to the menu, without changing case unlock logic.
    if ($("total-xp")) {
      $("total-xp").textContent = xp;
    }

    if ($("detective-rank")) {
      $("detective-rank").textContent = rank;
    }

    if (
      lastCompleted >= 0 &&
      count > lastCompleted &&
      soundEnabled
    ) {
      playTone(784, 0.15);
    }

    lastCompleted = count;
  }

  // ---------------------------------------
  // SOUND CONTROL
  // ---------------------------------------

  function updateSoundButton() {
    const button = $("ad-sound");

    button.textContent = soundEnabled
      ? "🔊 SOUND ON"
      : "🔇 SOUND OFF";

    button.setAttribute(
      "aria-pressed",
      String(soundEnabled)
    );
  }

  $("ad-sound").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    saveSettings();
    updateSoundButton();

    if (soundEnabled) {
      playTone(660, 0.1);
    }
  });

  $("ad-how-to").addEventListener("click", () => {
    const guide = $("ad-guide");
    guide.hidden = !guide.hidden;

    $("ad-how-to").textContent = guide.hidden
      ? "❔ HOW TO PLAY"
      : "✕ CLOSE GUIDE";

    playTone(500, 0.06);
  });

  // ---------------------------------------
  // SOUND FEEDBACK
  // ---------------------------------------

  document.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest("button");

    if (!button || button.disabled) return;

    if (button.closest("#ad-dashboard")) return;

    // Soft click sound for game buttons.
    playTone(430, 0.035);
  });

  // ---------------------------------------
  // KEEP PROGRESS UP TO DATE
  // ---------------------------------------

  const observer = new MutationObserver(() => {
    if (!menu.hidden) {
      refreshDashboard();
    }
  });

  observer.observe(menu, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  window.addEventListener("storage", event => {
    if (event.key === STORAGE) {
      refreshDashboard();
    }
  });

  window.addEventListener("pageshow", () => {
    refreshDashboard();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !menu.hidden) {
      refreshDashboard();
    }
  });

  // Periodically refresh while the menu is visible.
  // This covers case scripts that return to the menu
  // without triggering a hidden-attribute change.
  window.setInterval(() => {
    if (!menu.hidden) {
      const count = getCompleted().size;

      if (count !== lastCompleted) {
        refreshDashboard();
      }
    }
  }, 1500);

  updateSoundButton();
  refreshDashboard();

  console.log(
    "Audit Detective Ultimate Polish loaded successfully."
  );
})();
