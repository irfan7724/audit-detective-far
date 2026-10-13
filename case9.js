
"use strict";

/*
  AUDIT DETECTIVE — FAR EDITION
  CASE 009: THE SUSPICIOUS SALE

  Gameplay:
  1. Investigate evidence
  2. Reconstruct the transaction timeline
  3. Make the revenue recognition verdict
  4. Complete the audit adjustment

  Requires existing script.js, case7.js and case8.js.
*/

(() => {
    const $9 = id => document.getElementById(id);
    const STORAGE = "auditDetectiveProgress";

    const evidence = [
        {
            id: "order",
            icon: "🛒",
            title: "Customer Purchase Order",
            date: "28 DEC 2026",
            sort: 1,
            ref: "PO-2026-118",
            text: "The customer placed an order for goods worth RM18,000. The order does not transfer control of the goods.",
            lesson: "A purchase order alone does not establish that revenue has been earned."
        },
        {
            id: "invoice",
            icon: "🧾",
            title: "Sales Invoice",
            date: "29 DEC 2026",
            sort: 2,
            ref: "INV-2026-902",
            text: "The company issued an invoice for RM18,000 and immediately recorded revenue in the 2026 accounts.",
            lesson: "Issuing an invoice does not necessarily mean the performance obligation has been satisfied."
        },
        {
            id: "yearend",
            icon: "📅",
            title: "Financial Year-End",
            date: "31 DEC 2026",
            sort: 3,
            ref: "YE-2026",
            text: "At reporting date, the goods were still in the company's warehouse. The customer did not have control of them.",
            lesson: "Revenue must be assessed based on conditions at the reporting date."
        },
        {
            id: "dispatch",
            icon: "🚚",
            title: "Dispatch Note",
            date: "03 JAN 2027",
            sort: 4,
            ref: "DN-2027-003",
            text: "The warehouse dispatched the goods on 3 January 2027. The contract states control transfers only upon customer acceptance.",
            lesson: "Dispatch alone is not the transfer point under this contract."
        },
        {
            id: "acceptance",
            icon: "📦",
            title: "Customer Acceptance",
            date: "05 JAN 2027",
            sort: 5,
            ref: "CA-2027-005",
            text: "The customer received, inspected and accepted the goods on 5 January 2027. Control transferred at acceptance.",
            lesson: "The performance obligation is satisfied when the customer obtains control."
        }
    ];

    const timelineShuffled = [
        "dispatch", "invoice", "acceptance", "order", "yearend"
    ];

    let collected = new Set();
    let timeline = [];
    let selectedEvidence = null;
    let verdict = null;
    let attempts = 0;
    let solved = false;
    let stage = 1;

    function readProgress() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE)
            );

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
            console.warn("Case 009 progress not saved:", error);
        }
    }

    const style = document.createElement("style");

    style.textContent = `
        #case9-screen {
            color: #eaf1fb;
            background: #0b1423;
            padding: 20px;
            border-radius: 20px;
            margin: 15px 0 30px;
        }

        #case9-screen *,
        #case9-screen *::before,
        #case9-screen *::after {
            box-sizing: border-box;
        }

        #case9-screen [hidden],
        #case9-screen[hidden] {
            display: none !important;
        }

        .c9-hero {
            border-radius: 20px;
            padding: 32px;
            border: 1px solid #d3b471;
            background:
                radial-gradient(
                    circle at 80% 15%,
                    rgba(233, 193, 103, .19),
                    transparent 42%
                ),
                linear-gradient(135deg, #1e334e, #0b1628);
            overflow: hidden;
        }

        .c9-kicker {
            color: #f1d28b;
            letter-spacing: 2px;
            font-size: 11px;
            font-weight: 900;
        }

        .c9-hero h2 {
            color: #fff;
            font-size: clamp(32px, 6vw, 58px);
            line-height: 1.08;
            margin: 16px 0;
        }

        .c9-hero h2 span {
            color: #f1d28b;
        }

        .c9-hero p {
            color: #c4d2e5;
            line-height: 1.8;
            max-width: 650px;
        }

        .c9-scene {
            position: relative;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            align-items: end;
            gap: 15px;
            margin: 25px 0 10px;
            padding: 25px 12px;
            min-height: 190px;
            border-radius: 15px;
            background:
                repeating-linear-gradient(
                    90deg,
                    transparent 0 55px,
                    rgba(255,255,255,.025) 55px 57px
                ),
                linear-gradient(#273f59, #142338);
            border: 1px solid #4c6380;
            text-align: center;
        }

        .c9-scene-item {
            font-size: clamp(38px, 8vw, 74px);
            filter: drop-shadow(0 10px 12px rgba(0,0,0,.35));
        }

        .c9-scene-item small {
            display: block;
            font-size: 10px;
            color: #f1d28b;
            letter-spacing: 1px;
            margin-top: 10px;
        }

        .c9-status {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            padding: 16px;
            margin: 20px 0;
            border: 1px solid #4b6380;
            border-radius: 12px;
            background: #192b43;
            font-size: 12px;
        }

        .c9-status strong {
            color: #f1d28b;
        }

        .c9-panel {
            background: #172840;
            border: 1px solid #425b78;
            border-radius: 17px;
            padding: 24px;
            margin: 20px 0;
        }

        .c9-panel h3 {
            color: #f1d28b;
            font-size: 23px;
            margin-top: 0;
        }

        .c9-panel p {
            color: #c7d4e5;
            line-height: 1.8;
        }

        .c9-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 14px;
            margin: 20px 0;
        }

        .c9-evidence-card {
            background: linear-gradient(#293f5d, #192b42);
            border: 1px solid #627c99;
            border-radius: 13px;
            padding: 18px 12px;
            text-align: center;
            min-width: 0;
        }

        .c9-evidence-card.done {
            border-color: #65d9a1;
            background: linear-gradient(#205343, #192e38);
        }

        .c9-icon {
            font-size: 43px;
            margin-bottom: 12px;
        }

        .c9-evidence-card h4 {
            color: #fff;
            font-size: 15px;
            margin: 8px 0;
        }

        .c9-evidence-card small {
            display: block;
            color: #b8c9dd;
            margin-bottom: 10px;
        }

        #case9-screen button {
            cursor: pointer;
            border: none;
            border-radius: 9px;
            padding: 12px 15px;
            font-weight: 800;
            transition: transform .18s, opacity .18s;
        }

        #case9-screen button:hover:not(:disabled) {
            transform: translateY(-2px);
        }

        #case9-screen button:disabled {
            opacity: .48;
            cursor: not-allowed;
        }

        .c9-evidence-card button {
            width: 100%;
            background: #f1d28b;
            color: #18263a;
            font-size: 11px;
        }

        .c9-gold {
            width: 100%;
            background: linear-gradient(135deg, #f8e4ae, #c99c4c);
            color: #182438;
            margin-top: 14px;
        }

        .c9-secondary {
            background: #344d6a;
            color: white;
            margin-top: 16px;
        }

        .c9-document {
            background: #fff9ec;
            color: #27354b;
            border: 5px solid #c9b58c;
            border-radius: 13px;
            padding: 24px;
            margin: 20px 0;
            box-shadow: 0 12px 30px rgba(0,0,0,.18);
        }

        .c9-document h3,
        .c9-document h4 {
            color: #26354b;
        }

        .c9-document p {
            color: #4b596d;
        }

        .c9-document small {
            color: #6c788a;
            font-weight: bold;
        }

        .c9-timeline {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }

        .c9-column {
            background: #101e31;
            border: 1px solid #425d7d;
            border-radius: 12px;
            padding: 15px;
        }

        .c9-column h4 {
            color: #f1d28b;
            margin-top: 0;
        }

        .c9-event {
            display: block;
            width: 100%;
            background: #2c4462;
            border: 1px solid #6b86a5 !important;
            color: white;
            margin: 10px 0;
            text-align: left;
            line-height: 1.6;
        }

        .c9-event small {
            display: block;
            color: #d4e0f0;
            margin-top: 4px;
        }

        .c9-event.selected {
            border-color: #f1d28b !important;
            background: #52617a;
        }

        .c9-event.placed {
            background: #235c4a;
            border-color: #5cdb9d !important;
        }

        .c9-slot {
            border: 1px dashed #7d91aa;
            border-radius: 9px;
            padding: 12px;
            margin: 10px 0;
            color: #b9c9dc;
            min-height: 60px;
        }

        .c9-slot.filled {
            border: 1px solid #d4b677;
            background: #2d4056;
            color: white;
        }

        .c9-slot button {
            background: #9b514f;
            color: white;
            font-size: 11px;
            padding: 6px 9px !important;
            margin-top: 8px;
        }

        .c9-choice-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 18px 0;
        }

        .c9-choice {
            background: #304866;
            color: #fff;
            border: 1px solid #7287a1 !important;
            min-height: 85px;
            line-height: 1.5;
        }

        .c9-choice.selected {
            outline: 3px solid #f1d28b;
            background: #4b6079;
        }

        .c9-feedback {
            margin: 15px 0;
            font-size: 13px;
            font-weight: 700;
            line-height: 1.8;
        }

        .c9-good {
            color: #73e4a7;
        }

        .c9-bad {
            color: #ff9c9c;
        }

        .c9-label {
            display: block;
            color: #eaf1fb;
            font-weight: bold;
            margin: 18px 0 8px;
        }

        .c9-input {
            width: 100%;
            background: #0c1a2d;
            border: 1px solid #7085a0;
            color: white;
            padding: 14px;
            border-radius: 9px;
            font-size: 17px;
        }

        .c9-input:focus {
            outline: 2px solid #f1d28b;
        }

        .c9-journal {
            display: grid;
            gap: 10px;
            margin: 16px 0;
        }

        .c9-journal button {
            background: #2b4360;
            color: white;
            border: 1px solid #7189a5 !important;
            text-align: left;
            line-height: 1.7;
        }

        .c9-journal button.selected {
            outline: 2px solid #f1d28b;
            background: #4b5d74;
        }

        .c9-result {
            background: linear-gradient(135deg, #1d4d3f, #152b42);
            border: 2px solid #ddbd75;
            border-radius: 18px;
            padding: 30px;
            text-align: center;
            margin: 24px 0;
        }

        .c9-result h2 {
            color: #f1d28b;
            font-size: 32px;
        }

        .c9-result p {
            color: #e0eaf6;
            line-height: 1.9;
        }

        .c9-trophy {
            font-size: 68px;
        }

        .c9-reward {
            font-size: 32px;
            color: #73e4a7;
        }

        @media (max-width: 740px) {
            .c9-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .c9-hero {
                padding: 20px;
            }
        }

        @media (max-width: 500px) {
            .c9-grid,
            .c9-timeline,
            .c9-choice-grid {
                grid-template-columns: 1fr;
            }

            .c9-panel {
                padding: 15px;
            }

            .c9-status {
                flex-direction: column;
            }

            .c9-scene {
                gap: 4px;
                padding: 16px 8px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            #case9-screen button {
                transition: none;
            }
        }
    `;

    document.head.appendChild(style);

    const grid = document.querySelector(".case-grid");
    const container = document.querySelector(".game-container");

    if (!grid || !container) {
        console.error("Case 009: Main game elements missing.");
        return;
    }

    // =====================================
    // CASE CARD
    // =====================================

    const card = document.createElement("div");
    card.className = "case-card";

    card.innerHTML = `
        <span class="case-number">CASE 009</span>
        <h3>The Suspicious Sale</h3>
        <p>Revenue Recognition · Timeline Investigation</p>
        <span id="case9-status">LOCKED 🔒</span>
        <button id="start-case9" disabled>LOCKED 🔒</button>
    `;

    grid.appendChild(card);

    // =====================================
    // CASE SCREEN
    // =====================================

    const screen = document.createElement("section");
    screen.id = "case9-screen";
    screen.hidden = true;

    screen.innerHTML = `
        <div class="c9-hero">
            <span class="c9-kicker">
                🔍 AUDIT DETECTIVE · CASE 009
            </span>
            <h2>THE SUSPICIOUS<br><span>SALE</span></h2>
            <p>
                A RM18,000 sale was recorded just before year-end.
                But the delivery records tell a different story.
                Investigate the evidence, reconstruct the timeline
                and decide when revenue can be recognised.
            </p>
        </div>

        <div class="c9-scene">
            <div class="c9-scene-item">
                🏢
                <small>COMPANY</small>
            </div>
            <div class="c9-scene-item">
                🚚
                <small>DELIVERY</small>
            </div>
            <div class="c9-scene-item">
                📦
                <small>CUSTOMER</small>
            </div>
        </div>

        <div class="c9-status">
            <span id="c9-stage-label">
                STAGE 1 · EVIDENCE INVESTIGATION
            </span>
            <strong id="c9-progress">0 / 5 EVIDENCE</strong>
        </div>

        <div id="c9-stage1" class="c9-panel">
            <h3>🔎 Stage 1 — Investigate the Evidence</h3>
            <p>
                Five documents are hidden inside the transaction
                file. Open and collect each one before reconstructing
                the sequence of events.
            </p>

            <div id="c9-evidence-grid" class="c9-grid"></div>

            <div id="c9-document" class="c9-document" hidden>
                <small id="c9-doc-ref"></small>
                <h3 id="c9-doc-title"></h3>
                <strong id="c9-doc-date"></strong>
                <p id="c9-doc-text"></p>
                <button id="c9-collect" class="c9-gold">
                    COLLECT EVIDENCE
                </button>
            </div>

            <button id="c9-next1" class="c9-gold" disabled>
                RECONSTRUCT TIMELINE →
            </button>
        </div>

        <div id="c9-stage2" class="c9-panel" hidden>
            <h3>🕒 Stage 2 — Reconstruct the Timeline</h3>
            <p>
                The documents have been mixed up. Select events
                in chronological order, from the earliest
                to the latest.
            </p>

            <div class="c9-timeline">
                <div class="c9-column">
                    <h4>📂 UNSORTED EVENTS</h4>
                    <div id="c9-unsorted"></div>
                </div>

                <div class="c9-column">
                    <h4>📅 INVESTIGATION TIMELINE</h4>
                    <div id="c9-ordered"></div>
                </div>
            </div>

            <button id="c9-check-timeline" class="c9-gold" disabled>
                VERIFY TIMELINE →
            </button>

            <div id="c9-timeline-feedback"
                class="c9-feedback" aria-live="polite"></div>

            <button id="c9-next2" class="c9-gold" hidden>
                INVESTIGATE REVENUE RECOGNITION →
            </button>
        </div>

        <div id="c9-stage3" class="c9-panel" hidden>
            <h3>⚖️ Stage 3 — Revenue Recognition Verdict</h3>

            <div class="c9-document">
                <h4>📄 CONTRACT REVIEW</h4>
                <p>
                    The sales contract states that control of the
                    goods transfers only when the customer
                    inspects and accepts delivery.
                </p>
                <p>
                    At 31 December 2026, the goods were still
                    held by the seller. The customer accepted
                    them on 5 January 2027.
                </p>
            </div>

            <p>
                Should the RM18,000 sale be recognised as
                revenue in the financial year ended
                31 December 2026?
            </p>

            <div class="c9-choice-grid">
                <button class="c9-choice" data-verdict="yes">
                    ✅ YES — Recognise revenue in 2026
                </button>
                <button class="c9-choice" data-verdict="no">
                    ❌ NO — Defer recognition until 2027
                </button>
            </div>

            <button id="c9-check-verdict" class="c9-gold" disabled>
                SUBMIT REVENUE VERDICT →
            </button>

            <div id="c9-verdict-feedback"
                class="c9-feedback" aria-live="polite"></div>

            <button id="c9-next3" class="c9-gold" hidden>
                PREPARE AUDIT ADJUSTMENT →
            </button>
        </div>

        <div id="c9-stage4" class="c9-panel" hidden>
            <h3>📊 Stage 4 — Final Audit Adjustment</h3>
            <p>
                The accountant recorded the invoice on credit:
                Dr Trade Receivables RM18,000;
                Cr Sales Revenue RM18,000.
                No cash has been received.
            </p>

            <div class="c9-document">
                <h4>FINANCIAL RECORDS — 31 DECEMBER 2026</h4>
                <p>Recorded sales revenue: <strong>RM18,000</strong></p>
                <p>Customer acceptance: <strong>5 January 2027</strong></p>
                <p>
                    Correct 2026 revenue from this transaction:
                    <strong>RM0</strong>
                </p>
            </div>

            <label class="c9-label" for="c9-overstatement">
                01 — Revenue Overstatement (RM)
            </label>
            <input id="c9-overstatement"
                class="c9-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter overstatement">

            <label class="c9-label" for="c9-correct-revenue">
                02 — Correct 2026 Revenue from this Sale (RM)
            </label>
            <input id="c9-correct-revenue"
                class="c9-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter correct revenue">

            <h3>📒 Select the Correct Adjusting Entry</h3>

            <div id="c9-journal" class="c9-journal">
                <button data-entry="A">
                    A — Dr Trade Receivables RM18,000;
                    Cr Sales Revenue RM18,000
                </button>

                <button data-entry="B">
                    B — Dr Sales Revenue RM18,000;
                    Cr Trade Receivables RM18,000
                </button>

                <button data-entry="C">
                    C — Dr Cash RM18,000;
                    Cr Sales Revenue RM18,000
                </button>
            </div>

            <button id="c9-submit" class="c9-gold">
                SUBMIT FINAL AUDIT REPORT →
            </button>

            <div id="c9-final-feedback"
                class="c9-feedback" aria-live="polite"></div>
        </div>

        <div id="c9-result" class="c9-result" hidden>
            <div class="c9-trophy">🏆</div>
            <h2>CASE 009 SOLVED!</h2>

            <p>
                The RM18,000 sale was recognised too early.
                Control transferred on 5 January 2027,
                not in December 2026.
            </p>

            <p>
                Correct 2026 revenue = RM0.
                Revenue overstatement = RM18,000.
            </p>

            <p>
                Adjusting entry:
                Dr Sales Revenue RM18,000;
                Cr Trade Receivables RM18,000.
            </p>

            <h3 id="c9-reward" class="c9-reward">+100 XP</h3>
            <p id="c9-total-xp"></p>

            <button id="c9-finish" class="c9-gold">
                RETURN TO CASE FILES →
            </button>
        </div>

        <button id="c9-back" class="c9-secondary">
            ← BACK TO CASE FILES
        </button>
    `;

    container.appendChild(screen);

    // =====================================
    // MENU & XP
    // =====================================

    function updateMenu() {
        const progress = readProgress();
        const available = progress.has(8);
        const button = $9("start-case9");

        button.disabled = !available;
        button.textContent = available
            ? "START INVESTIGATION"
            : "LOCKED 🔒";

        $9("case9-status").textContent = progress.has(9)
            ? "COMPLETED ✓"
            : available ? "AVAILABLE" : "LOCKED 🔒";
    }

    function updateXP() {
        const progress = readProgress();
        const xp = progress.size * 100;

        if ($9("total-xp")) {
            $9("total-xp").textContent = xp;
        }

        if ($9("detective-rank") && xp >= 900) {
            $9("detective-rank").textContent =
                "Supreme Financial Detective";
        }
    }

    function showCase() {
        if (!readProgress().has(8)) return;

        collected.clear();
        timeline = [];
        selectedEvidence = null;
        verdict = null;
        attempts = 0;
        solved = false;
        stage = 1;

        document.querySelectorAll(
            ".game-container > section"
        ).forEach(section => {
            section.hidden = true;
        });

        screen.hidden = false;

        for (let i = 1; i <= 4; i++) {
            $9("c9-stage" + i).hidden = i !== 1;
        }

        $9("c9-result").hidden = true;
        $9("c9-document").hidden = true;
        $9("c9-next1").disabled = true;
        $9("c9-next2").hidden = true;
        $9("c9-next3").hidden = true;
        $9("c9-check-timeline").disabled = true;
        $9("c9-check-verdict").disabled = true;

        $9("c9-timeline-feedback").textContent = "";
        $9("c9-verdict-feedback").textContent = "";
        $9("c9-final-feedback").textContent = "";

        $9("c9-overstatement").value = "";
        $9("c9-correct-revenue").value = "";
        $9("c9-submit").disabled = false;

        document.querySelectorAll(
            "#c9-journal button, #c9-stage3 .c9-choice"
        ).forEach(button => {
            button.classList.remove("selected");
        });

        selectedEntry = null;

        renderEvidence();
        updateStage();

        window.scrollTo(0, 0);
    }

    function updateStage() {
        const names = {
            1: "STAGE 1 · EVIDENCE INVESTIGATION",
            2: "STAGE 2 · TIMELINE RECONSTRUCTION",
            3: "STAGE 3 · REVENUE VERDICT",
            4: "STAGE 4 · FINAL AUDIT ADJUSTMENT"
        };

        $9("c9-stage-label").textContent = names[stage];

        $9("c9-progress").textContent =
            stage === 1
                ? collected.size + " / 5 EVIDENCE"
                : stage === 2
                    ? timeline.length + " / 5 EVENTS"
                    : stage === 3
                        ? "AWAITING VERDICT"
                        : "FINAL CALCULATION";
    }

    // =====================================
    // STAGE 1 — EVIDENCE
    // =====================================

    function renderEvidence() {
        const grid = $9("c9-evidence-grid");
        grid.innerHTML = "";

        evidence.forEach(item => {
            const done = collected.has(item.id);

            const card = document.createElement("div");
            card.className =
                "c9-evidence-card" + (done ? " done" : "");

            const icon = document.createElement("div");
            icon.className = "c9-icon";
            icon.textContent = item.icon;

            const title = document.createElement("h4");
            title.textContent = item.title;

            const date = document.createElement("small");
            date.textContent = item.date;

            const button = document.createElement("button");
            button.textContent = done
                ? "✓ REVIEW EVIDENCE"
                : "INSPECT EVIDENCE";

            button.addEventListener("click", () => {
                selectedEvidence = item.id;

                $9("c9-doc-ref").textContent = item.ref;
                $9("c9-doc-title").textContent = item.title;
                $9("c9-doc-date").textContent = item.date;
                $9("c9-doc-text").textContent = item.text;

                $9("c9-collect").disabled = done;
                $9("c9-collect").textContent = done
                    ? "✓ EVIDENCE COLLECTED"
                    : "COLLECT EVIDENCE";

                $9("c9-document").hidden = false;

                $9("c9-document").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            });

            card.append(icon, title, date, button);
            grid.appendChild(card);
        });
    }

    $9("c9-collect").addEventListener("click", () => {
        if (!selectedEvidence) return;

        collected.add(selectedEvidence);

        $9("c9-collect").disabled = true;
        $9("c9-collect").textContent =
            "✓ EVIDENCE COLLECTED";

        renderEvidence();
        updateStage();

        if (collected.size === evidence.length) {
            $9("c9-next1").disabled = false;
        }
    });

    $9("c9-next1").addEventListener("click", () => {
        if (collected.size !== evidence.length) return;

        stage = 2;
        $9("c9-stage1").hidden = true;
        $9("c9-stage2").hidden = false;

        renderTimeline();
        updateStage();
        window.scrollTo(0, 0);
    });

    // =====================================
    // STAGE 2 — TIMELINE PUZZLE
    // =====================================

    function renderTimeline() {
        const unsorted = $9("c9-unsorted");
        const ordered = $9("c9-ordered");

        unsorted.innerHTML = "";
        ordered.innerHTML = "";

        timelineShuffled.forEach(id => {
            if (timeline.includes(id)) return;

            const item = evidence.find(entry => entry.id === id);

            const button = document.createElement("button");
            button.className = "c9-event";
            button.textContent = item.icon + " " + item.title;

            const date = document.createElement("small");
            date.textContent = item.date;
            button.appendChild(date);

            button.addEventListener("click", () => {
                if (timeline.length >= evidence.length) return;

                timeline.push(item.id);
                $9("c9-timeline-feedback").textContent = "";
                $9("c9-next2").hidden = true;
                renderTimeline();
                updateStage();
            });

            unsorted.appendChild(button);
        });

        for (let i = 0; i < evidence.length; i++) {
            const slot = document.createElement("div");
            slot.className = "c9-slot";

            const id = timeline[i];

            if (id) {
                const item = evidence.find(entry => entry.id === id);
                slot.classList.add("filled");

                const text = document.createElement("div");
                text.textContent =
                    (i + 1) + ". " + item.icon + " " +
                    item.date + " — " + item.title;

                const remove = document.createElement("button");
                remove.textContent = "REMOVE";

                remove.addEventListener("click", () => {
                    timeline.splice(i, 1);
                    $9("c9-next2").hidden = true;
                    $9("c9-timeline-feedback").textContent = "";
                    renderTimeline();
                    updateStage();
                });

                slot.append(text, remove);
            } else {
                slot.textContent =
                    (i + 1) + ". Select an event";
            }

            ordered.appendChild(slot);
        }

        $9("c9-check-timeline").disabled =
            timeline.length !== evidence.length;
    }

    $9("c9-check-timeline").addEventListener("click", () => {
        if (timeline.length !== evidence.length) return;

        const correct = timeline.every((id, index) => {
            const item = evidence.find(entry => entry.id === id);
            return item.sort === index + 1;
        });

        const feedback = $9("c9-timeline-feedback");

        if (!correct) {
            feedback.textContent =
                "✕ The timeline is incorrect. Review the dates " +
                "and arrange the events from earliest to latest.";
            feedback.className = "c9-feedback c9-bad";
            return;
        }

        feedback.textContent =
            "✓ Timeline verified! The goods remained with the " +
            "seller at 31 December 2026. Control transferred " +
            "on 5 January 2027.";

        feedback.className = "c9-feedback c9-good";
        $9("c9-next2").hidden = false;

        $9("c9-check-timeline").disabled = true;
        $9("c9-unsorted").querySelectorAll("button").forEach(
            button => button.disabled = true
        );
        $9("c9-ordered").querySelectorAll("button").forEach(
            button => button.disabled = true
        );
    });

    $9("c9-next2").addEventListener("click", () => {
        stage = 3;
        $9("c9-stage2").hidden = true;
        $9("c9-stage3").hidden = false;

        updateStage();
        window.scrollTo(0, 0);
    });

    // =====================================
    // STAGE 3 — REVENUE VERDICT
    // =====================================

    document.querySelectorAll(
        "#c9-stage3 .c9-choice"
    ).forEach(button => {
        button.addEventListener("click", () => {
            verdict = button.dataset.verdict;

            document.querySelectorAll(
                "#c9-stage3 .c9-choice"
            ).forEach(option => {
                option.classList.toggle(
                    "selected",
                    option === button
                );
            });

            $9("c9-check-verdict").disabled = false;
        });
    });

    $9("c9-check-verdict").addEventListener("click", () => {
        const feedback = $9("c9-verdict-feedback");

        if (verdict !== "no") {
            feedback.textContent =
                "✕ Incorrect. The invoice date alone is not " +
                "sufficient. The customer had not obtained " +
                "control of the goods by year-end.";
            feedback.className = "c9-feedback c9-bad";
            return;
        }

        feedback.textContent =
            "✓ Correct! Under IFRS 15 / MFRS 15, revenue " +
            "is recognised when the performance obligation " +
            "is satisfied through transfer of control. " +
            "Here, that occurred in January 2027.";

        feedback.className = "c9-feedback c9-good";
        $9("c9-next3").hidden = false;
        $9("c9-check-verdict").disabled = true;
    });

    $9("c9-next3").addEventListener("click", () => {
        stage = 4;
        $9("c9-stage3").hidden = true;
        $9("c9-stage4").hidden = false;

        updateStage();
        window.scrollTo(0, 0);
    });

    // =====================================
    // STAGE 4 — FINAL AUDIT REPORT
    // =====================================

    let selectedEntry = null;

    document.querySelectorAll(
        "#c9-journal button"
    ).forEach(button => {
        button.addEventListener("click", () => {
            selectedEntry = button.dataset.entry;

            document.querySelectorAll(
                "#c9-journal button"
            ).forEach(option => {
                option.classList.toggle(
                    "selected",
                    option === button
                );
            });
        });
    });

    $9("c9-submit").addEventListener("click", () => {
        if (solved) return;

        const overText = $9("c9-overstatement").value.trim();
        const correctText = $9("c9-correct-revenue").value.trim();
        const feedback = $9("c9-final-feedback");

        if (
            overText === "" ||
            correctText === "" ||
            !selectedEntry
        ) {
            feedback.textContent =
                "Enter both amounts and choose a journal entry.";
            feedback.className = "c9-feedback c9-bad";
            return;
        }

        const overCorrect = Number(overText) === 18000;
        const revenueCorrect = Number(correctText) === 0;
        const entryCorrect = selectedEntry === "B";

        if (!overCorrect || !revenueCorrect || !entryCorrect) {
            attempts++;

            let message = "✕ Incorrect. ";

            if (!overCorrect) {
                message += "Review the overstatement. ";
            }

            if (!revenueCorrect) {
                message += "Review correct 2026 revenue. ";
            }

            if (!entryCorrect) {
                message += "Review the reversal entry. ";
            }

            if (attempts >= 2) {
                message +=
                    "Hint: Revenue overstatement = RM18,000; " +
                    "correct 2026 revenue = RM0. " +
                    "Reverse the original credit sale.";
            }

            feedback.textContent = message;
            feedback.className = "c9-feedback c9-bad";
            return;
        }

        solved = true;

        const progress = readProgress();
        const firstCompletion = !progress.has(9);

        progress.add(9);
        saveProgress(progress);

        // Synchronise with the original game's progress set.
        if (typeof completedCases !== "undefined") {
            completedCases.add(9);
        }

        const xp = progress.size * 100;

        $9("c9-reward").textContent = firstCompletion
            ? "+100 XP"
            : "CASE ALREADY COMPLETED";

        $9("c9-total-xp").textContent =
            "TOTAL XP: " + xp;

        $9("c9-stage4").hidden = true;
        $9("c9-result").hidden = false;

        updateMenu();
        updateXP();

        window.scrollTo(0, 0);
    });

    // =====================================
    // NAVIGATION
    // =====================================

    function backToMenu() {
        screen.hidden = true;
        $9("welcome-screen").hidden = false;

        updateMenu();
        updateXP();

        window.scrollTo(0, 0);
    }

    $9("start-case9").addEventListener("click", showCase);
    $9("c9-back").addEventListener("click", backToMenu);
    $9("c9-finish").addEventListener("click", backToMenu);

    updateMenu();
    updateXP();
})();
