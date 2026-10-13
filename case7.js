
"use strict";

/*
  AUDIT DETECTIVE — CASE 007
  The Equipment Upgrade
  Standalone expansion for Cases 001–006.
*/

(() => {
    const $7 = id => document.getElementById(id);

    const items = [
        {
            id: "machine",
            icon: "🏭",
            title: "New Production Machine",
            reference: "INV-M001",
            amount: 15000,
            category: "capital",
            reason: "The machine is a new asset expected to provide future economic benefits.",
            detail: "A new production machine was purchased for use in the factory."
        },
        {
            id: "installation",
            icon: "🔧",
            title: "Machine Installation",
            reference: "INV-I002",
            amount: 2000,
            category: "capital",
            reason: "Installation is directly attributable to bringing the new machine into working condition.",
            detail: "Professional technicians installed and tested the new machine before it was ready for use."
        },
        {
            id: "upgrade",
            icon: "⚙️",
            title: "Capacity Upgrade",
            reference: "INV-U003",
            amount: 3000,
            category: "capital",
            reason: "The upgrade increases the machine's productive capacity and provides additional future benefits.",
            detail: "A permanent upgrade increases the production capacity of the equipment."
        },
        {
            id: "maintenance",
            icon: "🧰",
            title: "Routine Servicing",
            reference: "INV-S004",
            amount: 600,
            category: "revenue",
            reason: "Routine servicing maintains normal operating condition without improving the asset.",
            detail: "The older factory machine received its regular scheduled maintenance."
        },
        {
            id: "repair",
            icon: "🛠️",
            title: "Ordinary Repair",
            reference: "INV-R005",
            amount: 400,
            category: "revenue",
            reason: "The repair restores normal function and does not increase capacity or useful life.",
            detail: "A worn component on an existing machine was replaced to restore normal operation."
        }
    ];

    let inspected = new Set();
    let classified = new Map();
    let selectedItem = null;
    let stage = 1;
    let attempts = 0;

    const css = document.createElement("style");
    css.textContent = `
        #case7-screen {
            color: #edf3fc;
            background: #0d1626;
            border-radius: 18px;
            padding: 20px;
            margin: 12px 0 30px;
            box-sizing: border-box;
        }

        #case7-screen * {
            box-sizing: border-box;
        }

        .c7-hero {
            position: relative;
            overflow: hidden;
            border: 1px solid #8e7244;
            border-radius: 20px;
            padding: 30px;
            background:
                radial-gradient(circle at 85% 15%,
                    rgba(233,190,102,.2), transparent 40%),
                linear-gradient(135deg, #1d324d, #0a1322);
        }

        .c7-eyebrow {
            display: inline-block;
            color: #eacb83;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            margin-bottom: 12px;
        }

        .c7-hero h2 {
            font-size: clamp(30px, 6vw, 56px);
            line-height: 1.08;
            color: #fff;
            margin: 10px 0;
        }

        .c7-hero h2 span {
            color: #eacb83;
        }

        .c7-hero p {
            max-width: 620px;
            line-height: 1.8;
            color: #c4d2e4;
        }

        .c7-factory {
            margin: 25px 0;
            min-height: 220px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            border: 1px solid #536781;
            background:
                repeating-linear-gradient(
                    90deg,
                    transparent 0 80px,
                    rgba(255,255,255,.025) 80px 82px
                ),
                linear-gradient(#253d58, #142238);
        }

        .c7-machine {
            text-align: center;
            font-size: 94px;
            filter: drop-shadow(0 14px 18px rgba(0,0,0,.4));
        }

        .c7-factory-label {
            position: absolute;
            bottom: 14px;
            left: 14px;
            color: #eacb83;
            background: rgba(8,18,32,.8);
            padding: 9px 12px;
            border-radius: 8px;
            font-size: 11px;
            letter-spacing: 1px;
        }

        .c7-progress {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 17px;
            margin: 20px 0;
            border: 1px solid #405572;
            border-radius: 12px;
            background: #172840;
            font-size: 12px;
        }

        .c7-progress strong {
            color: #eacb83;
        }

        .c7-panel {
            background: #172840;
            border: 1px solid #415773;
            border-radius: 16px;
            padding: 22px;
            margin: 22px 0;
        }

        .c7-panel h3 {
            color: #eacb83;
            font-size: 22px;
            margin-top: 0;
        }

        .c7-panel p {
            color: #c4d2e4;
            line-height: 1.75;
        }

        .c7-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 13px;
            margin: 20px 0;
        }

        .c7-card {
            border: 1px solid #58708e;
            border-radius: 13px;
            background: linear-gradient(#263d5b, #192b43);
            padding: 18px 12px;
            text-align: center;
            min-width: 0;
        }

        .c7-card.inspected,
        .c7-card.correct {
            border-color: #5ecb96;
        }

        .c7-icon {
            font-size: 45px;
            margin-bottom: 10px;
        }

        .c7-card h4 {
            color: #fff;
            margin: 10px 0;
            font-size: 15px;
        }

        .c7-card small {
            display: block;
            color: #aabbd0;
            margin-bottom: 10px;
        }

        .c7-price {
            color: #eacb83;
            font-weight: 900;
            font-size: 20px;
            margin: 12px 0;
        }

        #case7-screen button {
            cursor: pointer;
            border: none;
            border-radius: 9px;
            padding: 12px 16px;
            font-weight: 800;
            transition: transform .2s, opacity .2s;
        }

        #case7-screen button:hover:not(:disabled) {
            transform: translateY(-2px);
        }

        #case7-screen button:disabled {
            cursor: not-allowed;
            opacity: .48;
        }

        .c7-card button {
            width: 100%;
            background: #eacb83;
            color: #182337;
            font-size: 11px;
        }

        .c7-primary {
            background: linear-gradient(135deg, #f5dfaa, #c59a4d);
            color: #172236;
            width: 100%;
            margin-top: 12px;
        }

        .c7-secondary {
            background: #354c69;
            color: white;
            margin-top: 14px;
        }

        .c7-document {
            background: #fff9eb;
            color: #263347;
            border: 5px solid #c9b68a;
            border-radius: 12px;
            padding: 22px;
            margin-top: 18px;
        }

        .c7-document h3 {
            color: #263347;
        }

        .c7-document p {
            color: #4c596b;
        }

        .c7-document small {
            color: #687486;
            font-weight: bold;
        }

        .c7-document strong {
            display: block;
            font-size: 26px;
            margin: 12px 0;
        }

        .c7-choice-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 15px;
        }

        .c7-capital {
            background: #33699d;
            color: white;
        }

        .c7-revenue {
            background: #9b6540;
            color: white;
        }

        .c7-feedback {
            margin-top: 15px;
            line-height: 1.7;
            font-weight: 700;
            font-size: 13px;
        }

        .c7-success {
            color: #72e6a6;
        }

        .c7-error {
            color: #ff9b9b;
        }

        .c7-working {
            background: #fff9eb;
            color: #263347;
            border-radius: 13px;
            padding: 23px;
            margin: 20px 0;
        }

        .c7-working h3 {
            color: #263347;
        }

        .c7-working-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            padding: 13px 0;
            border-bottom: 1px solid #d9cdb5;
        }

        .c7-working-row strong {
            white-space: nowrap;
        }

        .c7-input-label {
            display: block;
            margin: 17px 0 8px;
            color: #e8edf6;
            font-weight: bold;
        }

        .c7-input {
            width: 100%;
            padding: 14px;
            border-radius: 9px;
            border: 1px solid #6b819c;
            background: #0d1b2d;
            color: white;
            font-size: 17px;
        }

        .c7-input:focus {
            outline: 2px solid #eacb83;
        }

        .c7-finish {
            text-align: center;
            padding: 25px;
            border-radius: 16px;
            border: 2px solid #d4b573;
            background: linear-gradient(135deg, #1b443c, #172840);
        }

        .c7-finish h2 {
            color: #eacb83;
            font-size: 32px;
        }

        .c7-finish p {
            line-height: 1.8;
        }

        .c7-trophy {
            font-size: 64px;
        }

        [hidden] {
            display: none !important;
        }

        @media (max-width: 700px) {
            .c7-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .c7-hero {
                padding: 20px;
            }
        }

        @media (max-width: 440px) {
            .c7-grid,
            .c7-choice-row {
                grid-template-columns: 1fr;
            }
            .c7-progress {
                flex-direction: column;
            }
            .c7-machine {
                font-size: 70px;
            }
            .c7-panel {
                padding: 15px;
            }
        }
    `;
    document.head.appendChild(css);

    const menuGrid = document.querySelector(".case-grid");
    if (!menuGrid) {
        console.error("Case 007: Case grid not found.");
        return;
    }

    const card = document.createElement("div");
    card.className = "case-card";
    card.innerHTML = `
        <span class="case-number">CASE 007</span>
        <h3>The Equipment Upgrade</h3>
        <p>Capital vs Revenue · Equipment Inspection</p>
        <span id="case7-status">LOCKED 🔒</span>
        <button id="start-case7" disabled>LOCKED 🔒</button>
    `;
    menuGrid.appendChild(card);

    const screen = document.createElement("section");
    screen.id = "case7-screen";
    screen.hidden = true;

    screen.innerHTML = `
        <div class="c7-hero">
            <span class="c7-eyebrow">
                🔍 AUDIT DETECTIVE · CASE 007
            </span>
            <h2>THE EQUIPMENT<br><span>UPGRADE</span></h2>
            <p>
                The factory accountant recorded every equipment-related
                payment as an asset. Some costs should have been expensed.
                Inspect the evidence and correct the financial records.
            </p>
        </div>

        <div class="c7-factory">
            <div class="c7-machine">🏭⚙️</div>
            <div class="c7-factory-label">
                INDUSTRIAL WORKSHOP · EVIDENCE LOCATION
            </div>
        </div>

        <div class="c7-progress">
            <span id="c7-stage-label">STAGE 1 · EQUIPMENT INSPECTION</span>
            <strong id="c7-count">0 / 5 DOCUMENTS</strong>
        </div>

        <div id="c7-stage1" class="c7-panel">
            <h3>🔧 Stage 1 — Inspect the Equipment</h3>
            <p>
                Five documents were found in the factory.
                Open each document and examine the accounting evidence.
            </p>
            <div id="c7-inspection-grid" class="c7-grid"></div>

            <div id="c7-inspection-document"
                class="c7-document" hidden>
                <small id="c7-doc-reference"></small>
                <h3 id="c7-doc-title"></h3>
                <strong id="c7-doc-amount"></strong>
                <p id="c7-doc-description"></p>
                <button id="c7-collect" class="c7-primary">
                    COLLECT EVIDENCE
                </button>
            </div>

            <button id="c7-to-stage2" class="c7-primary" disabled>
                CLASSIFY EXPENDITURE →
            </button>
        </div>

        <div id="c7-stage2" class="c7-panel" hidden>
            <h3>📂 Stage 2 — Classify Expenditure</h3>
            <p>
                Review each document and decide whether it should
                be capitalised or expensed.
            </p>

            <div id="c7-classify-document" class="c7-document">
                <small id="c7-classify-reference"></small>
                <h3 id="c7-classify-title"></h3>
                <strong id="c7-classify-amount"></strong>
                <p id="c7-classify-description"></p>
            </div>

            <div class="c7-choice-row">
                <button id="c7-choose-capital" class="c7-capital">
                    🏗️ CAPITAL EXPENDITURE
                </button>
                <button id="c7-choose-revenue" class="c7-revenue">
                    🧾 REVENUE EXPENDITURE
                </button>
            </div>

            <div id="c7-classify-feedback"
                class="c7-feedback" aria-live="polite"></div>

            <button id="c7-next-document"
                class="c7-primary" hidden>
                NEXT DOCUMENT →
            </button>

            <button id="c7-to-stage3"
                class="c7-primary" hidden>
                PREPARE FINAL AUDIT REPORT →
            </button>
        </div>

        <div id="c7-stage3" class="c7-panel" hidden>
            <h3>📊 Stage 3 — Final Audit Calculation</h3>
            <p>
                Use your classification results to calculate the
                correct capital and revenue expenditure.
            </p>

            <div class="c7-working">
                <h3>Equipment Cost Working Paper</h3>
                <div id="c7-working-rows"></div>
            </div>

            <label class="c7-input-label" for="c7-capital-answer">
                Total Capital Expenditure (RM)
            </label>
            <input id="c7-capital-answer"
                class="c7-input" type="number"
                min="0" step="0.01"
                placeholder="Enter capital amount">

            <label class="c7-input-label" for="c7-revenue-answer">
                Total Revenue Expenditure (RM)
            </label>
            <input id="c7-revenue-answer"
                class="c7-input" type="number"
                min="0" step="0.01"
                placeholder="Enter revenue amount">

            <button id="c7-submit" class="c7-primary">
                SUBMIT AUDIT REPORT →
            </button>

            <div id="c7-final-feedback"
                class="c7-feedback" aria-live="polite"></div>
        </div>

        <div id="c7-result" class="c7-finish" hidden>
            <div class="c7-trophy">🏆</div>
            <h2>CASE 007 SOLVED!</h2>
            <p>
                Capital expenditure = RM15,000 + RM2,000
                + RM3,000 = RM20,000.
            </p>
            <p>
                Revenue expenditure = RM600 + RM400
                = RM1,000.
            </p>
            <p>
                The accountant incorrectly capitalised RM1,000
                of routine expenses. The equipment asset was
                overstated by RM1,000 before depreciation effects.
            </p>
            <h3 id="c7-reward">+100 XP</h3>
            <p id="c7-total-xp"></p>
            <button id="c7-finish" class="c7-primary">
                RETURN TO CASE FILES →
            </button>
        </div>

        <button id="c7-back" class="c7-secondary">
            ← BACK TO CASE FILES
        </button>
    `;

    const container = document.querySelector(".game-container");
    container.appendChild(screen);

    function readCompleted() {
        try {
            const saved = JSON.parse(
                localStorage.getItem("auditDetectiveProgress")
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

    function updateCase7Menu() {
        const completed = readCompleted();
        const unlocked = completed.has(6);
        const button = $7("start-case7");

        button.disabled = !unlocked;
        button.textContent = unlocked
            ? "START INVESTIGATION"
            : "LOCKED 🔒";

        $7("case7-status").textContent = completed.has(7)
            ? "COMPLETED ✓"
            : unlocked ? "AVAILABLE" : "LOCKED 🔒";
    }

    function showCase7() {
        const completed = readCompleted();
        if (!completed.has(6)) return;

        inspected.clear();
        classified.clear();
        selectedItem = null;
        stage = 1;
        attempts = 0;

        document.querySelectorAll(
            ".game-container > section"
        ).forEach(section => {
            section.hidden = true;
        });

        screen.hidden = false;

        $7("c7-stage1").hidden = false;
        $7("c7-stage2").hidden = true;
        $7("c7-stage3").hidden = true;
        $7("c7-result").hidden = true;
        $7("c7-inspection-document").hidden = true;
        $7("c7-to-stage2").disabled = true;

        $7("c7-capital-answer").value = "";
        $7("c7-revenue-answer").value = "";
        $7("c7-capital-answer").disabled = false;
        $7("c7-revenue-answer").disabled = false;
        $7("c7-submit").disabled = false;
        $7("c7-final-feedback").textContent = "";

        renderInspection();
        updateStageLabel();
        window.scrollTo(0, 0);
    }

    function updateStageLabel() {
        const labels = {
            1: "STAGE 1 · EQUIPMENT INSPECTION",
            2: "STAGE 2 · CLASSIFICATION",
            3: "STAGE 3 · FINAL AUDIT REPORT"
        };

        $7("c7-stage-label").textContent = labels[stage];

        const count = stage === 1
            ? inspected.size : classified.size;

        $7("c7-count").textContent =
            count + " / 5 DOCUMENTS";
    }

    function renderInspection() {
        const grid = $7("c7-inspection-grid");
        grid.innerHTML = "";

        items.forEach(item => {
            const done = inspected.has(item.id);
            const card = document.createElement("div");

            card.className = "c7-card" +
                (done ? " inspected" : "");

            const icon = document.createElement("div");
            icon.className = "c7-icon";
            icon.textContent = item.icon;

            const title = document.createElement("h4");
            title.textContent = item.title;

            const reference = document.createElement("small");
            reference.textContent = item.reference;

            const price = document.createElement("div");
            price.className = "c7-price";
            price.textContent =
                "RM" + item.amount.toLocaleString();

            const button = document.createElement("button");
            button.textContent = done
                ? "✓ REVIEW DOCUMENT"
                : "INSPECT DOCUMENT";

            button.addEventListener("click", () => {
                selectedItem = item.id;
                $7("c7-doc-reference").textContent = item.reference;
                $7("c7-doc-title").textContent = item.title;
                $7("c7-doc-amount").textContent =
                    "RM" + item.amount.toLocaleString();
                $7("c7-doc-description").textContent = item.detail;

                $7("c7-collect").disabled = done;
                $7("c7-collect").textContent = done
                    ? "✓ EVIDENCE COLLECTED"
                    : "COLLECT EVIDENCE";

                $7("c7-inspection-document").hidden = false;
                $7("c7-inspection-document").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            });

            card.append(icon, title, reference, price, button);
            grid.appendChild(card);
        });
    }

    $7("c7-collect").addEventListener("click", () => {
        if (!selectedItem) return;

        inspected.add(selectedItem);
        $7("c7-collect").disabled = true;
        $7("c7-collect").textContent = "✓ EVIDENCE COLLECTED";

        renderInspection();
        updateStageLabel();

        if (inspected.size === items.length) {
            $7("c7-to-stage2").disabled = false;
        }
    });

    $7("c7-to-stage2").addEventListener("click", () => {
        if (inspected.size !== items.length) return;

        stage = 2;
        $7("c7-stage1").hidden = true;
        $7("c7-stage2").hidden = false;

        renderClassification();
        updateStageLabel();
        window.scrollTo(0, 0);
    });

    function renderClassification() {
        const item = items[classified.size];

        if (!item) return;

        $7("c7-classify-reference").textContent = item.reference;
        $7("c7-classify-title").textContent =
            item.icon + " " + item.title;
        $7("c7-classify-amount").textContent =
            "RM" + item.amount.toLocaleString();
        $7("c7-classify-description").textContent = item.detail;

        $7("c7-classify-feedback").textContent = "";
        $7("c7-classify-feedback").className = "c7-feedback";

        $7("c7-choose-capital").disabled = false;
        $7("c7-choose-revenue").disabled = false;
        $7("c7-next-document").hidden = true;
        $7("c7-to-stage3").hidden = true;
    }

    function classify(category) {
        const item = items[classified.size];
        if (!item) return;

        const feedback = $7("c7-classify-feedback");

        if (category !== item.category) {
            feedback.textContent =
                "✕ Incorrect. Think about whether this cost " +
                "creates or improves future economic benefits, " +
                "or simply maintains normal operations.";
            feedback.className = "c7-feedback c7-error";
            return;
        }

        classified.set(item.id, category);

        feedback.textContent = "✓ Correct! " + item.reason;
        feedback.className = "c7-feedback c7-success";

        $7("c7-choose-capital").disabled = true;
        $7("c7-choose-revenue").disabled = true;

        if (classified.size === items.length) {
            $7("c7-to-stage3").hidden = false;
        } else {
            $7("c7-next-document").hidden = false;
        }

        updateStageLabel();
    }

    $7("c7-choose-capital").addEventListener("click", () => {
        classify("capital");
    });

    $7("c7-choose-revenue").addEventListener("click", () => {
        classify("revenue");
    });

    $7("c7-next-document").addEventListener("click", () => {
        renderClassification();
    });

    $7("c7-to-stage3").addEventListener("click", () => {
        if (classified.size !== items.length) return;

        stage = 3;
        $7("c7-stage2").hidden = true;
        $7("c7-stage3").hidden = false;

        const rows = $7("c7-working-rows");
        rows.innerHTML = "";

        items.forEach(item => {
            const row = document.createElement("div");
            row.className = "c7-working-row";

            const title = document.createElement("span");
            title.textContent =
                item.title + " (" +
                (item.category === "capital" ? "Capital" : "Revenue") +
                ")";

            const amount = document.createElement("strong");
            amount.textContent =
                "RM" + item.amount.toLocaleString();

            row.append(title, amount);
            rows.appendChild(row);
        });

        updateStageLabel();
        window.scrollTo(0, 0);
    });

    $7("c7-submit").addEventListener("click", () => {
        if (classified.size !== items.length) return;

        const capitalText = $7("c7-capital-answer").value.trim();
        const revenueText = $7("c7-revenue-answer").value.trim();
        const feedback = $7("c7-final-feedback");

        if (!capitalText || !revenueText) {
            feedback.textContent = "Please enter both amounts.";
            feedback.className = "c7-feedback c7-error";
            return;
        }

        const capitalCorrect = Number(capitalText) === 20000;
        const revenueCorrect = Number(revenueText) === 1000;

        if (!capitalCorrect || !revenueCorrect) {
            attempts++;

            feedback.textContent = attempts >= 2
                ? "Hint: Capital = 15,000 + 2,000 + 3,000. Revenue = 600 + 400."
                : "Incorrect. Review your classified documents.";

            feedback.className = "c7-feedback c7-error";
            return;
        }

        feedback.textContent = "✓ Correct audit calculations!";
        feedback.className = "c7-feedback c7-success";

        $7("c7-capital-answer").disabled = true;
        $7("c7-revenue-answer").disabled = true;
        $7("c7-submit").disabled = true;

        const completed = readCompleted();
        const first = !completed.has(7);
        completed.add(7);

        try {
            localStorage.setItem(
                "auditDetectiveProgress",
                JSON.stringify({
                    completed: [...completed].sort((a, b) => a - b)
                })
            );
        } catch (error) {
            console.warn("Could not save Case 007 progress.", error);
        }

        // Update the shared in-memory progress used by Cases 001–006.
        if (typeof completedCases !== "undefined") {
            completedCases.add(7);
        }

        const xp = completed.size * 100;

        $7("total-xp").textContent = xp;
        $7("detective-rank").textContent =
            "Expert Audit Detective";

        $7("c7-reward").textContent =
            first ? "+100 XP" : "CASE ALREADY COMPLETED";
        $7("c7-total-xp").textContent =
            "TOTAL XP: " + xp;

        updateCase7Menu();

        $7("c7-stage3").hidden = true;
        $7("c7-result").hidden = false;
        window.scrollTo(0, 0);
    });

    function backToMenu() {
        screen.hidden = true;
        $7("welcome-screen").hidden = false;
        updateCase7Menu();

        const completed = readCompleted();
        $7("total-xp").textContent = completed.size * 100;

        window.scrollTo(0, 0);
    }

    $7("start-case7").addEventListener("click", showCase7);
    $7("c7-back").addEventListener("click", backToMenu);
    $7("c7-finish").addEventListener("click", backToMenu);

    updateCase7Menu();
})();
