
"use strict";

/*
 AUDIT DETECTIVE — FAR EDITION
 STORY MODE: THE LEDGER CONSPIRACY

 Standalone enhancement.
 Does not alter original answers, XP or case logic.
*/

(() => {
  const $ = id => document.getElementById(id);

  const PROGRESS_KEY = "auditDetectiveProgress";
  const PROFILE_KEY = "auditDetectivePlayerProfile";

  const menu = $("welcome-screen");
  const dashboard = $("ad-dashboard");

  if (!menu || !dashboard) {
    console.warn("Story Mode: Main menu not found.");
    return;
  }

  const chapters = [
    {
      number: 1,
      name: "The First Clue",
      cases: [1, 2, 3],
      icon: "🔎",
      description:
        "An unusual depreciation entry, a warehouse discrepancy and an unexplained bank balance.",
      scenes: [
        {
          speaker: "NARRATOR",
          title: "A Mysterious Assignment",
          icon: "🌃",
          text:
            "11:47 PM. Rain falls over the city. A confidential report arrives at the Financial Investigation Division."
        },
        {
          speaker: "CHIEF INSPECTOR MAYA",
          title: "The Confidential Report",
          icon: "📁",
          text:
            "Detective {name}, we have received financial records containing several unusual discrepancies. Management claims everything is correct, but the figures tell another story."
        },
        {
          speaker: "CHIEF INSPECTOR MAYA",
          title: "Your First Mission",
          icon: "🔍",
          text:
            "Begin with the depreciation records. Then investigate the warehouse valuation and bank reconciliation. We need accurate calculations, not assumptions."
        }
      ]
    },
    {
      number: 2,
      name: "The Hidden Entries",
      cases: [4, 5, 6],
      icon: "📂",
      description:
        "Unrecorded expenses, prepaid insurance and questionable receivables reveal deeper reporting problems.",
      scenes: [
        {
          speaker: "NARRATOR",
          title: "Behind the Numbers",
          icon: "🗃️",
          text:
            "The first investigation has revealed a pattern: several financial statement balances need closer examination."
        },
        {
          speaker: "CHIEF INSPECTOR MAYA",
          title: "The Expense Files",
          icon: "🧾",
          text:
            "Detective {name}, check the unpaid bills and insurance policy. Then investigate whether the receivables are still recoverable."
        },
        {
          speaker: "FINANCIAL ANALYST",
          title: "Follow the Evidence",
          icon: "📊",
          text:
            "Each adjustment could change reported profit or asset balances. Document your findings carefully before drawing a conclusion."
        }
      ]
    },
    {
      number: 3,
      name: "Follow the Money",
      cases: [7, 8, 9],
      icon: "💼",
      description:
        "Equipment costs, interest on a hidden loan and a suspicious year-end sale.",
      scenes: [
        {
          speaker: "NARRATOR",
          title: "A New Lead",
          icon: "🏢",
          text:
            "New evidence arrives from the purchasing department, the finance team and the sales office."
        },
        {
          speaker: "CHIEF INSPECTOR MAYA",
          title: "Three Critical Files",
          icon: "🔐",
          text:
            "Detective {name}, distinguish equipment expenditure from maintenance, calculate the loan interest and investigate the timing of the year-end sale."
        },
        {
          speaker: "FINANCIAL ANALYST",
          title: "The Reporting Deadline",
          icon: "📅",
          text:
            "Pay special attention to the reporting date. A transaction recorded in the wrong period can materially affect the financial statements."
        }
      ]
    },
    {
      number: 4,
      name: "The Final Audit",
      cases: [10],
      icon: "⚖️",
      description:
        "Revisit the critical evidence, calculate the combined impact and deliver the final audit recommendation.",
      scenes: [
        {
          speaker: "NARRATOR",
          title: "The Final Briefing",
          icon: "🚨",
          text:
            "All major case files have been reviewed. The investigation now reaches its final stage."
        },
        {
          speaker: "CHIEF INSPECTOR MAYA",
          title: "The Final Audit",
          icon: "⚖️",
          text:
            "Detective {name}, this is your final assignment. Analyse the combined financial misstatements and determine what corrective action is necessary."
        },
        {
          speaker: "CHIEF INSPECTOR MAYA",
          title: "The Verdict Awaits",
          icon: "🏆",
          text:
            "Your conclusions must be supported by the evidence and correct accounting calculations. Complete the final audit to close the investigation."
        }
      ]
    }
  ];

  function getCompleted() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROGRESS_KEY)
      );

      return new Set(
        Array.isArray(data?.completed)
          ? data.completed.filter(
              n => Number.isInteger(n) && n >= 1 && n <= 10
            )
          : []
      );
    } catch {
      return new Set();
    }
  }

  function getPlayerName() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROFILE_KEY)
      );

      const name =
        typeof data?.name === "string"
          ? data.name.trim().slice(0, 24)
          : "";

      return name || "Detective";
    } catch {
      return "Detective";
    }
  }

  function caseLabel(number) {
    return String(number).padStart(3, "0");
  }

  function isChapterUnlocked(chapter, completed) {
    if (chapter.number === 1) return true;

    const previous = chapters[chapter.number - 2];

    return previous.cases.every(id => completed.has(id));
  }

  function getNextCase(chapter, completed) {
    return chapter.cases.find(id => !completed.has(id))
      ?? chapter.cases[0];
  }

  // ===================================
  // STORY HUB
  // ===================================

  const hub = document.createElement("section");
  hub.id = "story-hub";
  hub.hidden = true;

  hub.innerHTML = `
    <div class="story-kicker">
      ◈ CONFIDENTIAL CASE ARCHIVE
    </div>

    <h2 class="story-heading">
      THE LEDGER CONSPIRACY
    </h2>

    <p class="story-description">
      One investigation. Ten connected financial
      accounting cases. Follow the evidence,
      uncover reporting discrepancies and
      complete the final audit.
    </p>

    <div class="story-summary">
      <span id="story-count">0 / 10 CASES SOLVED</span>
      <span id="story-chapter-count">
        0 / 4 CHAPTERS CLEARED
      </span>
      <span>FINANCIAL ACCOUNTING & REPORTING</span>
    </div>

    <div id="story-chapters"
      class="story-chapters"></div>

    <div class="story-hub-actions">
      <button id="story-close"
        class="story-button story-button-secondary"
        type="button">
        ← BACK TO MAIN MENU
      </button>
    </div>
  `;

  dashboard.insertAdjacentElement("afterend", hub);

  const toolbar = document.createElement("div");
  toolbar.className = "story-hub-actions";

  const openButton = document.createElement("button");
  openButton.id = "story-open";
  openButton.className = "story-button";
  openButton.type = "button";
  openButton.textContent = "📖 ENTER STORY MODE";

  toolbar.appendChild(openButton);
  dashboard.appendChild(toolbar);

  // ===================================
  // CUTSCENE SCREEN
  // ===================================

  const cutscene = document.createElement("div");
  cutscene.id = "story-cutscene";
  cutscene.hidden = true;
  cutscene.setAttribute("role", "dialog");
  cutscene.setAttribute("aria-modal", "true");
  cutscene.setAttribute(
    "aria-label",
    "Detective story briefing"
  );

  cutscene.innerHTML = `
    <div class="story-scene-card">
      <div class="story-scene-top">
        <span class="story-kicker">
          ◈ CLASSIFIED BRIEFING
        </span>
        <span id="story-counter"
          class="story-scene-counter"></span>
      </div>

      <div id="story-art"
        class="story-scene-art">🔎</div>

      <h2 id="story-scene-title"
        class="story-scene-title"></h2>

      <div id="story-speaker"
        class="story-speaker"></div>

      <div id="story-dialogue"
        class="story-dialogue"></div>

      <div class="story-scene-actions">
        <button id="story-exit"
          class="story-button story-button-secondary"
          type="button">
          ✕ EXIT
        </button>

        <button id="story-next"
          class="story-button"
          type="button">
          NEXT →
        </button>
      </div>

      <p class="story-note">
        Story Mode adds fictional narrative context.
        The accounting questions and answers remain
        unchanged.
      </p>
    </div>
  `;

  document.body.appendChild(cutscene);

  let activeChapter = null;
  let activeSceneIndex = 0;
  let previousFocus = null;

  function refreshHub() {
    const completed = getCompleted();

    $("story-count").textContent =
      completed.size + " / 10 CASES SOLVED";

    const cleared = chapters.filter(chapter =>
      chapter.cases.every(id => completed.has(id))
    ).length;

    $("story-chapter-count").textContent =
      cleared + " / 4 CHAPTERS CLEARED";

    const list = $("story-chapters");
    list.innerHTML = "";

    chapters.forEach(chapter => {
      const unlocked =
        isChapterUnlocked(chapter, completed);

      const complete =
        chapter.cases.every(id => completed.has(id));

      const card = document.createElement("article");
      card.className =
        "story-chapter" +
        (complete ? " complete" : "") +
        (!unlocked ? " locked" : "");

      const label = document.createElement("div");
      label.className = "story-chapter-label";
      label.textContent =
        "CHAPTER " +
        String(chapter.number).padStart(2, "0") +
        (complete
          ? " · CLEARED"
          : unlocked
            ? " · AVAILABLE"
            : " · LOCKED");

      const title = document.createElement("h3");
      title.textContent = chapter.icon + " " + chapter.name;

      const description = document.createElement("p");
      description.textContent = chapter.description;

      const tags = document.createElement("div");
      tags.className = "story-case-list";

      chapter.cases.forEach(id => {
        const tag = document.createElement("span");
        tag.className = "story-case-tag";

        if (completed.has(id)) {
          tag.classList.add("solved");
          tag.textContent = "✓ " + caseLabel(id);
        } else {
          if (unlocked && (
            id === 1 || completed.has(id - 1)
          )) {
            tag.classList.add("next");
          }

          tag.textContent = "FILE " + caseLabel(id);
        }

        tags.appendChild(tag);
      });

      const button = document.createElement("button");
      button.type = "button";
      button.className = "story-button";

      button.textContent = complete
        ? "▶ REPLAY CHAPTER"
        : unlocked
          ? "▶ WATCH BRIEFING"
          : "🔒 CHAPTER LOCKED";

      button.disabled = !unlocked;

      button.addEventListener("click", () => {
        startChapter(chapter.number);
      });

      card.append(label, title, description, tags, button);
      list.appendChild(card);
    });
  }

  function openHub() {
    refreshHub();
    hub.hidden = false;
    hub.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function closeHub() {
    hub.hidden = true;
    dashboard.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  openButton.addEventListener("click", () => {
    if (hub.hidden) {
      openHub();
    } else {
      closeHub();
    }
  });

  $("story-close").addEventListener("click", closeHub);

  // ===================================
  // CUTSCENE LOGIC
  // ===================================

  function startChapter(number) {
    const chapter = chapters.find(
      item => item.number === number
    );

    if (!chapter) return;

    if (!isChapterUnlocked(chapter, getCompleted())) {
      return;
    }

    activeChapter = chapter;
    activeSceneIndex = 0;
    previousFocus = document.activeElement;

    cutscene.hidden = false;
    document.body.style.overflow = "hidden";

    renderScene();
    $("story-next").focus();
  }

  function renderScene() {
    if (!activeChapter) return;

    const scene =
      activeChapter.scenes[activeSceneIndex];

    $("story-counter").textContent =
      (activeSceneIndex + 1) +
      " / " + activeChapter.scenes.length;

    $("story-art").textContent = scene.icon;
    $("story-scene-title").textContent = scene.title;
    $("story-speaker").textContent = scene.speaker;

    $("story-dialogue").textContent =
      scene.text.replaceAll(
        "{name}",
        getPlayerName()
      );

    const last =
      activeSceneIndex ===
      activeChapter.scenes.length - 1;

    $("story-next").textContent = last
      ? "▶ OPEN CASE FILE"
      : "NEXT →";
  }

  function closeCutscene() {
    cutscene.hidden = true;
    document.body.style.overflow = "";
    activeChapter = null;

    if (
      previousFocus &&
      typeof previousFocus.focus === "function"
    ) {
      previousFocus.focus();
    }
  }

  function launchChapterCase() {
    if (!activeChapter) return;

    const completed = getCompleted();
    const caseId = getNextCase(
      activeChapter,
      completed
    );

    const chapterNumber = activeChapter.number;

    closeCutscene();

    // Launch the original game button.
    // This preserves existing case logic and scoring.
    const originalButton = $(
      "start-case" + caseId
    );

    if (
      originalButton &&
      !originalButton.disabled
    ) {
      originalButton.click();
      return;
    }

    // Fallback: show the case grid.
    // Some original cases may use different button IDs.
    hub.hidden = true;

    const grid = menu.querySelector(".case-grid");

    if (grid) {
      grid.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    console.info(
      "Story chapter " + chapterNumber +
      ": Select Case " + caseLabel(caseId) +
      " from the main menu."
    );
  }

  $("story-next").addEventListener("click", () => {
    if (!activeChapter) return;

    if (
      activeSceneIndex <
      activeChapter.scenes.length - 1
    ) {
      activeSceneIndex++;
      renderScene();
    } else {
      launchChapterCase();
    }
  });

  $("story-exit").addEventListener(
    "click",
    closeCutscene
  );

  document.addEventListener("keydown", event => {
    if (cutscene.hidden) return;

    if (event.key === "Escape") {
      closeCutscene();
    }

    if (
      event.key === "Tab" &&
      !cutscene.hidden
    ) {
      const buttons = [
        $("story-exit"),
        $("story-next")
      ];

      const first = buttons[0];
      const last = buttons[1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Refresh progress when returning to the menu.
  document.addEventListener("click", () => {
    if (!hub.hidden && cutscene.hidden) {
      refreshHub();
    }
  });

  window.addEventListener("storage", event => {
    if (event.key === PROGRESS_KEY) {
      refreshHub();
    }
  });

  window.addEventListener("pageshow", refreshHub);

  refreshHub();

  console.log(
    "Story Mode: The Ledger Conspiracy loaded."
  );
})();
