
"use strict";

/*
  AUDIT DETECTIVE — FAR EDITION
  CASE 008: THE HIDDEN LOAN
  Financial Codebreaker Expansion
  Requires: script.js and case7.js
*/

(() => {
    const el = id => document.getElementById(id);
    const STORAGE_KEY = "auditDetectiveProgress";

    const documents = [
        {
            id: "principal",
            icon: "🏦",
            name: "Loan Approval Letter",
            code: "60000",
            clue: "The bank approved a principal loan of RM60,000.",
            answer: "RM60,000",
            label: "LOAN PRINCIPAL"
        },
        {
            id: "rate",
            icon: "📈",
            name: "Interest Agreement",
            code: "0.08",
            clue: "The agreement states an annual interest rate of 8%.",
            answer: "8% per annum",
            label: "ANNUAL INTEREST RATE"
        },
        {
            id: "date",
            icon: "📅",
            name: "Loan Commencement Notice",
            code: "0901",
            clue: "The loan began on 1 September 2026. Enter the date in MMDD format.",
            answer: "1 September 2026",
            label: "COMMENCEMENT DATE"
        }
    ];

    const matchingRecords = [
        {
            id: "principal",
            label: "Loan Principal",
            value: "RM60,000"
        },
        {
            id: "rate",
            label: "Annual Interest Rate",
            value: "8%"
        },
        {
            id: "period",
            label: "Months in 2026",
            value: "4 months"
        },
        {
            id: "payment",
            label: "Interest Payment Date",
            value: "31 August 2027"
        }
    ];

    let unlocked = new Set();
    let matched = new Set();
    let selectedRecord = null;
    let stage = 1;
    let attempts = 0;
    let solved = false;

    function readProgress() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return new Set(
                Array.isArray(data?.completed)
                    ? data.completed.filter(Number.isInteger)
                    : []
            );
        } catch {
            return new Set();
        }
    }

    function writeProgress(progress) {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    completed: [...progress].sort((a, b) => a - b)
                })
            );
        } catch (error) {
            console.warn("Unable to save progress:", error);
        }
    }

    function money(value) {
        return "RM" + value.toLocaleString("en-MY");
    }

    // =========================================
    // STYLES
    // =========================================

    const style = document.createElement("style");

    style.textContent = `
        #case8-screen {
            color: #eaf2ff;
            background: #0b1423;
            border-radius: 20px;
            padding: 20px;
            margin: 15px 0 30px;
            font-family: inherit;
        }

        #case8-screen *,
        #case8-screen *::before,
        #case8-screen *::after {
            box-sizing: border-box;
        }

        #case8-screen [hidden] {
            display: none !important;
        }

        .c8-hero {
            background:
                radial-gradient(
                    circle at 85% 20%,
                    rgba(240, 202, 113, .18),
                    transparent 40%
                ),
                linear-gradient(135deg, #1b304c, #091220);
            border: 1px solid #b79554;
            border-radius: 20px;
            padding: 32px;
            position: relative;
            overflow: hidden;
        }

        .c8-eyebrow {
            color: #f0d58e;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
        }

        .c8-hero h2 {
            color: white;
            font-size: clamp(32px, 6vw, 60px);
            line-height: 1.08;
            margin: 16px 0;
        }

        .c8-hero h2 span {
            color: #f0d58e;
        }

        .c8-hero p {
            color: #c2d1e5;
            line-height: 1.8;
            max-width: 580px;
        }

        .c8-vault-art {
            text-align: center;
            font-size: 82px;
            margin: 22px 0;
            filter: drop-shadow(0 12px 20px rgba(0,0,0,.4));
        }

        .c8-stats {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
            margin-top: 20px;
        }

        .c8-stat {
            background: rgba(255,255,255,.06);
            border: 1px solid rgba(255,255,255,.15);
            padding: 16px;
            border-radius: 12px;
        }

        .c8-stat small {
            display: block;
            color: #a9bcd3;
            font-size: 10px;
            letter-spacing: 1px;
            margin-bottom: 9px;
        }

        .c8-stat strong {
            color: #f0d58e;
            font-size: clamp(14px, 2.5vw, 20px);
        }

        .c8-progress {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin: 22px 0;
            padding: 16px;
            background: #17283f;
            border: 1px solid #465b76;
            border-radius: 12px;
            font-size: 12px;
            letter-spacing: .5px;
        }

        .c8-progress strong {
            color: #f0d58e;
        }

        .c8-panel {
            background: #16263d;
            border: 1px solid #455a76;
            border-radius: 17px;
            padding: 24px;
            margin: 20px 0;
        }

        .c8-panel h3 {
            color: #f0d58e;
            font-size: 23px;
            margin-top: 0;
        }

        .c8-panel p {
            color: #c4d1e1;
            line-height: 1.75;
        }

        .c8-lock-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin: 22px 0;
        }

        .c8-lock-card {
            background: linear-gradient(160deg, #263d5c, #142238);
            border: 1px solid #5c7290;
            border-radius: 15px;
            padding: 19px;
            text-align: center;
            min-width: 0;
        }

        .c8-lock-card.open {
            border-color: #5ce0a0;
            background: linear-gradient(160deg, #205044, #142c35);
        }

        .c8-lock-icon {
            font-size: 43px;
            margin: 12px 0;
        }

        .c8-lock-card h4 {
            font-size: 16px;
            color: white;
            margin: 12px 0;
        }

        .c8-lock-card small {
            color: #b1c1d5;
            font-size: 11px;
        }

        .c8-code-input,
        .c8-number-input {
            width: 100%;
            padding: 14px;
            background: #0b192b;
            border: 1px solid #6c819c;
            color: white;
            border-radius: 9px;
            font-size: 17px;
            margin: 12px 0;
        }

        .c8-code-input:focus,
        .c8-number-input:focus {
            outline: 2px solid #f0d58e;
        }

        #case8-screen button {
            cursor: pointer;
            border: none;
            border-radius: 9px;
            padding: 12px 16px;
            font-weight: 800;
            transition: transform .2s, opacity .2s;
        }

        #case8-screen button:hover:not(:disabled) {
            transform: translateY(-2px);
        }

        #case8-screen button:disabled {
            opacity: .48;
            cursor: not-allowed;
        }

        .c8-gold {
            color: #172236;
            background: linear-gradient(135deg, #f5dfaa, #c99c4b);
        }

        .c8-full {
            width: 100%;
            margin-top: 13px;
        }

        .c8-lock-card button {
            width: 100%;
            font-size: 11px;
        }

        .c8-document {
            background: #fff9e9;
            border: 5px solid #c6b58b;
            color: #253247;
            padding: 22px;
            border-radius: 12px;
            margin: 20px 0;
        }

        .c8-document h4 {
            color: #253247;
            margin-top: 0;
        }

        .c8-document p {
            color: #4a5669;
        }

        .c8-document strong {
            color: #243044;
        }

        .c8-match-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }

        .c8-match-column {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .c8-match-column h4 {
            color: #f0d58e;
            margin: 0 0 6px;
        }

        .c8-match-button {
            background: #283f5c;
            color: white;
            border: 1px solid #647e9c !important;
            min-height: 65px;
            text-align: left;
        }

        .c8-match-button.selected {
            outline: 3px solid #f0d58e;
        }

        .c8-match-button.matched {
            background: #235e4b;
            border-color: #5ce0a0 !important;
        }

        .c8-formula {
            background: #0d1d30;
            border-left: 4px solid #f0d58e;
            padding: 16px;
            border-radius: 8px;
            color: #e9f1ff;
            line-height: 1.8;
            margin: 18px 0;
        }

        .c8-input-label {
            display: block;
            color: #edf4ff;
            font-weight: bold;
            margin-top: 20px;
        }

        .c8-journal {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
            margin: 16px 0;
        }

        .c8-journal button {
            background: #293f5c;
            color: white;
            border: 1px solid #667e9b !important;
            text-align: left;
            line-height: 1.7;
        }

        .c8-journal button.chosen {
            background: #345e72;
            border-color: #f0d58e !important;
            outline: 2px solid #f0d58e;
        }

        .c8-feedback {
            font-size: 13px;
            font-weight: 700;
            line-height: 1.7;
            margin: 12px 0;
        }

        .c8-success {
            color: #70e5a7;
        }

        .c8-error {
            color: #ff9d9d;
        }

        .c8-result {
            text-align: center;
            background: linear-gradient(135deg, #1d493e, #15283e);
            border: 2px solid #e0c17a;
            border-radius: 18px;
            padding: 30px;
            margin: 25px 0;
        }

        .c8-result h2 {
            color: #f0d58e;
            font-size: 32px;
        }

        .c8-result p {
            color: #dce9f7;
            line-height: 1.9;
        }

        .c8-trophy {
            font-size: 65px;
        }

        .c8-xp {
            color: #70e5a7;
            font-size: 32px;
        }

        .c8-back {
            color: white;
            background: #344b68;
            margin-top: 15px;
        }

        @media (max-width: 750px) {
            .c8-lock-grid {
                grid-template-columns: 1fr;
            }
            .c8-hero {
                padding: 20px;
            }
        }

        @media (max-width: 520px) {
            .c8-stats,
            .c8-match-grid {
                grid-template-columns: 1fr;
            }
            .c8-panel {
                padding: 15px;
            }
            .c8-vault-art {
                font-size: 65px;
            }
            .c8-progress {
                flex-direction: column;
                align-items: flex-start;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            #case8-screen button {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);

    // =========================================
    // CREATE CASE CARD
    // =========================================

    const grid = document.querySelector(".case-grid");
    const container = document.querySelector(".game-container");

    if (!grid || !container) {
        console.error("Case 008: Game container not found.");
        return;
    }

    const card = document.createElement("div");
    card.className = "case-card";

    card.innerHTML = `
        <span class="case-number">CASE 008</span>
        <h3>The Hidden Loan</h3>
        <p>Loan Interest · Financial Codebreaker</p>
        <span id="case8-status">LOCKED 🔒</span>
        <button id="start-case8" disabled>LOCKED 🔒</button>
    `;

    grid.appendChild(card);

    // =========================================
    // CREATE GAME SCREEN
    // =========================================

    const screen = document.createElement("section");
    screen.id = "case8-screen";
    screen.hidden = true;

    screen.innerHTML = `
        <div class="c8-hero">
            <span class="c8-eyebrow">
                🔐 AUDIT DETECTIVE · CASE 008
            </span>
            <h2>THE HIDDEN<br><span>LOAN</span></h2>
            <p>
                A confidential bank loan has been discovered.
                The accountant failed to recognise the interest
                incurred before year-end. Unlock the records,
                decode the agreement and prepare the correction.
            </p>
            <div class="c8-vault-art">🏦🔐</div>
            <div class="c8-stats">
                <div class="c8-stat">
                    <small>CASE STATUS</small>
                    <strong>CLASSIFIED</strong>
                </div>
                <div class="c8-stat">
                    <small>FINANCIAL YEAR</small>
                    <strong>2026</strong>
                </div>
                <div class="c8-stat">
                    <small>SECURITY LOCKS</small>
                    <strong>03</strong>
                </div>
            </div>
        </div>

        <div class="c8-progress">
            <span id="c8-stage-label">
                STAGE 1 · UNLOCK THE VAULT
            </span>
            <strong id="c8-stage-progress">0 / 3 LOCKS</strong>
        </div>

        <div id="c8-stage1" class="c8-panel">
            <h3>🔐 Stage 1 — Unlock the Loan Vault</h3>
            <p>
                Three encrypted bank records protect the loan
                agreement. Read each clue and enter its security code.
            </p>
            <div id="c8-lock-grid" class="c8-lock-grid"></div>
            <button id="c8-next1" class="c8-gold c8-full" disabled>
                ACCESS LOAN RECORDS →
            </button>
        </div>

        <div id="c8-stage2" class="c8-panel" hidden>
            <h3>🧩 Stage 2 — Decode the Loan Records</h3>
            <p>
                Select one accounting label on the left and its
                matching value on the right, then press MATCH.
            </p>

            <div class="c8-document">
                <h4>🏦 CONFIDENTIAL LOAN AGREEMENT</h4>
                <p>
                    Principal: RM60,000.
                    Annual interest rate: 8%.
                    Loan commencement: 1 September 2026.
                    Interest payable: 31 August 2027.
                    Reporting date: 31 December 2026.
                </p>
            </div>

            <div class="c8-match-grid">
                <div class="c8-match-column">
                    <h4>ACCOUNTING LABEL</h4>
                    <div id="c8-labels" class="c8-match-column"></div>
                </div>
                <div class="c8-match-column">
                    <h4>DECODED VALUE</h4>
                    <div id="c8-values" class="c8-match-column"></div>
                </div>
            </div>

            <button id="c8-match" class="c8-gold c8-full" disabled>
                MATCH SELECTED RECORDS
            </button>

            <div id="c8-match-feedback"
                class="c8-feedback" aria-live="polite"></div>

            <button id="c8-next2" class="c8-gold c8-full" hidden>
                PREPARE INTEREST CALCULATION →
            </button>
        </div>

        <div id="c8-stage3" class="c8-panel" hidden>
            <h3>🧮 Stage 3 — Final Interest Calculation</h3>
            <p>
                Calculate the interest incurred during 2026.
                No interest has been paid or recorded by year-end.
            </p>

            <div class="c8-document">
                <h4>📄 AUDIT WORKING PAPER</h4>
                <p>Principal: <strong>RM60,000</strong></p>
                <p>Interest rate: <strong>8% per annum</strong></p>
                <p>Loan start: <strong>1 September 2026</strong></p>
                <p>Reporting date: <strong>31 December 2026</strong></p>
                <p>Interest payment: <strong>31 August 2027</strong></p>
            </div>

            <div class="c8-formula">
                Annual Interest = Principal × Annual Rate
                <p>
                    Interest for 2026 = Annual Interest ×
                    Months Outstanding / 12
                </p>
            </div>

            <label class="c8-input-label" for="c8-annual">
                01 — Annual Interest (RM)
            </label>
            <input id="c8-annual" class="c8-number-input"
                type="number" min="0" step="0.01"
                placeholder="Annual interest">

            <label class="c8-input-label" for="c8-expense">
                02 — Interest Expense for 2026 (RM)
            </label>
            <input id="c8-expense" class="c8-number-input"
                type="number" min="0" step="0.01"
                placeholder="2026 interest expense">

            <label class="c8-input-label" for="c8-accrued">
                03 — Accrued Interest at 31 December 2026 (RM)
            </label>
            <input id="c8-accrued" class="c8-number-input"
                type="number" min="0" step="0.01"
                placeholder="Accrued interest">

            <h3>📒 Choose the Correct Adjusting Entry</h3>

            <div id="c8-journal" class="c8-journal">
                <button data-entry="A">
                    A — Dr Interest Payable RM1,600;
                    Cr Interest Expense RM1,600
                </button>
                <button data-entry="B">
                    B — Dr Interest Expense RM1,600;
                    Cr Interest Payable RM1,600
                </button>
                <button data-entry="C">
                    C — Dr Bank RM1,600;
                    Cr Interest Income RM1,600
                </button>
            </div>

            <button id="c8-submit" class="c8-gold c8-full">
                SUBMIT FINAL AUDIT REPORT →
            </button>

            <div id="c8-final-feedback"
                class="c8-feedback" aria-live="polite"></div>
        </div>

        <div id="c8-result" class="c8-result" hidden>
            <div class="c8-trophy">🏆</div>
            <h2>CASE 008 SOLVED!</h2>
            <p>
                Annual interest = RM60,000 × 8% = RM4,800.
                Four months of interest were incurred from
                September to December 2026.
            </p>
            <p>
                Interest expense = RM4,800 × 4/12 = RM1,600.
                Accrued interest payable = RM1,600.
            </p>
            <p>
                Correct adjusting entry:
                Dr Interest Expense RM1,600;
                Cr Interest Payable RM1,600.
            </p>
            <h3 id="c8-reward" class="c8-xp">+100 XP</h3>
            <p id="c8-total-xp"></p>
            <button id="c8-finish" class="c8-gold c8-full">
                RETURN TO CASE FILES →
            </button>
        </div>

        <button id="c8-back" class="c8-back">
            ← BACK TO CASE FILES
        </button>
    `;

    container.appendChild(screen);

    // =========================================
    // MENU AND PROGRESS
    // =========================================

    function updateMenu() {
        const progress = readProgress();
        const available = progress.has(7);
        const button = el("start-case8");

        button.disabled = !available;
        button.textContent = available
            ? "START INVESTIGATION"
            : "LOCKED 🔒";

        el("case8-status").textContent = progress.has(8)
            ? "COMPLETED ✓"
            : available ? "AVAILABLE" : "LOCKED 🔒";
    }

    function updateXP() {
        const progress = readProgress();
        const xp = progress.size * 100;

        if (el("total-xp")) {
            el("total-xp").textContent = xp;
        }

        if (el("detective-rank") && xp >= 800) {
            el("detective-rank").textContent =
                "Legendary Audit Detective";
        } else if (el("detective-rank") && xp >= 700) {
            el("detective-rank").textContent =
                "Expert Audit Detective";
        }
    }

    function showGame() {
        if (!readProgress().has(7)) return;

        unlocked.clear();
        matched.clear();
        selectedRecord = null;
        stage = 1;
        attempts = 0;
        solved = false;

        document.querySelectorAll(
            ".game-container > section"
        ).forEach(section => {
            section.hidden = true;
        });

        screen.hidden = false;

        el("c8-stage1").hidden = false;
        el("c8-stage2").hidden = true;
        el("c8-stage3").hidden = true;
        el("c8-result").hidden = true;

        el("c8-next1").disabled = true;
        el("c8-next2").hidden = true;
        el("c8-match-feedback").textContent = "";
        el("c8-final-feedback").textContent = "";

        ["c8-annual", "c8-expense", "c8-accrued"].forEach(id => {
            el(id).value = "";
            el(id).disabled = false;
        });

        el("c8-submit").disabled = false;

        document.querySelectorAll(
            "#c8-journal button"
        ).forEach(button => {
            button.classList.remove("chosen");
        });

        renderLocks();
        updateStage();
        window.scrollTo(0, 0);
    }

    function updateStage() {
        const names = {
            1: "STAGE 1 · UNLOCK THE VAULT",
            2: "STAGE 2 · DECODE THE RECORDS",
            3: "STAGE 3 · FINAL AUDIT REPORT"
        };

        el("c8-stage-label").textContent = names[stage];

        el("c8-stage-progress").textContent =
            stage === 1
                ? unlocked.size + " / 3 LOCKS"
                : stage === 2
                    ? matched.size + " / 4 MATCHES"
                    : "FINAL CALCULATION";
    }

    // =========================================
    // STAGE 1 — CODEBREAKER
    // =========================================

    function renderLocks() {
        const grid = el("c8-lock-grid");
        grid.innerHTML = "";

        documents.forEach((doc, index) => {
            const open = unlocked.has(doc.id);
            const card = document.createElement("div");

            card.className =
                "c8-lock-card" + (open ? " open" : "");

            const label = document.createElement("small");
            label.textContent =
                "SECURITY LOCK 0" + (index + 1);

            const icon = document.createElement("div");
            icon.className = "c8-lock-icon";
            icon.textContent = open ? "🔓" : "🔒";

            const title = document.createElement("h4");
            title.textContent = doc.name;

            const clue = document.createElement("p");
            clue.textContent = doc.clue;

            const input = document.createElement("input");
            input.type = "text";
            input.inputMode = "numeric";
            input.className = "c8-code-input";
            input.placeholder = "ENTER CODE";
            input.setAttribute(
                "aria-label",
                "Security code for " + doc.name
            );
            input.disabled = open;

            if (open) input.value = doc.code;

            const button = document.createElement("button");
            button.className = "c8-gold";
            button.textContent = open
                ? "✓ UNLOCKED"
                : "DECRYPT LOCK";
            button.disabled = open;

            const feedback = document.createElement("div");
            feedback.className = "c8-feedback";
            feedback.setAttribute("aria-live", "polite");

            button.addEventListener("click", () => {
                const entered = input.value.trim();

                if (entered === doc.code) {
                    unlocked.add(doc.id);
                    renderLocks();
                    updateStage();

                    if (unlocked.size === documents.length) {
                        el("c8-next1").disabled = false;
                    }
                } else {
                    feedback.textContent =
                        "✕ Incorrect code. Re-read the clue.";
                    feedback.className =
                        "c8-feedback c8-error";
                }
            });

            input.addEventListener("keydown", event => {
                if (event.key === "Enter") button.click();
            });

            card.append(
                label, icon, title, clue, input, button, feedback
            );

            grid.appendChild(card);
        });
    }

    el("c8-next1").addEventListener("click", () => {
        if (unlocked.size !== 3) return;

        stage = 2;
        el("c8-stage1").hidden = true;
        el("c8-stage2").hidden = false;

        renderMatching();
        updateStage();
        window.scrollTo(0, 0);
    });

    // =========================================
    // STAGE 2 — MATCH THE RECORDS
    // =========================================

    let selectedLabel = null;
    let selectedValue = null;

    function renderMatching() {
        const labels = el("c8-labels");
        const values = el("c8-values");

        labels.innerHTML = "";
        values.innerHTML = "";

        matchingRecords.forEach(record => {
            const button = document.createElement("button");
            button.className = "c8-match-button";
            button.textContent = record.label;

            if (matched.has(record.id)) {
                button.classList.add("matched");
                button.disabled = true;
            } else if (selectedLabel === record.id) {
                button.classList.add("selected");
            }

            button.addEventListener("click", () => {
                selectedLabel = selectedLabel === record.id
                    ? null : record.id;
                renderMatching();
            });

            labels.appendChild(button);
        });

        const shuffledOrder = [
            matchingRecords[2],
            matchingRecords[0],
            matchingRecords[3],
            matchingRecords[1]
        ];

        shuffledOrder.forEach(record => {
            const button = document.createElement("button");
            button.className = "c8-match-button";
            button.textContent = record.value;

            if (matched.has(record.id)) {
                button.classList.add("matched");
                button.disabled = true;
            } else if (selectedValue === record.id) {
                button.classList.add("selected");
            }

            button.addEventListener("click", () => {
                selectedValue = selectedValue === record.id
                    ? null : record.id;
                renderMatching();
            });

            values.appendChild(button);
        });

        el("c8-match").disabled =
            !selectedLabel || !selectedValue;
    }

    el("c8-match").addEventListener("click", () => {
        if (!selectedLabel || !selectedValue) return;

        const feedback = el("c8-match-feedback");

        if (selectedLabel === selectedValue) {
            matched.add(selectedLabel);

            feedback.textContent =
                "✓ Correct! Accounting record decoded.";
            feedback.className = "c8-feedback c8-success";
        } else {
            feedback.textContent =
                "✕ Incorrect match. Compare the agreement carefully.";
            feedback.className = "c8-feedback c8-error";
        }

        selectedLabel = null;
        selectedValue = null;

        renderMatching();
        updateStage();

        if (matched.size === matchingRecords.length) {
            el("c8-next2").hidden = false;
        }
    });

    el("c8-next2").addEventListener("click", () => {
        if (matched.size !== 4) return;

        stage = 3;
        el("c8-stage2").hidden = true;
        el("c8-stage3").hidden = false;

        updateStage();
        window.scrollTo(0, 0);
    });

    // =========================================
    // STAGE 3 — FINAL CALCULATION
    // =========================================

    let selectedEntry = null;

    document.querySelectorAll(
        "#c8-journal button"
    ).forEach(button => {
        button.addEventListener("click", () => {
            selectedEntry = button.dataset.entry;

            document.querySelectorAll(
                "#c8-journal button"
            ).forEach(option => {
                option.classList.toggle(
                    "chosen",
                    option === button
                );
            });
        });
    });

    el("c8-submit").addEventListener("click", () => {
        if (solved || matched.size !== 4) return;

        const annualText = el("c8-annual").value.trim();
        const expenseText = el("c8-expense").value.trim();
        const accruedText = el("c8-accrued").value.trim();

        const feedback = el("c8-final-feedback");

        if (
            !annualText ||
            !expenseText ||
            !accruedText ||
            !selectedEntry
        ) {
            feedback.textContent =
                "Complete all three amounts and select a journal entry.";
            feedback.className = "c8-feedback c8-error";
            return;
        }

        const annualCorrect = Number(annualText) === 4800;
        const expenseCorrect = Number(expenseText) === 1600;
        const accruedCorrect = Number(accruedText) === 1600;
        const journalCorrect = selectedEntry === "B";

        if (
            !annualCorrect ||
            !expenseCorrect ||
            !accruedCorrect ||
            !journalCorrect
        ) {
            attempts++;

            let message = "✕ Incorrect. ";

            if (!annualCorrect) {
                message += "Review annual interest. ";
            }

            if (!expenseCorrect || !accruedCorrect) {
                message += "Review the four-month period. ";
            }

            if (!journalCorrect) {
                message += "Check debit and credit accounts. ";
            }

            if (attempts >= 2) {
                message +=
                    "Hint: RM60,000 × 8% = RM4,800; " +
                    "RM4,800 × 4/12 = RM1,600. " +
                    "Interest Expense is debited and " +
                    "Interest Payable is credited.";
            }

            feedback.textContent = message;
            feedback.className = "c8-feedback c8-error";
            return;
        }

        solved = true;

        feedback.textContent =
            "✓ Correct! All loan adjustments verified.";
        feedback.className = "c8-feedback c8-success";

        const progress = readProgress();
        const firstCompletion = !progress.has(8);
        progress.add(8);

        writeProgress(progress);

        // Keep the original game progress set in sync.
        if (typeof completedCases !== "undefined") {
            completedCases.add(8);
        }

        const xp = progress.size * 100;

        el("c8-reward").textContent = firstCompletion
            ? "+100 XP"
            : "CASE ALREADY COMPLETED";

        el("c8-total-xp").textContent =
            "TOTAL XP: " + xp;

        el("c8-stage3").hidden = true;
        el("c8-result").hidden = false;

        updateMenu();
        updateXP();

        window.scrollTo(0, 0);
    });

    // =========================================
    // NAVIGATION
    // =========================================

    function backToMenu() {
        screen.hidden = true;
        el("welcome-screen").hidden = false;

        updateMenu();
        updateXP();

        window.scrollTo(0, 0);
    }

    el("start-case8").addEventListener("click", showGame);
    el("c8-back").addEventListener("click", backToMenu);
    el("c8-finish").addEventListener("click", backToMenu);

    updateMenu();
    updateXP();
})();
