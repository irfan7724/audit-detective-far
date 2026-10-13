
"use strict";

/*
 AUDIT DETECTIVE — STORY MODE PART 2
 The Conspiracy Revealed

 Load after story.js.
 No changes to original case scoring or answers.
*/

(() => {
  const $ = id => document.getElementById(id);

  const PROGRESS = "auditDetectiveProgress";
  const PROFILE = "auditDetectivePlayerProfile";

  const dashboard = $("ad-dashboard");
  const storyHub = $("story-hub");
  const cutscene = $("story-cutscene");

  if (!dashboard || !storyHub || !cutscene) {
    console.warn("Story Part 2 requires Story Part 1.");
    return;
  }

  const files = [
    {
      id: 1,
      icon: "⚙️",
      name: "Depreciation",
      clue: "Recorded depreciation RM2,500; correct amount RM2,000.",
      finding: "Depreciation expense overstated by RM500, so profit was understated by RM500."
    },
    {
      id: 2,
      icon: "📦",
      name: "Inventory",
      clue: "Inventory cost RM8,000; net realisable value RM7,000.",
      finding: "Inventory and profit were overstated by RM1,000."
    },
    {
      id: 3,
      icon: "🏦",
      name: "Bank Balance",
      clue: "The bank reconciliation reveals a corrected balance.",
      finding: "The reconciled bank balance is RM9,900."
    },
    {
      id: 4,
      icon: "🧾",
      name: "Accruals",
      clue: "Electricity RM600 and cleaning RM400 remained unpaid.",
      finding: "Accrued expenses total RM1,000; profit was overstated by RM1,000."
    },
    {
      id: 5,
      icon: "🛡️",
      name: "Insurance",
      clue: "RM12,000 annual policy began on 1 July 2026.",
      finding: "RM6,000 was prepaid at year-end; expensing all RM12,000 understated profit by RM6,000."
    },
    {
      id: 6,
      icon: "📑",
      name: "Receivables",
      clue: "One RM2,000 receivable must be written off.",
      finding: "Remaining gross receivables RM18,000; 5% allowance RM900; net RM17,100."
    },
    {
      id: 7,
      icon: "🏭",
      name: "Equipment",
      clue: "Machine, installation, upgrade and repair invoices.",
      finding: "Capital expenditure RM20,000; revenue expenditure RM1,000."
    },
    {
      id: 8,
      icon: "🔐",
      name: "Loan Interest",
      clue: "RM60,000 loan at 8% for four months.",
      finding: "Accrued interest expense and payable: RM1,600."
    },
    {
      id: 9,
      icon: "🚚",
      name: "Suspicious Sale",
      clue: "RM18,000 sale recorded before January delivery and acceptance.",
      finding: "2026 revenue was overstated by RM18,000 and requires reversal."
    },
    {
      id: 10,
      icon: "⚖️",
      name: "Final Audit",
      clue: "Five critical profit misstatements must be combined.",
      finding: "Gross absolute misstatements RM26,500; net profit overstatement RM13,500."
    }
  ];

  function completedCases() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROGRESS)
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

  function playerName() {
    try {
      const data = JSON.parse(
        localStorage.getItem(PROFILE)
      );

      return typeof data?.name === "string" &&
        data.name.trim()
        ? data.name.trim().slice(0, 24)
        : "Detective";
    } catch {
      return "Detective";
    }
  }

  function label(id) {
    return String(id).padStart(3, "0");
  }

  function unlocked(id, completed) {
    return id === 1 || completed.has(id - 1);
  }

  // =====================================
  // TYPEWRITER ENGINE
  // =====================================

  let typingTimer = null;
  let fullText = "";
  let typingIndex = 0;
  let typingElement = null;
  let typingFinished = true;

  function stopTyping() {
    if (typingTimer !== null) {
      clearInterval(typingTimer);
      typingTimer = null;
    }
  }

  function typeText(element, text, speed = 17) {
    stopTyping();

    fullText = text;
    typingIndex = 0;
    typingElement = element;
    typingFinished = false;
    element.textContent = "";

    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      element.textContent = text;
      typingFinished = true;
      return;
    }

    typingTimer = setInterval(() => {
      typingIndex = Math.min(
        typingIndex + 2,
        fullText.length
      );

      element.textContent =
        fullText.slice(0, typingIndex);

      if (typingIndex >= fullText.length) {
        stopTyping();
        typingFinished = true;
      }
    }, speed);
  }

  function finishTyping() {
    if (typingFinished || !typingElement) return false;

    stopTyping();
    typingElement.textContent = fullText;
    typingFinished = true;
    return true;
  }

  // =====================================
  // ANIMATED CHARACTER DIALOGUE
  // =====================================

  const speakerIcons = {
    "NARRATOR": "🌃",
    "CHIEF INSPECTOR MAYA": "👩‍💼",
    "FINANCIAL ANALYST": "👨‍💻"
  };

  function enhanceStoryScene() {
    if (cutscene.hidden) {
      stopTyping();
      return;
    }

    const speaker = $("story-speaker");
    const art = $("story-art");
    const dialogue = $("story-dialogue");

    if (!speaker || !art || !dialogue) return;

    const name = speaker.textContent.trim();

    art.classList.add("s2-character");
    art.textContent = speakerIcons[name] || "🕵️";

    // Part 1 has already written the complete dialogue.
    // Animate it without changing the story content.
    const text = dialogue.textContent;

    if (text) {
      typeText(dialogue, text);
    }
  }

  const sceneTitle = $("story-scene-title");

  if (sceneTitle) {
    const sceneObserver = new MutationObserver(() => {
      if (!cutscene.hidden) {
        enhanceStoryScene();
      }
    });

    sceneObserver.observe(sceneTitle, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  $("story-next")?.addEventListener(
    "click",
    event => {
      if (!typingFinished) {
        event.stopImmediatePropagation();
        finishTyping();
      }
    },
    true
  );

  $("story-exit")?.addEventListener(
    "click",
    stopTyping
  );

  // =====================================
  // INTERACTIVE EVIDENCE BOARD
  // =====================================

  const board = document.createElement("section");
  board.id = "s2-board";
  board.hidden = true;

  board.innerHTML = `
    <div class="s2-kicker">
      ◈ FINANCIAL INTELLIGENCE UNIT
    </div>

    <h2 class="s2-title">
      🧩 THE EVIDENCE BOARD
    </h2>

    <p class="s2-subtitle">
      Ten connected case files. Inspect the evidence
      and trace the accounting discrepancies.
      Findings are revealed only after the
      corresponding case is completed.
    </p>

    <div id="s2-board-count"
      class="s2-kicker"></div>

    <div id="s2-board-grid"
      class="s2-board-grid"></div>

    <div id="s2-detail"
      class="s2-detail"
      hidden>
      <h3 id="s2-detail-title"></h3>
      <p id="s2-detail-clue"></p>
      <p id="s2-detail-finding"></p>

      <div class="s2-actions">
        <button id="s2-open-case"
          class="s2-button"
          type="button">
          ▶ OPEN ORIGINAL CASE
        </button>

        <button id="s2-close-detail"
          class="s2-button alt"
          type="button">
          CLOSE FILE
        </button>
      </div>
    </div>

    <div class="s2-actions">
      <button id="s2-close-board"
        class="s2-button alt"
        type="button">
        ← CLOSE EVIDENCE BOARD
      </button>

      <button id="s2-watch-ending"
        class="s2-button"
        type="button">
        🏆 WATCH FINAL ENDING
      </button>
    </div>
  `;

  storyHub.insertAdjacentElement("afterend", board);

  const boardButton = document.createElement("button");
  boardButton.className = "story-button";
  boardButton.type = "button";
  boardButton.textContent = "🧩 OPEN EVIDENCE BOARD";

  const storyActions =
    storyHub.querySelector(".story-hub-actions");

  if (storyActions) {
    storyActions.appendChild(boardButton);
  } else {
    storyHub.appendChild(boardButton);
  }

  let selectedFile = null;

  function renderBoard() {
    const completed = completedCases();
    const grid = $("s2-board-grid");

    $("s2-board-count").textContent =
      completed.size + " / 10 FILES RESOLVED";

    grid.innerHTML = "";

    files.forEach(file => {
      const solved = completed.has(file.id);
      const available = unlocked(file.id, completed);

      const button = document.createElement("button");
      button.type = "button";
      button.className =
        "s2-file" +
        (solved ? " solved" : "") +
        (!available ? " locked" : "");

      const icon = document.createElement("span");
      icon.className = "s2-file-icon";
      icon.textContent = solved
        ? "✅"
        : available
          ? file.icon
          : "🔒";

      const number = document.createElement("span");
      number.className = "s2-file-number";
      number.textContent = "FILE " + label(file.id);

      const name = document.createElement("span");
      name.className = "s2-file-name";
      name.textContent = file.name;

      const state = document.createElement("span");
      state.className = "s2-file-state";
      state.textContent = solved
        ? "RESOLVED"
        : available
          ? "AVAILABLE"
          : "LOCKED";

      button.append(icon, number, name, state);

      button.addEventListener("click", () => {
        showFile(file);
      });

      grid.appendChild(button);
    });

    $("s2-watch-ending").disabled =
      !completed.has(10);
  }

  function showFile(file) {
    selectedFile = file;

    const completed = completedCases();
    const solved = completed.has(file.id);
    const available = unlocked(file.id, completed);

    $("s2-detail").hidden = false;

    $("s2-detail-title").textContent =
      "FILE " + label(file.id) + " — " + file.name;

    $("s2-detail-clue").textContent = !available
      ? "CLASSIFIED: Complete the previous case to unlock."
      : file.clue;

    $("s2-detail-finding").textContent = solved
      ? "INVESTIGATION FINDING: " + file.finding
      : "FINDING SEALED: Solve this case to reveal the conclusion.";

    $("s2-open-case").disabled = !available;

    $("s2-detail").scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function openBoard() {
  // Always refresh the evidence using latest progress
  renderBoard();

  // Reset old evidence detail
  $("s2-detail").hidden = true;
  selectedFile = null;

  // Show the board
  board.hidden = false;

  // Scroll only if board is visible on the page
  if (board.getClientRects().length > 0) {
    board.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

// Allow other files to open and refresh Evidence Board
window.auditDetectiveOpenBoard = openBoard;

boardButton.addEventListener("click", () => {
  // If Game Lobby navigation is available,
  // open Evidence Board as a proper lobby page.
  if (typeof window.auditDetectiveShowPage === "function") {
    window.auditDetectiveShowPage("evidence");
    return;
  }

  // Fallback for the original Story Mode
  if (board.hidden) {
    openBoard();
  } else {
    board.hidden = true;
  }
});

  $("s2-close-board").addEventListener("click", () => {
    board.hidden = true;
    $("story-hub").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  $("s2-close-detail").addEventListener("click", () => {
    $("s2-detail").hidden = true;
  });

  $("s2-open-case").addEventListener("click", () => {
    if (!selectedFile) return;

    const id = selectedFile.id;
    const completed = completedCases();

    if (!unlocked(id, completed)) return;

    const button = $("start-case" + id);

    if (button && !button.disabled) {
      board.hidden = true;
      storyHub.hidden = true;
      button.click();
    } else {
      $("s2-detail-finding").textContent =
        "Please select Case " + label(id) +
        " from the main menu.";
    }
  });

  // =====================================
  // CINEMATIC FINAL ENDING
  // =====================================

  const ending = document.createElement("div");
  ending.id = "s2-ending";
  ending.hidden = true;
  ending.setAttribute("role", "dialog");
  ending.setAttribute("aria-modal", "true");
  ending.setAttribute(
    "aria-label",
    "The Ledger Conspiracy final ending"
  );

  ending.innerHTML = `
    <div class="s2-ending-card">
      <div class="s2-kicker">
        ◈ THE LEDGER CONSPIRACY
      </div>

      <div id="s2-ending-art"
        class="s2-ending-art">🌃</div>

      <h2 id="s2-ending-title"
        class="s2-ending-heading"></h2>

      <div id="s2-ending-speaker"
        class="s2-ending-speaker"></div>

      <div id="s2-ending-dialogue"
        class="s2-ending-dialogue"></div>

      <div id="s2-final-stat"
        class="s2-final-stat"
        hidden></div>

      <div id="s2-ending-progress"
        class="s2-ending-progress"></div>

      <div class="s2-actions"
        style="justify-content:center">
        <button id="s2-ending-exit"
          class="s2-button alt"
          type="button">
          ✕ EXIT
        </button>

        <button id="s2-ending-next"
          class="s2-button"
          type="button">
          CONTINUE →
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(ending);

  const endingScenes = [
    {
      icon: "🌃",
      title: "THE FINAL NIGHT",
      speaker: "NARRATOR",
      text:
        "The investigation room is silent. Ten case files lie on the table. Every calculation has been reviewed, and the final report is ready."
    },
    {
      icon: "👩‍💼",
      title: "THE CHIEF'S VERDICT",
      speaker: "CHIEF INSPECTOR MAYA",
      text:
        "Detective {name}, you followed the evidence from the first depreciation error to the final revenue recognition issue. You have completed the investigation."
    },
    {
      icon: "📊",
      title: "THE FINANCIAL TRUTH",
      speaker: "FINANCIAL ANALYST",
      text:
        "The five critical profit errors examined in the final audit total RM26,500 in gross absolute misstatements. Their combined net effect is a RM13,500 overstatement of profit."
    },
    {
      icon: "⚖️",
      title: "THE CONCLUSION",
      speaker: "CHIEF INSPECTOR MAYA",
      text:
        "The financial statements require the appropriate accounting adjustments and reassessment. The discrepancies have been identified, but the evidence alone does not establish deliberate fraud."
    },
    {
      icon: "🏆",
      title: "LEGENDARY DETECTIVE",
      speaker: "FINANCIAL INVESTIGATION DIVISION",
      text:
        "Congratulations, Detective {name}! All ten investigations are complete. You have earned the title Legendary Audit Detective."
    }
  ];

  let endingIndex = 0;
  let endingOpen = false;
  let endingPreviousFocus = null;

  function renderEnding() {
    const scene = endingScenes[endingIndex];

    $("s2-ending-art").textContent = scene.icon;
    $("s2-ending-title").textContent = scene.title;
    $("s2-ending-speaker").textContent = scene.speaker;

    const text = scene.text.replaceAll(
      "{name}",
      playerName()
    );

    typeText($("s2-ending-dialogue"), text, 19);

    const dots = $("s2-ending-progress");
    dots.innerHTML = "";

    endingScenes.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className =
        "s2-ending-dot" +
        (i === endingIndex ? " active" : "");
      dots.appendChild(dot);
    });

    const last =
      endingIndex === endingScenes.length - 1;

    $("s2-final-stat").hidden = !last;

    if (last) {
      $("s2-final-stat").textContent =
        "10 / 10 CASES COMPLETED · 1,000 XP · " +
        "LEGENDARY AUDIT DETECTIVE";
    }

    $("s2-ending-next").textContent = last
      ? "🏆 FINISH STORY"
      : "CONTINUE →";
  }

  function startEnding() {
    if (!completedCases().has(10)) return;

    endingPreviousFocus = document.activeElement;
    endingIndex = 0;
    endingOpen = true;
    ending.hidden = false;

    renderEnding();
    $("s2-ending-next").focus();
  }

  function closeEnding() {
    stopTyping();
    endingOpen = false;
    ending.hidden = true;

    if (
      endingPreviousFocus &&
      typeof endingPreviousFocus.focus === "function"
    ) {
      endingPreviousFocus.focus();
    }
  }

  $("s2-watch-ending").addEventListener(
    "click",
    startEnding
  );

  $("s2-ending-next").addEventListener("click", () => {
    if (finishTyping()) return;

    if (endingIndex < endingScenes.length - 1) {
      endingIndex++;
      renderEnding();
    } else {
      closeEnding();
    }
  });

  $("s2-ending-exit").addEventListener(
    "click",
    closeEnding
  );

  document.addEventListener("keydown", event => {
    if (!endingOpen) return;

    if (event.key === "Escape") {
      closeEnding();
    }

    if (event.key === "Tab") {
      const first = $("s2-ending-exit");
      const last = $("s2-ending-next");

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

  window.addEventListener("storage", event => {
    if (event.key === PROGRESS && !board.hidden) {
      renderBoard();
    }
  });

  window.addEventListener("pageshow", () => {
    if (!board.hidden) renderBoard();
  });

  renderBoard();

  console.log(
    "Story Mode Part 2 — The Conspiracy Revealed ready."
  );
})();
