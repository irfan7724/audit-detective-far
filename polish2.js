
"use strict";

/*
 AUDIT DETECTIVE — ULTIMATE POLISH PART 2
 Cinematic Transitions + Audio Feedback
 Learning Dashboard + Presentation Mode

 Load after polish.js.
*/

(() => {
  const $ = id => document.getElementById(id);

  const PROGRESS_KEY = "auditDetectiveProgress";
  const SOUND_KEY = "auditDetectivePolishSettings";
  const DISPLAY_KEY = "auditDetectivePresentationMode";

  const topics = [
    {
      id: 1,
      icon: "⚙️",
      title: "Depreciation",
      outcome: "Calculate straight-line depreciation and identify overstatements."
    },
    {
      id: 2,
      icon: "📦",
      title: "Inventory Valuation",
      outcome: "Apply lower of cost and net realisable value."
    },
    {
      id: 3,
      icon: "🏦",
      title: "Bank Reconciliation",
      outcome: "Reconcile cash records with bank transactions."
    },
    {
      id: 4,
      icon: "🧾",
      title: "Accrued Expenses",
      outcome: "Identify expenses incurred but not yet recorded."
    },
    {
      id: 5,
      icon: "🛡️",
      title: "Prepaid Insurance",
      outcome: "Allocate insurance costs between expense and prepaid asset."
    },
    {
      id: 6,
      icon: "🔍",
      title: "Receivables",
      outcome: "Assess bad debts and allowance for doubtful debts."
    },
    {
      id: 7,
      icon: "🏭",
      title: "Capital vs Revenue",
      outcome: "Distinguish capital expenditure from operating expenses."
    },
    {
      id: 8,
      icon: "🔐",
      title: "Loan Interest",
      outcome: "Calculate interest expense and accrued interest."
    },
    {
      id: 9,
      icon: "🚚",
      title: "Revenue Recognition",
      outcome: "Determine when control transfers under IFRS 15 / MFRS 15."
    },
    {
      id: 10,
      icon: "🏆",
      title: "Final Audit",
      outcome: "Assess combined financial misstatements and recommend corrections."
    }
  ];

  const menu = $("welcome-screen");
  const dashboard = $("ad-dashboard");

  if (!menu || !dashboard) {
    console.error(
      "Polish Part 2 requires the Part 1 dashboard."
    );
    return;
  }

  let audioContext = null;
  let previousProgress = null;
  let toastTimer = null;
  let transitionTimer = null;
  let presentationMode = false;

  try {
    presentationMode =
      localStorage.getItem(DISPLAY_KEY) === "true";
  } catch {
    presentationMode = false;
  }

  function getCompleted() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROGRESS_KEY)
      );

      return new Set(
        Array.isArray(data?.completed)
          ? data.completed.filter(
              id => Number.isInteger(id) &&
                    id >= 1 && id <= 10
            )
          : []
      );
    } catch {
      return new Set();
    }
  }

  function soundOn() {
    try {
      const settings = JSON.parse(
        localStorage.getItem(SOUND_KEY)
      );
      return settings?.soundEnabled === true;
    } catch {
      return false;
    }
  }

  // ========================================
  // SOUND ENGINE
  // ========================================

  function tone(
    frequency = 500,
    duration = 0.09,
    type = "sine",
    volume = 0.035,
    delay = 0
  ) {
    if (!soundOn()) return;

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

      const start = audioContext.currentTime + delay;
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(
        frequency,
        start
      );

      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        start + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(start);
      oscillator.stop(start + duration);
    } catch (error) {
      console.warn("Part 2 audio unavailable:", error);
    }
  }

  function playSound(name) {
    if (name === "mission") {
      tone(330, .11, "triangle", .035);
      tone(440, .11, "triangle", .035, .12);
      tone(660, .18, "triangle", .035, .25);
    }

    if (name === "success") {
      tone(523, .12, "sine", .04);
      tone(659, .12, "sine", .04, .13);
      tone(784, .24, "sine", .04, .26);
    }

    if (name === "error") {
      tone(220, .13, "sawtooth", .015);
      tone(165, .18, "sawtooth", .015, .14);
    }

    if (name === "victory") {
      [523, 659, 784, 1047].forEach((freq, i) => {
        tone(freq, .25, "triangle", .045, i * .15);
      });
    }
  }

  // ========================================
  // CINEMATIC OVERLAY
  // ========================================

  const overlay = document.createElement("div");
  overlay.id = "p2-overlay";
  overlay.hidden = true;
  overlay.setAttribute("aria-hidden", "true");

  overlay.innerHTML = `
    <div class="p2-transition-box">
      <div class="p2-transition-icon">🔎</div>
      <div class="p2-transition-kicker">
        AUDIT DETECTIVE · FAR EDITION
      </div>
      <div id="p2-transition-title"
        class="p2-transition-title">
        MISSION INITIALISING
      </div>
      <div class="p2-transition-bar"></div>
      <div class="p2-transition-note">
        ACCESSING CONFIDENTIAL CASE FILES...
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  function showTransition(title) {
    if (transitionTimer !== null) {
      clearTimeout(transitionTimer);
    }

    $("p2-transition-title").textContent = title;
    overlay.hidden = false;

    playSound("mission");

    transitionTimer = setTimeout(() => {
      overlay.hidden = true;
      transitionTimer = null;
    }, 850);
  }

  // ========================================
  // ACHIEVEMENT NOTIFICATION
  // ========================================

  const toast = document.createElement("div");
  toast.id = "p2-toast";
  toast.hidden = true;
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");

  toast.innerHTML = `
    <div id="p2-toast-heading"
      class="p2-toast-heading"></div>
    <div id="p2-toast-body"
      class="p2-toast-body"></div>
  `;

  document.body.appendChild(toast);

  function showToast(heading, body, duration = 3800) {
    if (toastTimer !== null) {
      clearTimeout(toastTimer);
    }

    $("p2-toast-heading").textContent = heading;
    $("p2-toast-body").textContent = body;

    toast.hidden = false;

    toastTimer = setTimeout(() => {
      toast.hidden = true;
      toastTimer = null;
    }, duration);
  }

  // ========================================
  // LEARNING DASHBOARD
  // ========================================

  const controls = document.createElement("div");
  controls.className = "p2-extra-controls";

  controls.innerHTML = `
    <button id="p2-learning-btn"
      class="p2-control"
      type="button"
      aria-expanded="false">
      📚 LEARNING DASHBOARD
    </button>

    <button id="p2-present-btn"
      class="p2-control"
      type="button"
      aria-pressed="false">
      🖥 PRESENTATION MODE
    </button>
  `;

  const existingControls =
    dashboard.querySelector(".ad-controls");

  if (existingControls) {
    existingControls.insertAdjacentElement(
      "afterend",
      controls
    );
  } else {
    dashboard.appendChild(controls);
  }

  const learning = document.createElement("section");
  learning.id = "p2-learning";
  learning.hidden = true;

  learning.innerHTML = `
    <div class="p2-eyebrow">
      EDUCATIONAL PERFORMANCE / FYP MODULE
    </div>

    <h2 class="p2-heading">
      FAR Learning Dashboard
    </h2>

    <p class="p2-description">
      Track completion of ten interactive financial
      accounting investigations. Each case focuses
      on a specific accounting skill.
    </p>

    <div class="p2-learning-stats">
      <div class="p2-learning-stat">
        <small>TOPICS COMPLETED</small>
        <strong id="p2-topics-done">0 / 10</strong>
      </div>

      <div class="p2-learning-stat">
        <small>COMPLETION RATE</small>
        <strong id="p2-rate">0%</strong>
      </div>

      <div class="p2-learning-stat">
        <small>XP EARNED</small>
        <strong id="p2-learning-xp">0</strong>
      </div>
    </div>

    <div id="p2-topic-list"
      class="p2-topic-list"></div>

    <div class="p2-learning-note">
      <strong>FYP Learning Objective:</strong>
      Apply financial accounting and reporting
      principles through investigation,
      evidence interpretation, calculations
      and corrective accounting decisions.
      Completion indicates that the game
      recorded the case as solved; it is not
      a separate measure of learning improvement.
    </div>
  `;

  dashboard.insertAdjacentElement(
    "afterend",
    learning
  );

  function renderLearning() {
    const completed = getCompleted();
    const list = $("p2-topic-list");

    $("p2-topics-done").textContent =
      completed.size + " / 10";

    $("p2-rate").textContent =
      Math.round(completed.size / 10 * 100) + "%";

    $("p2-learning-xp").textContent =
      (completed.size * 100).toLocaleString("en-MY");

    list.innerHTML = "";

    topics.forEach(topic => {
      const done = completed.has(topic.id);

      const item = document.createElement("article");
      item.className =
        "p2-topic" + (done ? " complete" : "");

      const icon = document.createElement("span");
      icon.className = "p2-topic-icon";
      icon.textContent = topic.icon;

      const details = document.createElement("div");

      const heading = document.createElement("h4");
      heading.textContent =
        "CASE " +
        String(topic.id).padStart(3, "0") +
        " · " + topic.title;

      const outcome = document.createElement("p");
      outcome.textContent = topic.outcome;

      const status = document.createElement("span");
      status.className = "p2-topic-status";
      status.textContent = done
        ? "✓ COMPLETED"
        : "○ NOT COMPLETED";

      details.append(heading, outcome, status);
      item.append(icon, details);
      list.appendChild(item);
    });
  }

  $("p2-learning-btn").addEventListener("click", () => {
    learning.hidden = !learning.hidden;

    $("p2-learning-btn").setAttribute(
      "aria-expanded",
      String(!learning.hidden)
    );

    $("p2-learning-btn").textContent = learning.hidden
      ? "📚 LEARNING DASHBOARD"
      : "✕ CLOSE LEARNING DASHBOARD";

    if (!learning.hidden) {
      renderLearning();
      learning.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });

  // ========================================
  // PRESENTATION MODE
  // ========================================

  function applyPresentationMode() {
    document.body.classList.toggle(
      "p2-presentation",
      presentationMode
    );

    const button = $("p2-present-btn");

    button.setAttribute(
      "aria-pressed",
      String(presentationMode)
    );

    button.textContent = presentationMode
      ? "🖥 PRESENTATION ON"
      : "🖥 PRESENTATION MODE";
  }

  $("p2-present-btn").addEventListener("click", () => {
    presentationMode = !presentationMode;

    try {
      localStorage.setItem(
        DISPLAY_KEY,
        String(presentationMode)
      );
    } catch (error) {
      console.warn("Presentation setting not saved.", error);
    }

    applyPresentationMode();

    showToast(
      presentationMode
        ? "PRESENTATION MODE ENABLED"
        : "PRESENTATION MODE DISABLED",
      presentationMode
        ? "Larger text and wider game layout are active."
        : "Standard game layout restored."
    );
  });

  applyPresentationMode();

  // ========================================
  // CASE LAUNCH TRANSITIONS
  // ========================================

  document.addEventListener("click", event => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const button = target.closest("button");
    if (!button || button.disabled) return;

    // Only actual case-launch buttons.
    const match = button.id.match(/^start-case(\d+)$/);

    if (match) {
      const caseNumber = Number(match[1]);

      if (caseNumber >= 1 && caseNumber <= 10) {
        showTransition(
          "CASE " +
          String(caseNumber).padStart(3, "0") +
          " · MISSION INITIALISING"
        );
      }
    }
  });

  // ========================================
  // GAME FEEDBACK AUDIO
  // ========================================

  const feedbackSelectors = [
    "#c8-final-feedback",
    "#c9-final-feedback",
    "#c10-mission-feedback",
    "#c10-final-feedback"
  ];

  const feedbackCache = new Map();

  function checkFeedbackSounds() {
    if (!soundOn()) return;

    feedbackSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) return;

      const text = element.textContent.trim();
      const previous = feedbackCache.get(selector) || "";

      if (text === previous) return;

      feedbackCache.set(selector, text);

      if (!text) return;

      if (
        text.startsWith("✓") ||
        text.includes("THREAT NEUTRALISED")
      ) {
        playSound("success");
      } else if (
        text.startsWith("✕") ||
        text.includes("REJECTED")
      ) {
        playSound("error");
      }
    });
  }

  // ========================================
  // PROGRESS & ACHIEVEMENT WATCH
  // ========================================

  function checkProgress() {
    const completed = getCompleted();

    if (previousProgress === null) {
      previousProgress = completed;
      renderLearning();
      return;
    }

    const newlyCompleted = [...completed].filter(
      id => !previousProgress.has(id)
    );

    if (newlyCompleted.length > 0) {
      const lastCase = newlyCompleted[
        newlyCompleted.length - 1
      ];

      if (lastCase === 10 && completed.size === 10) {
        showToast(
          "🏆 LEGENDARY DETECTIVE UNLOCKED",
          "All ten investigations completed! 1,000 XP achieved.",
          5500
        );

        playSound("victory");
      } else {
        showToast(
          "⭐ CASE COMPLETED",
          "Case " +
          String(lastCase).padStart(3, "0") +
          " solved. +100 XP earned!"
        );

        playSound("success");
      }

      renderLearning();
    }

    previousProgress = completed;
  }

  // Monitor only small UI elements and saved progress.
  // This avoids modifying the existing game logic.
  window.setInterval(() => {
    checkProgress();
    checkFeedbackSounds();
  }, 800);

  window.addEventListener("storage", event => {
    if (event.key === PROGRESS_KEY) {
      checkProgress();
      renderLearning();
    }
  });

  window.addEventListener("pageshow", () => {
    renderLearning();
  });

  // Start with existing progress as the baseline.
  previousProgress = getCompleted();
  renderLearning();

  console.log(
    "Audit Detective Ultimate Polish Part 2 ready."
  );
})();
