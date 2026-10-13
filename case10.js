
"use strict";

/*
 AUDIT DETECTIVE — FAR EDITION
 CASE 010: THE FINAL AUDIT
 FINAL BOSS — COMPLETE STANDALONE EXPANSION

 Load after script.js, case7.js, case8.js, case9.js.
*/

(() => {
  const $ = id => document.getElementById(id);
  const STORAGE = "auditDetectiveProgress";

  const missions = [
    {
      id: "ALPHA",
      icon: "⚙️",
      name: "DEPRECIATION ANOMALY",
      category: "IAS 16 / MFRS 116",
      severity: "MEDIUM",
      color: "#ffcc67",
      evidence:
        "A machine costs RM10,000, has a five-year useful life and zero residual value. The accountant recorded RM2,500 depreciation for the year.",
      question: "What is the correct depreciation expense?",
      choices: [
        "RM2,500 — No adjustment",
        "RM2,000 — Reduce expense by RM500",
        "RM1,500 — Reduce expense by RM1,000"
      ],
      answer: 1,
      impact: -500,
      adjustment:
        "Dr Accumulated Depreciation RM500; Cr Depreciation Expense RM500.",
      explanation:
        "RM10,000 ÷ 5 years = RM2,000. Recorded expense is RM500 too high, so reported profit is RM500 too low."
    },
    {
      id: "BRAVO",
      icon: "📦",
      name: "INVENTORY DISTORTION",
      category: "IAS 2 / MFRS 102",
      severity: "HIGH",
      color: "#ff8a69",
      evidence:
        "Closing inventory is carried at RM8,000. Its estimated selling price is RM7,500 and selling costs are RM500. There is no opening inventory adjustment.",
      question: "At what amount should this inventory be measured?",
      choices: [
        "RM8,000 — Historical cost",
        "RM7,500 — Selling price",
        "RM7,000 — Net realisable value"
      ],
      answer: 2,
      impact: 1000,
      adjustment:
        "Dr Inventory Write-down Expense RM1,000; Cr Inventory RM1,000.",
      explanation:
        "NRV = RM7,500 − RM500 = RM7,000. Inventory is overstated by RM1,000, and profit is overstated by RM1,000."
    },
    {
      id: "CHARLIE",
      icon: "🧾",
      name: "MISSING ACCRUAL",
      category: "ACCRUAL ACCOUNTING",
      severity: "HIGH",
      color: "#ff8a69",
      evidence:
        "December electricity of RM600 and December cleaning services of RM400 were received but have not been recorded or paid by 31 December 2026.",
      question: "Which year-end adjustment is correct?",
      choices: [
        "Dr Expenses RM1,000; Cr Accrued Liabilities RM1,000",
        "Dr Accrued Liabilities RM1,000; Cr Expenses RM1,000",
        "No entry until cash is paid"
      ],
      answer: 0,
      impact: 1000,
      adjustment:
        "Dr Operating Expenses RM1,000; Cr Accrued Liabilities RM1,000.",
      explanation:
        "Services were consumed in December. Omitting the RM1,000 expense causes profit to be overstated by RM1,000."
    },
    {
      id: "DELTA",
      icon: "🛡️",
      name: "PREPAYMENT TRAP",
      category: "PREPAID EXPENSES",
      severity: "CRITICAL",
      color: "#ff5679",
      evidence:
        "On 1 July 2026 the company paid RM12,000 for 12 months of insurance through 30 June 2027. The entire amount was expensed in 2026.",
      question: "What amount must be recognised as prepaid insurance at 31 December 2026?",
      choices: [
        "RM12,000",
        "RM6,000",
        "RM0"
      ],
      answer: 1,
      impact: -6000,
      adjustment:
        "Dr Prepaid Insurance RM6,000; Cr Insurance Expense RM6,000.",
      explanation:
        "Six months relate to 2027. Expense was overstated by RM6,000, so profit was understated by RM6,000."
    },
    {
      id: "ECHO",
      icon: "🚚",
      name: "PREMATURE REVENUE",
      category: "IFRS 15 / MFRS 15",
      severity: "CRITICAL",
      color: "#ff5679",
      evidence:
        "The company recorded a RM18,000 credit sale on 29 December 2026. The goods remained with the seller at year-end. Contractual control transferred only upon customer acceptance on 5 January 2027.",
      question: "How should the 2026 credit sale be corrected?",
      choices: [
        "Keep the RM18,000 revenue because an invoice exists",
        "Recognise RM9,000 revenue in each financial year",
        "Reverse RM18,000 revenue and the related receivable"
      ],
      answer: 2,
      impact: 18000,
      adjustment:
        "Dr Sales Revenue RM18,000; Cr Trade Receivables RM18,000.",
      explanation:
        "Control did not transfer until January 2027. The RM18,000 recorded revenue causes 2026 profit to be overstated by RM18,000."
    }
  ];

  const state = {
    phase: 0,
    solved: new Set(),
    active: null,
    wrong: 0,
    gate: "",
    verdict: "",
    finished: false
  };

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE));
      return new Set(
        Array.isArray(saved?.completed)
          ? saved.completed.filter(Number.isInteger)
          : []
      );
    } catch {
      return new Set();
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(
        STORAGE,
        JSON.stringify({
          completed: [...progress].sort((a, b) => a - b)
        })
      );
    } catch (error) {
      console.warn("Progress could not be saved:", error);
    }
  }

  function money(n) {
    return "RM" + Math.abs(n).toLocaleString("en-MY");
  }

  const css = document.createElement("style");
  css.textContent = `
    /* CASE 010 — EXCLUSIVE FINAL BOSS VISUAL SYSTEM */

    #case10-screen,
    #case10-screen * {
      box-sizing: border-box;
    }

    #case10-screen[hidden],
    #case10-screen [hidden] {
      display: none !important;
    }

    #case10-screen {
      --c10-bg: #08090e;
      --c10-red: #ff4569;
      --c10-cyan: #4de8ff;
      --c10-gold: #ffd58a;
      --c10-line: rgba(122,175,202,.22);
      background: #08090e;
      color: #f2f5fc;
      min-height: 100vh;
      padding: 0;
      margin: 10px 0 30px;
      border: 1px solid #4b2939;
      border-radius: 16px;
      overflow: hidden;
      position: relative;
      isolation: isolate;
      font-family: system-ui, -apple-system, sans-serif;
    }

    #case10-screen::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(rgba(77,232,255,.025) 1px,transparent 1px),
        linear-gradient(90deg,rgba(77,232,255,.025) 1px,transparent 1px);
      background-size: 34px 34px;
      pointer-events: none;
      z-index: -1;
    }

    .c10-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #10121b;
      border-bottom: 1px solid #5d3548;
      padding: 14px 22px;
      flex-wrap: wrap;
    }

    .c10-brand {
      color: #ffd58a;
      font-size: 11px;
      letter-spacing: 2px;
      font-weight: 900;
    }

    .c10-live {
      color: #ff6785;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1.5px;
      animation: c10blink 1.8s infinite;
    }

    @keyframes c10blink {
      50% { opacity: .35; }
    }

    .c10-main {
      padding: clamp(16px, 4vw, 34px);
    }

    .c10-hero {
      position: relative;
      overflow: hidden;
      min-height: 300px;
      border: 1px solid #66384c;
      background:
        radial-gradient(circle at 80% 50%,rgba(255,69,105,.2),transparent 38%),
        radial-gradient(circle at 15% 15%,rgba(77,232,255,.09),transparent 45%),
        linear-gradient(135deg,#1c1722,#090b12);
      padding: clamp(24px, 5vw, 48px);
      border-radius: 5px;
    }

    .c10-eyebrow {
      color: #4de8ff;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 3px;
    }

    .c10-hero h2 {
      font-size: clamp(38px, 8vw, 86px);
      line-height: .95;
      letter-spacing: -2px;
      margin: 22px 0;
      color: white;
      text-shadow: 0 0 30px rgba(255,69,105,.17);
    }

    .c10-hero h2 em {
      font-style: normal;
      color: #ff4569;
    }

    .c10-hero p {
      max-width: 580px;
      line-height: 1.8;
      color: #bac3d3;
      font-size: 14px;
    }

    .c10-stamp {
      display: inline-block;
      border: 2px solid #ff4569;
      color: #ff6685;
      padding: 8px 14px;
      transform: rotate(-5deg);
      font-weight: 900;
      letter-spacing: 3px;
      font-size: 11px;
      margin: 15px 0;
    }

    .c10-scanner {
      height: 6px;
      background: #22232e;
      overflow: hidden;
      margin: 22px 0;
      border-radius: 20px;
    }

    .c10-scanner > div {
      width: 35%;
      height: 100%;
      background: linear-gradient(90deg,transparent,#4de8ff,transparent);
      animation: c10scan 2.6s linear infinite;
    }

    @keyframes c10scan {
      from { transform: translateX(-120%); }
      to { transform: translateX(360%); }
    }

    .c10-panel {
      border: 1px solid #34404f;
      background: rgba(17,21,31,.94);
      padding: clamp(18px, 4vw, 30px);
      margin-top: 22px;
      position: relative;
    }

    .c10-panel::before {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      width: 40px;
      height: 3px;
      background: #4de8ff;
    }

    .c10-title {
      color: #fff;
      font-size: clamp(22px, 4vw, 32px);
      font-weight: 900;
      margin: 8px 0 12px;
      letter-spacing: -.6px;
    }

    .c10-subtitle {
      color: #aebccc;
      line-height: 1.8;
      font-size: 13px;
    }

    .c10-mono {
      font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
      letter-spacing: 1px;
      font-size: 11px;
      color: #4de8ff;
    }

    .c10-stats {
      display: grid;
      grid-template-columns: repeat(3,minmax(0,1fr));
      gap: 10px;
      margin: 20px 0;
    }

    .c10-stat {
      padding: 18px 12px;
      border: 1px solid #36414e;
      background: #101722;
      min-width: 0;
    }

    .c10-stat span {
      display: block;
      font-size: 10px;
      letter-spacing: 1px;
      color: #8c9bad;
      margin-bottom: 9px;
    }

    .c10-stat strong {
      display: block;
      color: #fff;
      font-size: clamp(17px,3vw,27px);
      overflow-wrap: anywhere;
    }

    .c10-danger {
      color: #ff5c79 !important;
    }

    .c10-cyan {
      color: #4de8ff !important;
    }

    .c10-gold-text {
      color: #ffd58a !important;
    }

    #case10-screen button {
      border: 0;
      cursor: pointer;
      font-family: inherit;
      font-weight: 900;
      transition: transform .15s,filter .15s;
    }

    #case10-screen button:hover:not(:disabled) {
      transform: translateY(-2px);
      filter: brightness(1.13);
    }

    #case10-screen button:disabled {
      cursor: not-allowed;
      opacity: .45;
    }

    .c10-button {
      display: block;
      width: 100%;
      padding: 16px;
      background: #ff4569;
      color: #100b12;
      font-size: 12px;
      letter-spacing: 1px;
      text-align: center;
      margin-top: 16px;
      border-radius: 3px;
    }

    .c10-button.alt {
      background: #4de8ff;
      color: #081219;
    }

    .c10-button.gold {
      background: #ffd58a;
      color: #211707;
    }

    .c10-back {
      padding: 13px 16px;
      background: #242a36;
      color: #e9effb;
      margin: 20px 0 0;
      border: 1px solid #495466 !important;
      border-radius: 3px;
    }

    .c10-code {
      width: 100%;
      padding: 17px;
      background: #070e17;
      color: #4de8ff;
      border: 1px solid #3b6876;
      border-radius: 3px;
      font-family: ui-monospace,Consolas,monospace;
      font-size: 25px;
      letter-spacing: 5px;
      text-align: center;
      margin: 16px 0 4px;
    }

    .c10-code:focus,
    .c10-answer:focus {
      outline: 2px solid #4de8ff;
    }

    .c10-feedback {
      padding: 12px 0;
      font-size: 13px;
      line-height: 1.7;
      min-height: 28px;
      font-weight: 700;
    }

    .c10-error { color: #ff8ca0; }
    .c10-success { color: #6bffbf; }

    .c10-command {
      display: grid;
      grid-template-columns: minmax(0,1fr) minmax(0,1fr);
      gap: 14px;
      margin: 18px 0;
    }

    .c10-radar {
      min-height: 220px;
      border: 1px solid #28616e;
      background:
        repeating-radial-gradient(circle at center,
          transparent 0 24px,
          rgba(77,232,255,.11) 25px 26px),
        radial-gradient(circle,#10313a,#0a121c 75%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .c10-radar::after {
      content: "";
      position: absolute;
      width: 55%;
      height: 55%;
      background: conic-gradient(
        from 0deg,transparent 0deg,
        rgba(77,232,255,.25) 75deg,transparent 90deg);
      border-radius: 50%;
      animation: c10rotate 5s linear infinite;
    }

    @keyframes c10rotate {
      to { transform: rotate(360deg); }
    }

    .c10-radar-center {
      font-size: 65px;
      z-index: 1;
      filter: drop-shadow(0 0 20px #4de8ff);
    }

    .c10-threat {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 22px;
      background: #170e19;
      border: 1px solid #673144;
    }

    .c10-threat strong {
      font-size: clamp(36px,6vw,64px);
      color: #ff4569;
      line-height: 1.2;
    }

    .c10-threat small {
      color: #d0a8b1;
      letter-spacing: 2px;
      font-size: 10px;
    }

    .c10-meter {
      height: 13px;
      background: #34242c;
      margin: 18px 0;
      overflow: hidden;
      border: 1px solid #65434b;
    }

    .c10-meter > div {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,#ff9a52,#ff4569);
      transition: width .6s ease;
    }

    .c10-files {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 12px;
      margin: 22px 0;
    }

    .c10-file {
      background: #121b27;
      border: 1px solid #384f60 !important;
      padding: 22px 17px;
      text-align: left;
      color: #e9f4ff;
      min-height: 180px;
      position: relative;
      overflow: hidden;
      border-radius: 2px;
    }

    .c10-file::after {
      content: "";
      position: absolute;
      width: 70px;
      height: 70px;
      right: -25px;
      top: -25px;
      transform: rotate(45deg);
      background: rgba(255,69,105,.13);
    }

    .c10-file.done {
      border-color: #3cbb8a !important;
      background: #10251f;
    }

    .c10-file-icon {
      font-size: 38px;
      margin: 10px 0;
    }

    .c10-file h4 {
      color: #fff;
      font-size: 14px;
      margin: 12px 0 8px;
      letter-spacing: .3px;
    }

    .c10-file small {
      color: #9caec0;
      font-size: 10px;
    }

    .c10-file-state {
      display: block;
      color: #ff8b9f;
      font-size: 10px;
      margin-top: 12px;
      font-weight: 900;
      letter-spacing: 1px;
    }

    .c10-file.done .c10-file-state {
      color: #6bffbf;
    }

    .c10-evidence {
      background: #101c27;
      border-left: 3px solid #4de8ff;
      padding: 20px;
      line-height: 1.85;
      color: #e0e9f4;
      margin: 18px 0;
      font-size: 14px;
    }

    .c10-choices {
      display: grid;
      gap: 11px;
      margin: 20px 0;
    }

    .c10-choice {
      display: flex;
      align-items: center;
      gap: 13px;
      text-align: left;
      width: 100%;
      min-height: 70px;
      padding: 16px;
      color: #e8f3ff;
      background: #1c2634;
      border: 1px solid #465a6f !important;
      line-height: 1.6;
      border-radius: 2px;
    }

    .c10-choice.selected {
      border-color: #4de8ff !important;
      background: #173542;
      box-shadow: inset 3px 0 #4de8ff;
    }

    .c10-choice .letter {
      display: grid;
      place-items: center;
      min-width: 32px;
      height: 32px;
      background: #314558;
      color: #4de8ff;
      font-family: ui-monospace,monospace;
    }

    .c10-ledger {
      border: 1px solid #38515d;
      margin: 20px 0;
      overflow: hidden;
    }

    .c10-ledger-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 14px;
      padding: 13px 15px;
      border-bottom: 1px solid #273c49;
      font-size: 12px;
      line-height: 1.5;
      align-items: center;
    }

    .c10-ledger-row:last-child {
      border-bottom: 0;
    }

    .c10-ledger-row:nth-child(odd) {
      background: #101e28;
    }

    .c10-ledger-row strong {
      color: #ffd58a;
      white-space: nowrap;
    }

    .c10-label {
      display: block;
      font-size: 12px;
      font-weight: 800;
      color: #dce9f6;
      margin: 20px 0 8px;
    }

    .c10-answer {
      width: 100%;
      padding: 15px;
      background: #090f19;
      border: 1px solid #4a687a;
      color: white;
      font-size: 20px;
      border-radius: 2px;
    }

    .c10-epilogue {
      text-align: center;
      padding: clamp(24px,5vw,55px);
      background:
        radial-gradient(circle at 50% 20%,rgba(255,213,138,.18),transparent 50%),
        linear-gradient(#19170f,#0b0d13);
      border: 1px solid #a9894e;
      margin: 22px 0;
      position: relative;
      overflow: hidden;
    }

    .c10-medal {
      font-size: clamp(75px,15vw,140px);
      animation: c10float 3s ease-in-out infinite;
      filter: drop-shadow(0 0 26px rgba(255,213,138,.5));
    }

    @keyframes c10float {
      50% { transform: translateY(-12px) scale(1.05); }
    }

    .c10-epilogue h2 {
      font-size: clamp(32px,7vw,68px);
      color: #ffd58a;
      line-height: 1;
      margin: 22px 0;
    }

    .c10-epilogue p {
      line-height: 1.9;
      color: #e0d6c2;
    }

    .c10-certificate {
      border: 3px double #c6a565;
      padding: 25px 15px;
      margin: 25px 0;
      background: rgba(255,213,138,.06);
    }

    .c10-certificate h3 {
      color: #ffd58a;
      letter-spacing: 2px;
      font-size: clamp(19px,4vw,29px);
    }

    .c10-certificate small {
      color: #c8b68d;
      letter-spacing: 2px;
    }

    .c10-particles {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .c10-particle {
      position: absolute;
      top: -20px;
      font-size: 19px;
      animation: c10fall linear infinite;
    }

    @keyframes c10fall {
      to { transform: translateY(900px) rotate(540deg); }
    }

    @media (max-width: 650px) {
      .c10-command,
      .c10-files {
        grid-template-columns: 1fr;
      }

      .c10-stats {
        grid-template-columns: 1fr 1fr;
      }

      .c10-hero {
        min-height: 260px;
      }

      .c10-radar {
        min-height: 170px;
      }
    }

    @media (max-width: 420px) {
      .c10-stats {
        grid-template-columns: 1fr;
      }

      .c10-top {
        padding: 12px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #case10-screen *,
      #case10-screen *::before,
      #case10-screen *::after {
        animation: none !important;
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(css);

  const grid = document.querySelector(".case-grid");
  const container = document.querySelector(".game-container");

  if (!grid || !container) {
    console.error("CASE 010: Main game elements not found.");
    return;
  }

  // CREATE FINAL BOSS CASE CARD
  const card = document.createElement("div");
  card.className = "case-card";
  card.innerHTML = `
    <span class="case-number">CASE 010 · FINAL BOSS</span>
    <h3>THE FINAL AUDIT</h3>
    <p>Five Critical Files · Ultimate FAR Investigation</p>
    <span id="case10-status">LOCKED 🔒</span>
    <button id="start-case10" disabled>LOCKED 🔒</button>
  `;
  grid.appendChild(card);

  const screen = document.createElement("section");
  screen.id = "case10-screen";
  screen.hidden = true;

  screen.innerHTML = `
    <div class="c10-top">
      <span class="c10-brand">◈ A.D. / BLACKSITE COMMAND</span>
      <span class="c10-live">● LEVEL 10 · MAXIMUM THREAT</span>
    </div>

    <div class="c10-main">
      <div class="c10-hero">
        <div class="c10-eyebrow">
          OPERATION 010 / FINAL ASSIGNMENT
        </div>
        <h2>THE<br><em>FINAL</em><br>AUDIT.</h2>
        <div class="c10-stamp">TOP SECRET · LEVEL 10</div>
        <p>
          The company's financial statements contain five
          critical anomalies. You are the last investigator
          authorised to uncover the truth before the
          financial statements are finalised.
        </p>
        <div class="c10-scanner"><div></div></div>
      </div>

      <!-- PHASE 1 -->
      <section id="c10-phase1" class="c10-panel">
        <div class="c10-mono">PHASE 01 / SECURITY BREACH</div>
        <h3 class="c10-title">ACCESS DENIED.</h3>
        <p class="c10-subtitle">
          The audit command center requires a four-digit
          clearance code. Solve the clues to unlock the vault.
        </p>

        <div class="c10-stats">
          <div class="c10-stat">
            <span>COMPLETED CASES BEFORE FINAL</span>
            <strong>09</strong>
          </div>
          <div class="c10-stat">
            <span>CRITICAL FILES</span>
            <strong>05</strong>
          </div>
          <div class="c10-stat">
            <span>FINAL CASE NUMBER</span>
            <strong>10</strong>
          </div>
        </div>

        <p class="c10-mono">
          SECURITY CODE = [CASES COMPLETED: 2 DIGITS]
          + [CRITICAL FILES: 2 DIGITS]
        </p>

        <label class="c10-label" for="c10-code">
          ENTER SECURITY CLEARANCE CODE
        </label>
        <input
          id="c10-code"
          class="c10-code"
          type="text"
          inputmode="numeric"
          maxlength="4"
          autocomplete="off"
          placeholder="••••"
        >

        <button id="c10-unlock" class="c10-button">
          ⛓ BREACH SECURITY SYSTEM
        </button>

        <div id="c10-gate-feedback"
          class="c10-feedback" aria-live="polite"></div>
      </section>

      <!-- PHASE 2 -->
      <section id="c10-phase2" class="c10-panel" hidden>
        <div class="c10-mono">PHASE 02 / COMMAND CENTER ONLINE</div>
        <h3 class="c10-title">FINANCIAL THREAT DETECTED.</h3>
        <p class="c10-subtitle">
          Open each critical file and identify the correct
          accounting treatment. Every resolved file reduces
          the financial threat level.
        </p>

        <div class="c10-command">
          <div class="c10-radar">
            <div class="c10-radar-center">◉</div>
          </div>
          <div class="c10-threat">
            <small>ACTIVE FINANCIAL THREAT</small>
            <strong id="c10-threat-value">100%</strong>
            <div class="c10-meter">
              <div id="c10-threat-fill"></div>
            </div>
            <small id="c10-threat-status">
              5 CRITICAL FILES UNRESOLVED
            </small>
          </div>
        </div>

        <div class="c10-stats">
          <div class="c10-stat">
            <span>FILES RESOLVED</span>
            <strong id="c10-resolved">0 / 5</strong>
          </div>
          <div class="c10-stat">
            <span>INVESTIGATION STATUS</span>
            <strong id="c10-investigation-status"
              class="c10-danger">ACTIVE</strong>
          </div>
          <div class="c10-stat">
            <span>MISSION REWARD</span>
            <strong class="c10-gold-text">+100 XP</strong>
          </div>
        </div>

        <div id="c10-files" class="c10-files"></div>

        <button id="c10-to-verdict"
          class="c10-button alt" disabled>
          ACCESS FINAL VERDICT CHAMBER →
        </button>
      </section>

      <!-- MISSION DETAIL -->
      <section id="c10-mission" class="c10-panel" hidden>
        <div class="c10-mono" id="c10-mission-code"></div>
        <h3 class="c10-title" id="c10-mission-name"></h3>
        <p class="c10-subtitle" id="c10-mission-category"></p>

        <div class="c10-evidence" id="c10-mission-evidence"></div>

        <h4 id="c10-mission-question"
          style="color:#ffd58a;line-height:1.7"></h4>

        <div id="c10-choices" class="c10-choices"></div>

        <button id="c10-submit-mission"
          class="c10-button" disabled>
          VERIFY AUDIT FINDING
        </button>

        <div id="c10-mission-feedback"
          class="c10-feedback" aria-live="polite"></div>

        <button id="c10-close-mission"
          class="c10-button alt" hidden>
          RETURN TO COMMAND CENTER →
        </button>

        <button id="c10-cancel-mission" class="c10-back">
          ← BACK TO COMMAND CENTER
        </button>
      </section>

      <!-- PHASE 3 -->
      <section id="c10-phase3" class="c10-panel" hidden>
        <div class="c10-mono">PHASE 03 / FINAL VERDICT CHAMBER</div>
        <h3 class="c10-title">THE TRUTH IS IN THE NUMBERS.</h3>
        <p class="c10-subtitle">
          All five financial anomalies have been identified.
          Complete the consolidated audit assessment.
        </p>

        <div class="c10-ledger" id="c10-ledger"></div>

        <div class="c10-evidence">
          <strong>IMPORTANT AUDIT RULE</strong>
          <p>
            Gross misstatement = sum of absolute values of
            the five individual profit misstatements.
          </p>
          <p>
            Net profit misstatement = profit overstatements
            minus profit understatements.
          </p>
        </div>

        <label class="c10-label" for="c10-gross">
          01 / TOTAL GROSS MISSTATEMENT (RM)
        </label>
        <input id="c10-gross" class="c10-answer"
          type="number" min="0" step="0.01"
          placeholder="Enter gross misstatement">

        <label class="c10-label" for="c10-net">
          02 / NET PROFIT MISSTATEMENT (RM)
        </label>
        <input id="c10-net" class="c10-answer"
          type="number" min="0" step="0.01"
          placeholder="Enter net amount">

        <h4 style="color:#ffd58a;margin-top:26px">
          03 / IS REPORTED PROFIT OVERSTATED OR UNDERSTATED?
        </h4>

        <div class="c10-choices" id="c10-direction">
          <button class="c10-choice" data-direction="over">
            <span class="letter">A</span>
            OVERSTATED
          </button>
          <button class="c10-choice" data-direction="under">
            <span class="letter">B</span>
            UNDERSTATED
          </button>
        </div>

        <h4 style="color:#ffd58a;margin-top:26px">
          04 / WHAT SHOULD THE AUDITOR RECOMMEND?
        </h4>

        <div class="c10-choices" id="c10-verdicts">
          <button class="c10-choice" data-verdict="approve">
            <span class="letter">A</span>
            Approve the statements without correcting
            the identified misstatements.
          </button>
          <button class="c10-choice" data-verdict="adjust">
            <span class="letter">B</span>
            Recommend all necessary adjustments, then
            reassess the corrected statements and audit evidence.
          </button>
          <button class="c10-choice" data-verdict="ignore">
            <span class="letter">C</span>
            Ignore the findings because the transactions
            relate to different accounting topics.
          </button>
        </div>

        <button id="c10-final-submit" class="c10-button gold">
          ⚡ ISSUE THE FINAL AUDIT VERDICT
        </button>

        <div id="c10-final-feedback"
          class="c10-feedback" aria-live="polite"></div>
      </section>

      <!-- VICTORY -->
      <section id="c10-victory" class="c10-epilogue" hidden>
        <div id="c10-particles" class="c10-particles"></div>

        <div class="c10-mono c10-gold-text">
          OPERATION COMPLETE / ALL SYSTEMS SECURED
        </div>

        <div class="c10-medal">🏆</div>
        <h2>LEGENDARY<br>DETECTIVE.</h2>

        <p>
          You have solved the final investigation and
          uncovered all five critical accounting errors.
        </p>

        <div class="c10-certificate">
          <small>OFFICIAL DIGITAL ACHIEVEMENT</small>
          <h3>MASTER OF THE FINAL AUDIT</h3>
          <p>AUDIT DETECTIVE — FAR EDITION</p>
          <p>10 / 10 CASES COMPLETED</p>
          <p id="c10-xp" class="c10-gold-text"></p>
          <small>FINANCIAL INVESTIGATION DIVISION</small>
        </div>

        <div class="c10-stats">
          <div class="c10-stat">
            <span>CASES COMPLETED</span>
            <strong>10 / 10</strong>
          </div>
          <div class="c10-stat">
            <span>GROSS MISSTATEMENT</span>
            <strong>RM26,500</strong>
          </div>
          <div class="c10-stat">
            <span>NET PROFIT OVERSTATED</span>
            <strong>RM13,500</strong>
          </div>
        </div>

        <p>
          Final finding: All five accounting corrections
          should be considered before the financial
          statements are finalised. The ultimate audit
          opinion also depends on materiality, other
          audit evidence and management's response.
        </p>

        <button id="c10-finish" class="c10-button gold">
          🏅 COMPLETE AUDIT DETECTIVE →
        </button>

        <button id="c10-replay" class="c10-back">
          ↻ REPLAY FINAL BOSS
        </button>
      </section>

      <button id="c10-back" class="c10-back">
        ← RETURN TO CASE FILES
      </button>
    </div>
  `;

  container.appendChild(screen);

  function updateMenu() {
    const progress = readProgress();
    const available = progress.has(9);
    const button = $("start-case10");

    button.disabled = !available;
    button.textContent = available
      ? "START FINAL INVESTIGATION"
      : "LOCKED 🔒";

    $("case10-status").textContent = progress.has(10)
      ? "COMPLETED ✓"
      : available ? "FINAL BOSS AVAILABLE" : "LOCKED 🔒";
  }

  function updateXP() {
    const progress = readProgress();
    const xp = progress.size * 100;

    if ($("total-xp")) {
      $("total-xp").textContent = xp;
    }

    if ($("detective-rank")) {
      if (xp >= 1000) {
        $("detective-rank").textContent =
          "Legendary Audit Detective";
      } else if (xp >= 900) {
        $("detective-rank").textContent =
          "Supreme Financial Detective";
      } else if (xp >= 800) {
        $("detective-rank").textContent =
          "Legendary Audit Detective";
      } else if (xp >= 700) {
        $("detective-rank").textContent =
          "Expert Audit Detective";
      }
    }
  }

  function hideOtherScreens() {
    document.querySelectorAll(
      ".game-container > section"
    ).forEach(section => {
      section.hidden = true;
    });

    screen.hidden = false;
  }

  function showPhase(number) {
    state.phase = number;

    $("c10-phase1").hidden = number !== 1;
    $("c10-phase2").hidden = number !== 2;
    $("c10-phase3").hidden = number !== 3;
    $("c10-mission").hidden = true;
    $("c10-victory").hidden = number !== 4;

    window.scrollTo(0, 0);
  }

  function beginFinalBoss() {
    if (!readProgress().has(9)) return;

    state.solved.clear();
    state.active = null;
    state.wrong = 0;
    state.gate = "";
    state.verdict = "";
    state.direction = "";
    state.finished = false;

    $("c10-code").value = "";
    $("c10-gate-feedback").textContent = "";
    $("c10-final-feedback").textContent = "";
    $("c10-gross").value = "";
    $("c10-net").value = "";
    $("c10-final-submit").disabled = false;

    document.querySelectorAll(
      "#c10-direction .c10-choice, #c10-verdicts .c10-choice"
    ).forEach(button => {
      button.classList.remove("selected");
    });

    hideOtherScreens();
    showPhase(1);
  }

  // PHASE 1 — SECURITY BREACH

  function unlockGate() {
    const code = $("c10-code").value.trim();
    const feedback = $("c10-gate-feedback");

    if (code !== "0905") {
      feedback.textContent =
        "ACCESS REJECTED. Hint: 09 completed cases + 05 critical files.";
      feedback.className = "c10-feedback c10-error";
      return;
    }

    feedback.textContent =
      "ACCESS GRANTED. COMMAND CENTER ONLINE.";
    feedback.className = "c10-feedback c10-success";

    showPhase(2);
    renderCommand();
  }

  $("c10-unlock").addEventListener("click", unlockGate);

  $("c10-code").addEventListener("keydown", event => {
    if (event.key === "Enter") unlockGate();
  });

  // PHASE 2 — COMMAND CENTER

  function renderCommand() {
    const count = state.solved.size;
    const threat = Math.round(
      ((missions.length - count) / missions.length) * 100
    );

    $("c10-threat-value").textContent = threat + "%";
    $("c10-threat-fill").style.width = threat + "%";

    $("c10-threat-status").textContent =
      (missions.length - count) +
      " CRITICAL FILES UNRESOLVED";

    $("c10-resolved").textContent =
      count + " / " + missions.length;

    $("c10-investigation-status").textContent =
      count === missions.length ? "SECURED" : "ACTIVE";

    $("c10-investigation-status").className =
      count === missions.length ? "c10-cyan" : "c10-danger";

    $("c10-to-verdict").disabled =
      count !== missions.length;

    const files = $("c10-files");
    files.innerHTML = "";

    missions.forEach(mission => {
      const done = state.solved.has(mission.id);

      const button = document.createElement("button");
      button.className = "c10-file" + (done ? " done" : "");
      button.disabled = done;

      const code = document.createElement("div");
      code.className = "c10-mono";
      code.textContent = "FILE / " + mission.id;

      const icon = document.createElement("div");
      icon.className = "c10-file-icon";
      icon.textContent = mission.icon;

      const title = document.createElement("h4");
      title.textContent = mission.name;

      const category = document.createElement("small");
      category.textContent = mission.category;

      const status = document.createElement("span");
      status.className = "c10-file-state";
      status.textContent = done
        ? "✓ THREAT NEUTRALISED"
        : "● " + mission.severity + " / INVESTIGATE";

      button.append(code, icon, title, category, status);

      button.addEventListener("click", () => {
        openMission(mission.id);
      });

      files.appendChild(button);
    });
  }

  function openMission(id) {
    const mission = missions.find(item => item.id === id);

    if (!mission || state.solved.has(id)) return;

    state.active = {
      id: mission.id,
      choice: null
    };

    $("c10-phase2").hidden = true;
    $("c10-mission").hidden = false;

    $("c10-mission-code").textContent =
      "CLASSIFIED FILE / " + mission.id +
      " / " + mission.severity + " THREAT";

    $("c10-mission-name").textContent = mission.name;
    $("c10-mission-category").textContent = mission.category;
    $("c10-mission-evidence").textContent = mission.evidence;
    $("c10-mission-question").textContent = mission.question;

    $("c10-mission-feedback").textContent = "";
    $("c10-submit-mission").disabled = true;
    $("c10-submit-mission").hidden = false;
    $("c10-close-mission").hidden = true;
    $("c10-cancel-mission").hidden = false;

    const choices = $("c10-choices");
    choices.innerHTML = "";

    mission.choices.forEach((text, index) => {
      const button = document.createElement("button");
      button.className = "c10-choice";

      const letter = document.createElement("span");
      letter.className = "letter";
      letter.textContent = ["A", "B", "C"][index];

      const label = document.createElement("span");
      label.textContent = text;

      button.append(letter, label);

      button.addEventListener("click", () => {
        state.active.choice = index;

        choices.querySelectorAll("button").forEach(option => {
          option.classList.toggle(
            "selected",
            option === button
          );
        });

        $("c10-submit-mission").disabled = false;
      });

      choices.appendChild(button);
    });

    window.scrollTo(0, 0);
  }

  $("c10-submit-mission").addEventListener("click", () => {
    if (!state.active) return;

    const mission = missions.find(
      item => item.id === state.active.id
    );

    if (!mission) return;

    const feedback = $("c10-mission-feedback");

    if (state.active.choice !== mission.answer) {
      state.wrong++;

      feedback.textContent =
        "✕ AUDIT FINDING REJECTED. Review the evidence and try again.";
      feedback.className = "c10-feedback c10-error";
      return;
    }

    state.solved.add(mission.id);

    feedback.textContent =
      "✓ THREAT NEUTRALISED. " +
      mission.explanation +
      " ADJUSTMENT: " +
      mission.adjustment;

    feedback.className = "c10-feedback c10-success";

    $("c10-submit-mission").hidden = true;
    $("c10-close-mission").hidden = false;
    $("c10-cancel-mission").hidden = true;

    $("c10-choices").querySelectorAll("button").forEach(button => {
      button.disabled = true;
    });
  });

  function returnToCommand() {
    state.active = null;
    $("c10-mission").hidden = true;
    $("c10-phase2").hidden = false;
    renderCommand();
    window.scrollTo(0, 0);
  }

  $("c10-close-mission").addEventListener(
    "click",
    returnToCommand
  );

  $("c10-cancel-mission").addEventListener(
    "click",
    returnToCommand
  );

  // PHASE 3 — FINAL VERDICT

  $("c10-to-verdict").addEventListener("click", () => {
    if (state.solved.size !== missions.length) return;

    renderLedger();
    showPhase(3);
  });

  function renderLedger() {
    const ledger = $("c10-ledger");
    ledger.innerHTML = "";

    missions.forEach(mission => {
      const row = document.createElement("div");
      row.className = "c10-ledger-row";

      const label = document.createElement("span");
      label.textContent =
        mission.id + " · " + mission.name;

      const impact = document.createElement("strong");
      impact.textContent =
        money(mission.impact) +
        (mission.impact > 0
          ? " OVER"
          : " UNDER");

      row.append(label, impact);
      ledger.appendChild(row);
    });
  }

  function setSelected(groupId, button) {
    $(groupId).querySelectorAll("button").forEach(option => {
      option.classList.toggle("selected", option === button);
    });
  }

  document.querySelectorAll(
    "#c10-direction button"
  ).forEach(button => {
    button.addEventListener("click", () => {
      state.direction = button.dataset.direction;
      setSelected("c10-direction", button);
    });
  });

  document.querySelectorAll(
    "#c10-verdicts button"
  ).forEach(button => {
    button.addEventListener("click", () => {
      state.verdict = button.dataset.verdict;
      setSelected("c10-verdicts", button);
    });
  });

  $("c10-final-submit").addEventListener("click", () => {
    if (state.finished) return;
    if (state.solved.size !== missions.length) return;

    const grossText = $("c10-gross").value.trim();
    const netText = $("c10-net").value.trim();
    const feedback = $("c10-final-feedback");

    if (
      grossText === "" ||
      netText === "" ||
      !state.direction ||
      !state.verdict
    ) {
      feedback.textContent =
        "INCOMPLETE REPORT. Enter both figures and select both decisions.";
      feedback.className = "c10-feedback c10-error";
      return;
    }

    const gross = Number(grossText);
    const net = Number(netText);

    const correct =
      gross === 26500 &&
      net === 13500 &&
      state.direction === "over" &&
      state.verdict === "adjust";

    if (!correct) {
      state.wrong++;

      let hint =
        "FINAL VERDICT REJECTED. Review the ledger and the sign of each profit impact.";

      if (state.wrong >= 2) {
        hint +=
          " HINT: Overstatements = RM20,000. " +
          "Understatements = RM6,500. " +
          "Gross = RM26,500; net = RM13,500 overstated. " +
          "Recommend adjustments and reassessment.";
      }

      feedback.textContent = hint;
      feedback.className = "c10-feedback c10-error";
      return;
    }

    completeFinalBoss();
  });

  // PHASE 4 — VICTORY

  function completeFinalBoss() {
    if (state.finished) return;
    state.finished = true;

    const progress = readProgress();
    const firstCompletion = !progress.has(10);

    progress.add(10);
    saveProgress(progress);

    // Synchronise with the original game where available.
    if (typeof completedCases !== "undefined") {
      completedCases.add(10);
    }

    updateMenu();
    updateXP();

    const xp = progress.size * 100;

    $("c10-xp").textContent =
      firstCompletion
        ? "+100 XP EARNED · " + xp + " TOTAL XP"
        : "MISSION REPLAY · " + xp + " TOTAL XP";

    showPhase(4);
    createVictoryParticles();
  }

  function createVictoryParticles() {
    const container = $("c10-particles");
    container.innerHTML = "";

    const symbols = ["✦", "✧", "★", "◆", "✦"];

    for (let i = 0; i < 26; i++) {
      const particle = document.createElement("span");
      particle.className = "c10-particle";
      particle.textContent = symbols[i % symbols.length];

      particle.style.left = ((i * 37) % 100) + "%";
      particle.style.color =
        i % 2 === 0 ? "#ffd58a" : "#4de8ff";
      particle.style.animationDuration =
        (3 + (i % 5)) + "s";
      particle.style.animationDelay =
        (-i * 0.27) + "s";

      container.appendChild(particle);
    }
  }

  function backToMenu() {
    screen.hidden = true;
    $("welcome-screen").hidden = false;
    updateMenu();
    updateXP();
    window.scrollTo(0, 0);
  }

  $("start-case10").addEventListener(
    "click",
    beginFinalBoss
  );

  $("c10-back").addEventListener(
    "click",
    backToMenu
  );

  $("c10-finish").addEventListener(
    "click",
    backToMenu
  );

  $("c10-replay").addEventListener(
    "click",
    beginFinalBoss
  );

  updateMenu();
  updateXP();
})();
