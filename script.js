
"use strict";

const $ = id => document.getElementById(id);

const screens = {
    menu: $("welcome-screen"),
    investigation: $("investigation-screen"),
    puzzle: $("puzzle-screen"),
    matching: $("matching-screen"),
    reconciliation: $("reconciliation-screen"),
    sorting: $("sorting-screen"),
    accrual: $("accrual-screen")
};

const officeRoom = $("office-room");
const warehouseRoom = $("warehouse-room");
const evidenceModal = $("evidence-modal");
const managerModal = $("manager-modal");
const notebookModal = $("notebook-modal");

const cases = {
    1: {
        number: "CASE 001",
        title: "The Missing RM500",
        topic: "DEPRECIATION INVESTIGATION",
        instruction: "Find three accounting documents in the office.",
        objective: "Verify annual depreciation and identify any overstatement or understatement.",
        formula: "Straight-line depreciation = (Cost - Residual Value) / Useful Life.",
        evidence: {
            computer: {
                objectName: "COMPUTER",
                introduction: "You found the company's computer containing financial records.",
                action: "EXAMINE COMPUTER",
                evidenceTitle: "DEPRECIATION RECORD",
                evidenceDescription: "Reported annual depreciation: RM2,500. Method: Straight-line.",
                label: "💻 Depreciation Record"
            },
            invoice: {
                objectName: "FILE CABINET",
                introduction: "You discovered purchase documents in the cabinet.",
                action: "OPEN CABINET",
                evidenceTitle: "PURCHASE INVOICE",
                evidenceDescription: "Equipment purchase cost: RM10,000.",
                label: "🧾 Purchase Invoice"
            },
            asset: {
                objectName: "ASSET FILE",
                introduction: "You found the company's fixed asset register.",
                action: "EXAMINE FILE",
                evidenceTitle: "FIXED ASSET REGISTER",
                evidenceDescription: "Useful life: 5 years. Residual value: RM0.",
                label: "📁 Asset Register"
            }
        },
        facts: [
            ["PURCHASE COST", "RM10,000"],
            ["USEFUL LIFE", "5 YEARS"],
            ["RESIDUAL VALUE", "RM0"],
            ["REPORTED DEPRECIATION", "RM2,500"]
        ],
        question: "Calculate correct annual depreciation and the difference from the reported amount.",
        labels: ["Correct Annual Depreciation (RM)", "Difference (RM)"],
        answers: [2000, 500],
        hint: "Straight-line depreciation = (Cost - Residual Value) / Useful Life.",
        explanation: "Correct depreciation = (RM10,000 - RM0) / 5 = RM2,000. Depreciation was overstated by RM500."
    },
    2: {
        number: "CASE 002",
        title: "Warehouse Mystery",
        topic: "INVENTORY VALUATION INVESTIGATION",
        instruction: "Inspect the computer, inventory boxes and sales assessment report.",
        objective: "Determine inventory value using the lower of cost and net realisable value.",
        formula: "NRV = Selling Price - Costs to Complete and Sell. Inventory = Lower of Cost and NRV.",
        evidence: {
            computer: {
                objectName: "WAREHOUSE COMPUTER",
                introduction: "You discovered the inventory management computer.",
                action: "CHECK INVENTORY SYSTEM",
                evidenceTitle: "INVENTORY REPORT",
                evidenceDescription: "Inventory is recorded at RM8,000 in the financial statements.",
                label: "💻 Inventory Report"
            },
            invoice: {
                objectName: "INVENTORY BOXES",
                introduction: "You found inventory boxes stored in the warehouse.",
                action: "INSPECT INVENTORY",
                evidenceTitle: "INVENTORY COST RECORD",
                evidenceDescription: "Original inventory cost: RM8,000.",
                label: "📦 Inventory Cost"
            },
            asset: {
                objectName: "SALES ASSESSMENT REPORT",
                introduction: "You found a report showing selling price and selling costs.",
                action: "READ ASSESSMENT",
                evidenceTitle: "NET REALISABLE VALUE REPORT",
                evidenceDescription: "Estimated selling price: RM7,500. Estimated selling costs: RM500.",
                label: "📋 NRV Report"
            }
        },
        facts: [
            ["INVENTORY COST", "RM8,000"],
            ["SELLING PRICE", "RM7,500"],
            ["SELLING COSTS", "RM500"],
            ["REPORTED INVENTORY", "RM8,000"]
        ],
        question: "Calculate NRV and correct inventory value.",
        labels: ["Net Realisable Value (RM)", "Correct Inventory Value (RM)"],
        answers: [7000, 7000],
        hint: "NRV = Selling Price - Selling Costs. Use the lower of cost and NRV.",
        explanation: "NRV = RM7,500 - RM500 = RM7,000. Inventory was overstated by RM1,000."
    },
    3: {
        number: "CASE 003",
        title: "The Cash Discrepancy",
        objective: "Match Cash Book and Bank Statement transactions, then reconcile balances.",
        formula: "Adjusted Cash Book = Cash Book - Bank Charges. Adjusted Bank Statement = Bank Balance + Deposits in Transit - Outstanding Cheques."
    },
    4: {
        number: "CASE 004",
        title: "The Unpaid Invoice",
        objective: "Identify expenses incurred before 31 December 2026 that remain unpaid and unrecorded.",
        formula: "Accrued expense = Expense incurred but not yet paid or recorded. Dr Expense, Cr Accrued Expenses."
    },
    5: {
        number: "CASE 005",
        title: "The Insurance Trap",
        objective: "Arrange the insurance timeline and calculate expense and prepayment.",
        formula: "Monthly premium = Annual Premium / 12. Expense = Monthly Premium × Months Used. Prepayment = Monthly Premium × Unused Months."
    },
    6: {
        number: "CASE 006",
        title: "The Vanishing Receivable",
        objective: "Investigate three customers, identify the irrecoverable debt, calculate the required allowance, and determine net trade receivables.",
        formula: "Receivables after write-off = Gross Receivables - Bad Debt. Required Allowance = Remaining Receivables × 5%. Net Receivables = Remaining Receivables - Allowance."
    }
};

// =====================================================
// SAVE SYSTEM
// =====================================================

function loadProgress() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("auditDetectiveProgress")
        );
        if (saved && Array.isArray(saved.completed)) {
            return saved.completed.filter(
                id => Number.isInteger(id) && id >= 1 && id <= 6
            );
        }
    } catch (error) {
        console.warn("Progress could not be loaded.", error);
    }
    return [];
}

const completedCases = new Set(loadProgress());

function saveProgress() {
    try {
        localStorage.setItem(
            "auditDetectiveProgress",
            JSON.stringify({ completed: [...completedCases] })
        );
    } catch (error) {
        console.warn("Progress could not be saved.", error);
    }
}

function updateProgress() {
    const xp = completedCases.size * 100;
    $("total-xp").textContent = xp;
    $("detective-rank").textContent =
        xp >= 600 ? "Chief Audit Detective" :
        xp >= 500 ? "Master Financial Detective" :
        xp >= 400 ? "Elite Financial Detective" :
        xp >= 300 ? "Senior Financial Detective" :
        xp >= 200 ? "Financial Investigator" :
        "Junior Detective";

    for (let id = 1; id <= 6; id++) {
        const button = $("start-case" + id);
        const status = $("case" + id + "-status");
        const unlocked = id === 1 || completedCases.has(id - 1);

        button.disabled = !unlocked;
        button.textContent = unlocked
            ? "START INVESTIGATION" : "LOCKED 🔒";
        status.textContent = completedCases.has(id)
            ? "COMPLETED ✓"
            : unlocked ? "AVAILABLE" : "LOCKED 🔒";
    }
}

function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => {
        element.hidden = key !== name;
    });
    window.scrollTo(0, 0);
}

function returnToMenu() {
    evidenceModal.hidden = true;
    managerModal.hidden = true;
    notebookModal.hidden = true;
    showScreen("menu");
}

$("back-to-menu").addEventListener("click", returnToMenu);
$("matching-back").addEventListener("click", returnToMenu);
$("sorting-back").addEventListener("click", returnToMenu);
$("finish-case4").addEventListener("click", returnToMenu);

// =====================================================
// CASE 001 & 002 — POINT AND CLICK
// =====================================================

let currentCase = 1;
let collectedEvidence = new Set();
let selectedEvidence = null;
let attempts = 0;
let notebookReturnFocus = null;

function beginCase(id) {
    if (id > 1 && !completedCases.has(id - 1)) return;

    if (id === 3) return beginMatchingCase();
    if (id === 4) return beginSortingCase();
    if (id === 5) return beginTimelineCase();
    if (id === 6) return beginSuspectCase();

    currentCase = id;
    collectedEvidence.clear();
    selectedEvidence = null;
    attempts = 0;

    const data = cases[id];
    $("current-case-number").textContent = data.number;
    $("current-case-title").textContent = data.title;
    $("mission-instruction").textContent = data.instruction;

    officeRoom.hidden = id !== 1;
    warehouseRoom.hidden = id !== 2;
    $("evidence-count").textContent = "0";
    $("inventory-items").textContent = "No evidence collected yet.";
    $("solve-button").disabled = true;
    $("solve-button").textContent = "SOLVE THE CASE 🔒";

    document.querySelectorAll(".object").forEach(object =>
        object.classList.remove("collected")
    );

    $("answer1").value = "";
    $("answer2").value = "";
    $("answer1").disabled = false;
    $("answer2").disabled = false;
    $("submit-puzzle").disabled = false;
    $("puzzle-feedback").textContent = "";
    $("puzzle-feedback").className = "";
    $("case-result").hidden = true;

    evidenceModal.hidden = true;
    managerModal.hidden = true;
    notebookModal.hidden = true;

    updateNotebook();
    showScreen("investigation");

    if (id === 2) {
        managerModal.hidden = false;
        $("manager-continue").focus();
    }
}

$("manager-continue").addEventListener("click", () => {
    managerModal.hidden = true;
});

document.querySelectorAll(".object").forEach(object => {
    object.addEventListener("click", () => {
        const room = currentCase === 1 ? officeRoom : warehouseRoom;
        if (!room.contains(object)) return;

        selectedEvidence = object.dataset.evidence;
        const evidence = cases[currentCase].evidence[selectedEvidence];
        if (!evidence) return;

        $("modal-step").textContent = "OBJECT DISCOVERED";
        $("modal-title").textContent = evidence.objectName;
        $("modal-description").textContent = evidence.introduction;
        $("examine-button").textContent = evidence.action;
        $("examine-button").hidden = false;
        $("collect-button").hidden = true;
        evidenceModal.hidden = false;
        $("examine-button").focus();
    });
});

$("examine-button").addEventListener("click", () => {
    if (!selectedEvidence) return;

    const evidence = cases[currentCase].evidence[selectedEvidence];
    $("modal-step").textContent = "ACCOUNTING EVIDENCE";
    $("modal-title").textContent = evidence.evidenceTitle;
    $("modal-description").textContent = evidence.evidenceDescription;
    $("examine-button").hidden = true;
    $("collect-button").hidden =
        collectedEvidence.has(selectedEvidence);

    if (!$("collect-button").hidden) {
        $("collect-button").focus();
    } else {
        $("close-button").focus();
    }
});

$("collect-button").addEventListener("click", () => {
    if (!selectedEvidence) return;

    collectedEvidence.add(selectedEvidence);
    const room = currentCase === 1 ? officeRoom : warehouseRoom;

    room.querySelectorAll(".object").forEach(object => {
        if (object.dataset.evidence === selectedEvidence) {
            object.classList.add("collected");
        }
    });

    updateInventory();
    updateNotebook();
    evidenceModal.hidden = true;
    selectedEvidence = null;
});

$("close-button").addEventListener("click", () => {
    evidenceModal.hidden = true;
    selectedEvidence = null;
});

function updateInventory() {
    $("evidence-count").textContent = collectedEvidence.size;
    $("inventory-items").innerHTML = "";

    collectedEvidence.forEach(id => {
        const tag = document.createElement("div");
        tag.className = "evidence-tag";
        tag.textContent = cases[currentCase].evidence[id].label;
        $("inventory-items").appendChild(tag);
    });

    if (collectedEvidence.size === 3) {
        $("solve-button").disabled = false;
        $("solve-button").textContent = "SOLVE THE CASE 🔓";
    }
}

$("solve-button").addEventListener("click", () => {
    if (collectedEvidence.size !== 3) return;
    const data = cases[currentCase];

    $("puzzle-case-title").textContent =
        data.number + ": " + data.title;
    $("puzzle-topic").textContent = data.topic;
    $("puzzle-question").textContent = data.question;
    $("answer1-label").textContent = data.labels[0];
    $("answer2-label").textContent = data.labels[1];
    $("puzzle-evidence-grid").innerHTML = "";

    data.facts.forEach(([label, value]) => {
        const item = document.createElement("div");
        const small = document.createElement("small");
        const strong = document.createElement("strong");
        small.textContent = label;
        strong.textContent = value;
        item.append(small, strong);
        $("puzzle-evidence-grid").appendChild(item);
    });

    showScreen("puzzle");
});

$("submit-puzzle").addEventListener("click", () => {
    const first = $("answer1").value.trim();
    const second = $("answer2").value.trim();

    if (!first || !second) {
        $("puzzle-feedback").textContent =
            "Please complete both calculations.";
        $("puzzle-feedback").className = "puzzle-error";
        return;
    }

    const data = cases[currentCase];
    const correct1 = Number(first) === data.answers[0];
    const correct2 = Number(second) === data.answers[1];

    if (correct1 && correct2) {
        $("puzzle-feedback").textContent =
            "Correct! Investigation completed.";
        $("puzzle-feedback").className = "puzzle-success";
        $("answer1").disabled = true;
        $("answer2").disabled = true;
        $("submit-puzzle").disabled = true;

        const firstCompletion = !completedCases.has(currentCase);
        completedCases.add(currentCase);
        saveProgress();
        updateProgress();

        $("result-explanation").textContent = data.explanation;
        $("result-xp").textContent =
            "TOTAL XP: " + completedCases.size * 100;
        $("xp-reward").textContent =
            firstCompletion ? "+100 XP" : "CASE ALREADY COMPLETED";
        $("case-result").hidden = false;
        $("next-case-button").textContent =
            "CONTINUE TO CASE 00" + (currentCase + 1);
    } else {
        attempts++;
        let feedback = "Incorrect calculation. ";
        if (!correct1 && !correct2) {
            feedback += "Check both answers. ";
        } else if (!correct1) {
            feedback += "Check the first answer. ";
        } else {
            feedback += "Check the second answer. ";
        }

        feedback += attempts >= 2
            ? data.hint
            : "Review your Detective Notebook.";

        $("puzzle-feedback").textContent = feedback;
        $("puzzle-feedback").className = "puzzle-error";
    }
});

$("next-case-button").addEventListener("click", () => {
    beginCase(currentCase + 1);
});

// =====================================================
// CASE 003 — TRANSACTION MATCHING
// =====================================================

const cashTransactions = [
    {
        id: "cash-deposit", pair: "deposit3000",
        title: "Cash Deposit", reference: "DEP-001",
        amount: "RM3,000"
    },
    {
        id: "cash-cheque103", pair: "cheque800",
        title: "Cheque #103", reference: "CHQ-103",
        amount: "RM800"
    },
    {
        id: "cash-cheque102", pair: null,
        title: "Cheque #102", reference: "CHQ-102",
        amount: "RM1,200"
    },
    {
        id: "cash-deposit-pending", pair: null,
        title: "Deposit in Transit", reference: "DEP-002",
        amount: "RM2,000"
    }
];

const bankTransactions = [
    {
        id: "bank-cheque103", pair: "cheque800",
        title: "Cheque #103", reference: "CHQ-103",
        amount: "RM800"
    },
    {
        id: "bank-deposit", pair: "deposit3000",
        title: "Cash Deposit", reference: "DEP-001",
        amount: "RM3,000"
    },
    {
        id: "bank-charge", pair: null,
        title: "Bank Charges", reference: "FEE-001",
        amount: "RM100"
    }
];

let selectedCash = null;
let selectedBank = null;
let matchedPairs = new Set();
let reconciliationAttempts = 0;

function beginMatchingCase() {
    if (!completedCases.has(2)) return;

    currentCase = 3;
    selectedCash = null;
    selectedBank = null;
    matchedPairs.clear();
    reconciliationAttempts = 0;

    $("match-count").textContent = "0";
    $("match-button").disabled = true;
    $("match-feedback").textContent = "";
    $("match-feedback").className = "feedback";
    $("unmatched-panel").hidden = true;

    $("cash-adjusted").value = "";
    $("bank-adjusted").value = "";
    $("cash-adjusted").disabled = false;
    $("bank-adjusted").disabled = false;
    $("submit-reconciliation").disabled = false;
    $("reconciliation-feedback").textContent = "";
    $("reconciliation-feedback").className = "";
    $("case3-result").hidden = true;

    renderTransactions();
    showScreen("matching");
}

function renderTransactions() {
    renderTransactionSide(
        "cash-transactions", cashTransactions, "cash"
    );
    renderTransactionSide(
        "bank-transactions", bankTransactions, "bank"
    );
    $("match-button").disabled =
        selectedCash === null || selectedBank === null;
}

function renderTransactionSide(containerId, transactions, side) {
    const container = $(containerId);
    container.innerHTML = "";

    transactions.forEach(transaction => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "transaction-button";

        const matched = transaction.pair !== null &&
            matchedPairs.has(transaction.pair);

        const selected = side === "cash"
            ? selectedCash === transaction.id
            : selectedBank === transaction.id;

        if (matched) {
            button.classList.add("matched");
            button.disabled = true;
        } else if (selected) {
            button.classList.add("selected");
        }

        const details = document.createElement("span");
        const title = document.createElement("strong");
        const reference = document.createElement("small");
        const amount = document.createElement("span");

        title.textContent = transaction.title;
        reference.textContent = " · " + transaction.reference;
        amount.textContent =
            matched ? "✓ MATCHED" : transaction.amount;
        amount.className = "amount";

        details.append(title, reference);
        button.append(details, amount);

        button.addEventListener("click", () => {
            if (side === "cash") {
                selectedCash = selectedCash === transaction.id
                    ? null : transaction.id;
            } else {
                selectedBank = selectedBank === transaction.id
                    ? null : transaction.id;
            }
            renderTransactions();
        });

        container.appendChild(button);
    });
}

$("match-button").addEventListener("click", () => {
    if (!selectedCash || !selectedBank) return;

    const cash = cashTransactions.find(
        item => item.id === selectedCash
    );
    const bank = bankTransactions.find(
        item => item.id === selectedBank
    );

    const correct = cash.pair !== null &&
        cash.pair === bank.pair &&
        !matchedPairs.has(cash.pair);

    if (correct) {
        matchedPairs.add(cash.pair);
        $("match-feedback").textContent =
            "✓ Correct! " + cash.title +
            " appears in both documents.";
        $("match-feedback").className =
            "feedback puzzle-success";
    } else {
        $("match-feedback").textContent =
            "✕ Not a match. Compare references and amounts.";
        $("match-feedback").className =
            "feedback puzzle-error";
    }

    selectedCash = null;
    selectedBank = null;
    $("match-count").textContent = matchedPairs.size;
    renderTransactions();

    if (matchedPairs.size === 2) showUnmatchedTransactions();
});

function showUnmatchedTransactions() {
    const differences = [
        [
            "Outstanding Cheque — RM1,200",
            "Cheque #102 is in the Cash Book but not yet on the Bank Statement."
        ],
        [
            "Deposit in Transit — RM2,000",
            "Deposit DEP-002 is in the Cash Book but not yet credited by the bank."
        ],
        [
            "Bank Charges — RM100",
            "The bank charged RM100, not yet recorded in the Cash Book."
        ]
    ];

    $("unmatched-items").innerHTML = "";

    differences.forEach(([title, description]) => {
        const card = document.createElement("div");
        card.className = "unmatched-card";

        const heading = document.createElement("strong");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = description;

        card.append(heading, paragraph);
        $("unmatched-items").appendChild(card);
    });

    $("unmatched-panel").hidden = false;
    $("match-feedback").textContent =
        "Excellent! All common transactions matched.";
    $("match-feedback").className =
        "feedback puzzle-success";
}

$("go-to-reconciliation").addEventListener("click", () => {
    if (matchedPairs.size === 2) showScreen("reconciliation");
});

$("submit-reconciliation").addEventListener("click", () => {
    if (matchedPairs.size !== 2) return;

    const cashText = $("cash-adjusted").value.trim();
    const bankText = $("bank-adjusted").value.trim();

    if (!cashText || !bankText) {
        $("reconciliation-feedback").textContent =
            "Please complete both adjusted balances.";
        $("reconciliation-feedback").className = "puzzle-error";
        return;
    }

    const correctCash = Number(cashText) === 9900;
    const correctBank = Number(bankText) === 9900;

    if (correctCash && correctBank) {
        $("reconciliation-feedback").textContent =
            "Correct! Both balances reconcile at RM9,900.";
        $("reconciliation-feedback").className =
            "puzzle-success";

        $("cash-adjusted").disabled = true;
        $("bank-adjusted").disabled = true;
        $("submit-reconciliation").disabled = true;

        const first = !completedCases.has(3);
        completedCases.add(3);
        saveProgress();
        updateProgress();

        $("case3-reward").textContent =
            first ? "+100 XP" : "CASE ALREADY COMPLETED";
        $("case3-total-xp").textContent =
            "TOTAL XP: " + completedCases.size * 100;
        $("case3-result").hidden = false;
    } else {
        reconciliationAttempts++;
        let feedback = "Incorrect reconciliation. ";

        if (!correctCash && !correctBank) {
            feedback += "Check both balances. ";
        } else if (!correctCash) {
            feedback += "Check the Cash Book. ";
        } else {
            feedback += "Check the Bank Statement. ";
        }

        feedback += reconciliationAttempts >= 2
            ? "Deduct bank charges from Cash Book. Add deposits in transit and deduct outstanding cheques from Bank Statement."
            : "Review the unmatched transactions.";

        $("reconciliation-feedback").textContent = feedback;
        $("reconciliation-feedback").className = "puzzle-error";
    }
});

$("finish-case3").addEventListener("click", () => beginCase(4));

// =====================================================
// CASE 004 — DOCUMENT SORTING
// =====================================================

const accrualDocuments = [
    {
        id: "electricity", icon: "💡",
        title: "Electricity Bill",
        reference: "ELEC-DEC-026",
        period: "December 2026",
        payment: "Unpaid and not yet recorded",
        amount: 600,
        description: "Electricity was consumed in December. The invoice remains unpaid.",
        accrued: true,
        explanation: "Accrued Expense: RM600. Electricity was consumed in December but remains unpaid and unrecorded."
    },
    {
        id: "rent", icon: "🏢",
        title: "January Rent",
        reference: "RENT-JAN-027",
        period: "January 2027",
        payment: "Unpaid",
        amount: 900,
        description: "This invoice relates entirely to January 2027.",
        accrued: false,
        explanation: "Not Accrued: RM900 relates to January 2027, not December 2026."
    },
    {
        id: "cleaning", icon: "🧹",
        title: "Cleaning Services",
        reference: "CLN-DEC-026",
        period: "December 2026",
        payment: "Unpaid and not yet recorded",
        amount: 400,
        description: "Cleaning services were completed in December but not paid or recorded.",
        accrued: true,
        explanation: "Accrued Expense: RM400. Service received in December but unpaid and unrecorded."
    },
    {
        id: "supplies", icon: "📦",
        title: "Office Supplies Expense",
        reference: "SUP-DEC-026",
        period: "December 2026",
        payment: "Paid and recorded",
        amount: 300,
        description: "Office supplies were used, paid for, and recorded in December.",
        accrued: false,
        explanation: "Not Accrued: RM300 was already paid and recorded."
    }
];

let currentDocumentIndex = 0;
let classifiedDocuments = new Map();
let documentAnswered = false;
let accrualAttempts = 0;

function beginSortingCase() {
    if (!completedCases.has(3)) return;

    currentCase = 4;
    currentDocumentIndex = 0;
    classifiedDocuments.clear();
    documentAnswered = false;
    accrualAttempts = 0;

    $("sorting-complete").hidden = true;
    $("sort-feedback").textContent = "";
    $("next-document").hidden = true;

    $("accrual-answer").value = "";
    $("accrual-answer").disabled = false;
    $("submit-accrual").disabled = false;
    $("accrual-feedback").textContent = "";
    $("accrual-feedback").className = "";
    $("case4-result").hidden = true;

    updateSortingProgress();
    renderCurrentDocument();
    showScreen("sorting");
}

function updateSortingProgress() {
    const count = classifiedDocuments.size;
    $("sort-count").textContent = count;
    $("sort-progress-label").textContent = count + " / 4";
    $("sort-progress-fill").style.width =
        (count / accrualDocuments.length) * 100 + "%";
}

function renderCurrentDocument() {
    const doc = accrualDocuments[currentDocumentIndex];
    if (!doc) return;

    documentAnswered = classifiedDocuments.has(doc.id);

    $("document-number").textContent =
        String(currentDocumentIndex + 1).padStart(2, "0") +
        " / 04";

    $("document-icon").textContent = doc.icon;
    $("document-title").textContent = doc.title;
    $("document-reference").textContent = doc.reference;
    $("document-period").textContent = doc.period;
    $("document-payment").textContent = doc.payment;
    $("document-amount").textContent =
        "RM" + doc.amount.toLocaleString();
    $("document-description").textContent = doc.description;

    $("sort-feedback").textContent = "";
    $("sort-feedback").className = "feedback";
    $("choose-accrued").disabled = documentAnswered;
    $("choose-not-accrued").disabled = documentAnswered;
    $("next-document").hidden = !documentAnswered;
    $("next-document").textContent =
        currentDocumentIndex === accrualDocuments.length - 1
            ? "VIEW INVESTIGATION RESULTS →"
            : "NEXT DOCUMENT →";
}

function classifyDocument(choice) {
    if (documentAnswered) return;

    const doc = accrualDocuments[currentDocumentIndex];

    if (choice === doc.accrued) {
        documentAnswered = true;
        classifiedDocuments.set(doc.id, choice);

        $("sort-feedback").textContent =
            "✓ Correct! " + doc.explanation;
        $("sort-feedback").className =
            "feedback puzzle-success";

        $("choose-accrued").disabled = true;
        $("choose-not-accrued").disabled = true;
        $("next-document").hidden = false;
        $("next-document").textContent =
            currentDocumentIndex === accrualDocuments.length - 1
                ? "VIEW INVESTIGATION RESULTS →"
                : "NEXT DOCUMENT →";

        updateSortingProgress();
    } else {
        $("sort-feedback").textContent =
            "✕ Incorrect. Check the service period and whether the expense has already been recorded.";
        $("sort-feedback").className =
            "feedback puzzle-error";
    }
}

$("choose-accrued").addEventListener("click", () => {
    classifyDocument(true);
});

$("choose-not-accrued").addEventListener("click", () => {
    classifyDocument(false);
});

$("next-document").addEventListener("click", () => {
    if (!documentAnswered) return;

    if (currentDocumentIndex < accrualDocuments.length - 1) {
        currentDocumentIndex++;
        renderCurrentDocument();
    } else {
        showSortingSummary();
    }
});

function showSortingSummary() {
    if (classifiedDocuments.size !== accrualDocuments.length) {
        return;
    }

    $("sorting-summary").innerHTML = "";

    accrualDocuments.forEach(doc => {
        const card = document.createElement("div");
        card.className = "sort-summary-card";

        const heading = document.createElement("h4");
        heading.textContent =
            doc.icon + " " + doc.title +
            " — RM" + doc.amount.toLocaleString();

        const paragraph = document.createElement("p");
        paragraph.textContent =
            (doc.accrued ? "ACCRUED EXPENSE. " : "NOT ACCRUED. ") +
            doc.explanation;

        card.append(heading, paragraph);
        $("sorting-summary").appendChild(card);
    });

    $("sorting-complete").hidden = false;
    $("sorting-complete").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

$("go-to-accrual").addEventListener("click", () => {
    if (classifiedDocuments.size !== accrualDocuments.length) {
        return;
    }

    $("accrual-evidence-grid").innerHTML = "";

    accrualDocuments.forEach(doc => {
        const item = document.createElement("div");
        const label = document.createElement("small");
        const amount = document.createElement("strong");

        label.textContent =
            doc.title.toUpperCase() +
            (doc.accrued ? " — ACCRUED" : " — NOT ACCRUED");
        amount.textContent =
            "RM" + doc.amount.toLocaleString();

        item.append(label, amount);
        $("accrual-evidence-grid").appendChild(item);
    });

    showScreen("accrual");
});

$("submit-accrual").addEventListener("click", () => {
    if (classifiedDocuments.size !== accrualDocuments.length) {
        return;
    }

    const text = $("accrual-answer").value.trim();

    if (!text) {
        $("accrual-feedback").textContent =
            "Please enter the total accrued expenses.";
        $("accrual-feedback").className = "puzzle-error";
        return;
    }

    if (Number(text) === 1000) {
        $("accrual-feedback").textContent =
            "Correct! Total accrued expenses = RM1,000.";
        $("accrual-feedback").className = "puzzle-success";

        $("accrual-answer").disabled = true;
        $("submit-accrual").disabled = true;

        const first = !completedCases.has(4);
        completedCases.add(4);
        saveProgress();
        updateProgress();

        $("case4-reward").textContent =
            first ? "+100 XP" : "CASE ALREADY COMPLETED";
        $("case4-total-xp").textContent =
            "TOTAL XP: " + completedCases.size * 100;
        $("case4-result").hidden = false;
    } else {
        accrualAttempts++;
        $("accrual-feedback").textContent =
            accrualAttempts >= 2
                ? "Hint: Add only December expenses that remain unpaid and unrecorded."
                : "Incorrect. Review the classified documents.";
        $("accrual-feedback").className = "puzzle-error";
    }
});

// =====================================================
// CASE 005 — TIMELINE PUZZLE
// =====================================================

function addCaseCard(id, title, description) {
    const card = document.createElement("div");
    card.className = "case-card";
    card.innerHTML = `
        <span class="case-number">CASE ${String(id).padStart(3, "0")}</span>
        <h3>${title}</h3>
        <p>${description}</p>
        <span id="case${id}-status" class="dynamic-case-status">
            LOCKED 🔒
        </span>
        <button id="start-case${id}" disabled>LOCKED 🔒</button>
    `;
    document.querySelector(".case-grid").appendChild(card);
}

function addGameScreen(id, html) {
    const section = document.createElement("section");
    section.id = id;
    section.hidden = true;
    section.innerHTML = html;
    document.querySelector(".game-container").insertBefore(
        section, $("evidence-modal")
    );
    return section;
}

function addGameStyles(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
}

addCaseCard(5, "The Insurance Trap", "Prepayments · Timeline Puzzle");

screens.timeline = addGameScreen("timeline-screen", `
    <div class="mission-bar">
        <div><strong>CASE 005</strong><p>The Insurance Trap</p></div>
        <div>MONTHS: <span id="timeline-count">0</span>/12</div>
    </div>

    <div class="case-intro">
        <span class="case-number">INSURANCE INVESTIGATION</span>
        <h2>🛡️ The Insurance Trap</h2>
        <p>
            The accountant recorded the entire annual insurance premium
            as an expense for 2026. Rebuild the timeline and investigate.
        </p>
    </div>

    <div class="insurance-policy">
        <div class="policy-heading">
            <span>🛡️</span>
            <div>
                <small>CONFIDENTIAL · POLICY INS-2026-071</small>
                <h3>ANNUAL INSURANCE POLICY</h3>
            </div>
        </div>
        <div class="policy-facts">
            <div><small>PREMIUM PAID</small><strong>RM12,000</strong></div>
            <div><small>POLICY START</small><strong>1 JUL 2026</strong></div>
            <div><small>POLICY END</small><strong>30 JUN 2027</strong></div>
            <div><small>REPORTING DATE</small><strong>31 DEC 2026</strong></div>
        </div>
        <p>
            The premium was paid in full on 1 July 2026.
            The accountant charged RM12,000 to insurance expense.
        </p>
    </div>

    <div class="timeline-panel">
        <h3>🧩 STAGE 1 — REBUILD THE POLICY TIMELINE</h3>
        <p>Select the scattered month cards in chronological order,
        starting from JUL 2026.</p>
        <div id="timeline-slots" class="timeline-slots"></div>
        <h4>SCATTERED MONTH CARDS</h4>
        <div id="timeline-month-bank" class="month-bank"></div>
        <div id="timeline-feedback" class="feedback" aria-live="polite"></div>
        <button id="timeline-reset" class="secondary-button">
            RESET TIMELINE
        </button>
    </div>

    <div id="period-panel" class="timeline-panel" hidden>
        <h3>📅 STAGE 2 — IDENTIFY THE ACCOUNTING PERIOD</h3>
        <p>Select a month, then classify it as 2026 EXPENSE
        or 2027 PREPAYMENT.</p>
        <div id="period-months" class="period-months"></div>
        <div class="period-actions">
            <button id="mark-expense" class="period-expense">
                2026 EXPENSE
            </button>
            <button id="mark-prepaid" class="period-prepaid">
                2027 PREPAYMENT
            </button>
        </div>
        <div id="period-feedback" class="feedback" aria-live="polite"></div>
        <p id="period-progress">CLASSIFIED: 0/12</p>
        <button id="timeline-to-calculation" hidden>
            PREPARE ADJUSTING ENTRY →
        </button>
    </div>

    <button id="timeline-back" class="secondary-button">
        BACK TO CASE FILES
    </button>
`);

screens.insurance = addGameScreen("insurance-screen", `
    <div class="puzzle-header">
        <p>CASE 005 — FINAL INVESTIGATION</p>
        <h2>Insurance Prepayment Adjustment</h2>
        <span>YEAR ENDED 31 DECEMBER 2026</span>
    </div>

    <div class="puzzle-evidence">
        <h3>📂 VERIFIED POLICY FACTS</h3>
        <div class="puzzle-evidence-grid">
            <div><small>ANNUAL PREMIUM</small><strong>RM12,000</strong></div>
            <div><small>TOTAL COVERAGE</small><strong>12 MONTHS</strong></div>
            <div><small>2026 COVERAGE</small><strong>6 MONTHS</strong></div>
            <div><small>2027 COVERAGE</small><strong>6 MONTHS</strong></div>
        </div>
    </div>

    <div class="puzzle-card">
        <h3>🧮 STAGE 3 — SOLVE THE CASE</h3>
        <p>Calculate the correct 2026 insurance expense and
        prepaid insurance asset at 31 December 2026.</p>

        <label for="insurance-expense">
            Correct Insurance Expense for 2026 (RM)
        </label>
        <input id="insurance-expense" type="number"
            min="0" step="0.01" placeholder="2026 expense">

        <label for="insurance-prepaid">
            Prepaid Insurance at 31 December 2026 (RM)
        </label>
        <input id="insurance-prepaid" type="number"
            min="0" step="0.01" placeholder="Prepaid amount">

        <button id="open-case5-notebook" class="notebook-button">
            📓 REVIEW DETECTIVE NOTEBOOK
        </button>
        <button id="submit-insurance">SUBMIT INVESTIGATION</button>
        <div id="insurance-feedback" aria-live="polite"></div>
    </div>

    <div id="case5-result" class="result-card" hidden>
        <h2>🏆 CASE 005 SOLVED!</h2>
        <p>
            Monthly premium = RM12,000 ÷ 12 = RM1,000.
            Insurance expense for July–December 2026 = RM6,000.
            Prepaid insurance for January–June 2027 = RM6,000.
        </p>
        <p>
            Adjusting entry: Dr Prepaid Insurance RM6,000;
            Cr Insurance Expense RM6,000.
        </p>
        <h3 id="case5-reward">+100 XP</h3>
        <p id="case5-total-xp"></p>
        <button id="finish-case5">CONTINUE TO CASE 006 →</button>
    </div>
`);

addGameStyles(`
    .dynamic-case-status {
        color: #6ee7a0;
        font-size: 12px;
        font-weight: bold;
    }

    .insurance-policy {
        background: #fff9e9;
        color: #273246;
        border: 5px solid #c6b58b;
        border-radius: 12px;
        padding: 24px;
        margin: 24px 0;
    }

    .policy-heading {
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 2px solid #c6b58b;
        padding-bottom: 14px;
    }

    .policy-heading > span { font-size: 44px; }
    .policy-heading small { color: #657084; }
    .policy-heading h3 { margin: 8px 0; }

    .policy-facts {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin: 20px 0;
    }

    .policy-facts > div {
        background: #eae0c8;
        padding: 15px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .policy-facts small { color: #596477; }
    .policy-facts strong { font-size: 18px; }
    .insurance-policy > p { line-height: 1.7; }

    .timeline-panel {
        background: #17263d;
        border: 1px solid #53677e;
        border-radius: 12px;
        padding: 22px;
        margin: 22px 0;
    }

    .timeline-panel h3 { color: #d6b56d; }
    .timeline-panel p { color: #c5d1df; line-height: 1.7; }

    .timeline-slots,
    .month-bank,
    .period-months {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 10px;
        margin: 18px 0;
    }

    .timeline-slot {
        background: #0d182a;
        border: 1px dashed #72849a;
        border-radius: 9px;
        min-height: 72px;
        padding: 12px 5px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
    }

    .timeline-slot.filled {
        background: #245a49;
        border: 1px solid #6ee7a0;
    }

    .timeline-slot small { color: #c5d1df; font-size: 10px; }

    .month-card {
        background: #e8dfc8;
        color: #273246;
        border: 2px solid #c6b58b;
        border-radius: 9px;
        padding: 14px 4px;
        min-width: 0;
        font-size: 13px;
    }

    .month-card:disabled { opacity: .25; }
    .timeline-panel h4 { color: #f0d797; }

    .period-month {
        background: #273b55;
        color: white;
        border: 2px solid #53677e;
        padding: 13px 5px;
        min-height: 72px;
        font-size: 12px;
    }

    .period-month.active {
        outline: 3px solid #f0d797;
        outline-offset: 2px;
    }

    .period-month.expense {
        background: #245a49;
        border-color: #6ee7a0;
    }

    .period-month.prepaid {
        background: #315f91;
        border-color: #90c5ff;
    }

    .period-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    .period-expense { background: #36775e; color: white; }
    .period-prepaid { background: #356aa0; color: white; }

    #period-progress {
        font-weight: bold;
        color: #f0d797;
    }

    #timeline-to-calculation { width: 100%; }

    @media (max-width: 700px) {
        .timeline-slots,
        .month-bank,
        .period-months {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .timeline-panel { padding: 13px; }
    }

    @media (max-width: 430px) {
        .policy-facts { grid-template-columns: 1fr; }
        .period-actions { grid-template-columns: 1fr; }
        .insurance-policy { padding: 14px; }
    }
`);

const insuranceMonths = [
    { label: "JUL", year: 2026 },
    { label: "AUG", year: 2026 },
    { label: "SEP", year: 2026 },
    { label: "OCT", year: 2026 },
    { label: "NOV", year: 2026 },
    { label: "DEC", year: 2026 },
    { label: "JAN", year: 2027 },
    { label: "FEB", year: 2027 },
    { label: "MAR", year: 2027 },
    { label: "APR", year: 2027 },
    { label: "MAY", year: 2027 },
    { label: "JUN", year: 2027 }
];

let timelineOrder = [];
let monthCardOrder = [];
let periodAnswers = new Map();
let selectedMonth = null;
let insuranceAttempts = 0;

function shuffleMonths() {
    const order = insuranceMonths.map((_, index) => index);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

function beginTimelineCase() {
    if (!completedCases.has(4)) return;

    currentCase = 5;
    timelineOrder = [];
    monthCardOrder = shuffleMonths();
    periodAnswers.clear();
    selectedMonth = null;
    insuranceAttempts = 0;

    $("timeline-feedback").textContent = "";
    $("period-feedback").textContent = "";
    $("period-panel").hidden = true;
    $("timeline-to-calculation").hidden = true;

    $("insurance-expense").value = "";
    $("insurance-prepaid").value = "";
    $("insurance-expense").disabled = false;
    $("insurance-prepaid").disabled = false;
    $("submit-insurance").disabled = false;
    $("insurance-feedback").textContent = "";
    $("insurance-feedback").className = "";
    $("case5-result").hidden = true;

    renderTimeline();
    showScreen("timeline");
}

function renderTimeline() {
    const slots = $("timeline-slots");
    const bank = $("timeline-month-bank");
    slots.innerHTML = "";
    bank.innerHTML = "";

    for (let i = 0; i < 12; i++) {
        const slot = document.createElement("div");
        slot.className = "timeline-slot";

        const number = document.createElement("small");
        number.textContent = "MONTH " + (i + 1);

        const value = document.createElement("strong");

        if (i < timelineOrder.length) {
            const month = insuranceMonths[timelineOrder[i]];
            value.textContent = month.label + " " + month.year;
            slot.classList.add("filled");
        } else {
            value.textContent = "—";
        }

        slot.append(number, value);
        slots.appendChild(slot);
    }

    monthCardOrder.forEach(index => {
        const month = insuranceMonths[index];
        const button = document.createElement("button");
        button.className = "month-card";
        button.textContent = month.label + " " + month.year;
        button.disabled = timelineOrder.includes(index);
        button.addEventListener("click", () => {
            chooseTimelineMonth(index);
        });
        bank.appendChild(button);
    });

    $("timeline-count").textContent = timelineOrder.length;
}

function chooseTimelineMonth(index) {
    if (timelineOrder.includes(index) ||
        timelineOrder.length === 12) return;

    const expectedIndex = timelineOrder.length;

    if (index !== expectedIndex) {
        const expected = insuranceMonths[expectedIndex];
        $("timeline-feedback").textContent =
            "✕ Wrong order. Next month: " +
            expected.label + " " + expected.year + ".";
        $("timeline-feedback").className =
            "feedback puzzle-error";
        return;
    }

    timelineOrder.push(index);
    renderTimeline();

    if (timelineOrder.length === 12) {
        $("timeline-feedback").textContent =
            "✓ Timeline complete! Classify each month.";
        $("timeline-feedback").className =
            "feedback puzzle-success";
        $("period-panel").hidden = false;
        renderPeriodMonths();
        $("period-panel").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        $("timeline-feedback").textContent =
            "✓ Correct! " + timelineOrder.length +
            " of 12 months arranged.";
        $("timeline-feedback").className =
            "feedback puzzle-success";
    }
}

$("timeline-reset").addEventListener("click", () => {
    timelineOrder = [];
    periodAnswers.clear();
    selectedMonth = null;
    monthCardOrder = shuffleMonths();
    $("period-panel").hidden = true;
    $("timeline-feedback").textContent = "";
    renderTimeline();
});

function renderPeriodMonths() {
    const container = $("period-months");
    container.innerHTML = "";

    insuranceMonths.forEach((month, index) => {
        const button = document.createElement("button");
        button.className = "period-month";

        const answer = periodAnswers.get(index);
        button.textContent =
            month.label + " " + month.year +
            (answer === "expense" ? " ✓ EXPENSE" :
             answer === "prepaid" ? " ✓ PREPAID" : "");

        if (answer) button.classList.add(answer);
        if (selectedMonth === index) button.classList.add("active");

        button.disabled = answer !== undefined;
        button.addEventListener("click", () => {
            selectedMonth = index;
            renderPeriodMonths();
        });

        container.appendChild(button);
    });

    $("period-progress").textContent =
        "CLASSIFIED: " + periodAnswers.size + "/12";
    $("timeline-to-calculation").hidden =
        periodAnswers.size !== 12;
}

function classifyInsuranceMonth(type) {
    if (selectedMonth === null) {
        $("period-feedback").textContent =
            "Select a month first.";
        $("period-feedback").className =
            "feedback puzzle-error";
        return;
    }

    if (periodAnswers.has(selectedMonth)) return;

    const month = insuranceMonths[selectedMonth];
    const correctType =
        month.year === 2026 ? "expense" : "prepaid";

    if (type !== correctType) {
        $("period-feedback").textContent =
            "✕ Incorrect. Check whether " +
            month.label + " " + month.year +
            " is before or after 31 December 2026.";
        $("period-feedback").className =
            "feedback puzzle-error";
        return;
    }

    periodAnswers.set(selectedMonth, type);
    selectedMonth = null;

    $("period-feedback").textContent =
        "✓ Correct! " + month.label + " " + month.year +
        " belongs to " +
        (type === "expense" ? "2026 expense." : "2027 prepayment.");
    $("period-feedback").className =
        "feedback puzzle-success";

    renderPeriodMonths();

    if (periodAnswers.size === 12) {
        $("period-feedback").textContent =
            "✓ All 12 months classified! Calculate the adjustment.";
    }
}

$("mark-expense").addEventListener("click", () => {
    classifyInsuranceMonth("expense");
});

$("mark-prepaid").addEventListener("click", () => {
    classifyInsuranceMonth("prepaid");
});

$("timeline-to-calculation").addEventListener("click", () => {
    if (timelineOrder.length === 12 && periodAnswers.size === 12) {
        showScreen("insurance");
    }
});

$("submit-insurance").addEventListener("click", () => {
    if (timelineOrder.length !== 12 ||
        periodAnswers.size !== 12) return;

    const expenseText = $("insurance-expense").value.trim();
    const prepaidText = $("insurance-prepaid").value.trim();

    if (!expenseText || !prepaidText) {
        $("insurance-feedback").textContent =
            "Please complete both calculations.";
        $("insurance-feedback").className = "puzzle-error";
        return;
    }

    const expenseCorrect = Number(expenseText) === 6000;
    const prepaidCorrect = Number(prepaidText) === 6000;

    if (expenseCorrect && prepaidCorrect) {
        $("insurance-feedback").textContent =
            "✓ Correct! Expense and prepayment are RM6,000 each.";
        $("insurance-feedback").className = "puzzle-success";

        $("insurance-expense").disabled = true;
        $("insurance-prepaid").disabled = true;
        $("submit-insurance").disabled = true;

        const first = !completedCases.has(5);
        completedCases.add(5);
        saveProgress();
        updateProgress();

        $("case5-reward").textContent =
            first ? "+100 XP" : "CASE ALREADY COMPLETED";
        $("case5-total-xp").textContent =
            "TOTAL XP: " + completedCases.size * 100;
        $("case5-result").hidden = false;
    } else {
        insuranceAttempts++;
        let feedback = "Incorrect calculation. ";

        if (!expenseCorrect && !prepaidCorrect) {
            feedback += "Check both amounts. ";
        } else if (!expenseCorrect) {
            feedback += "Check 2026 expense. ";
        } else {
            feedback += "Check prepaid insurance. ";
        }

        feedback += insuranceAttempts >= 2
            ? "Hint: RM12,000 ÷ 12 months. Six months belong to 2026 and six to 2027."
            : "Review the timeline and Detective Notebook.";

        $("insurance-feedback").textContent = feedback;
        $("insurance-feedback").className = "puzzle-error";
    }
});

$("timeline-back").addEventListener("click", returnToMenu);
$("finish-case5").addEventListener("click", () => beginCase(6));

// =====================================================
// CASE 006 — SUSPECT INVESTIGATION
// =====================================================

addCaseCard(
    6,
    "The Vanishing Receivable",
    "Bad Debts · Suspect Investigation"
);

screens.suspects = addGameScreen("suspect-screen", `
    <div class="case6-hero">
        <div class="case6-hero-content">
            <div class="case6-kicker">
                <span class="case6-pulse"></span>
                FINANCIAL CRIME INVESTIGATION
            </div>
            <div class="case6-hero-icon">🕵️</div>
            <p class="case6-episode">EPISODE 006 / 010</p>
            <h2>THE VANISHING<br><em>RECEIVABLE</em></h2>
            <p class="case6-hero-description">
                Three customers. One irrecoverable debt.
                Investigate the evidence before the financial
                statements are finalised.
            </p>
            <div class="case6-hero-stats">
                <div>
                    <small>RECEIVABLES LEDGER</small>
                    <strong>RM20,000</strong>
                </div>
                <div>
                    <small>REPORTING DATE</small>
                    <strong>31 DEC 2026</strong>
                </div>
                <div>
                    <small>ALLOWANCE RATE</small>
                    <strong>5%</strong>
                </div>
            </div>
        </div>
    </div>

    <div class="case6-topbar">
        <div>
            <span class="case6-section-label">INVESTIGATION STATUS</span>
            <h3>Suspect Case Files</h3>
        </div>
        <button id="case6-notebook" class="notebook-button">
            📓 NOTEBOOK
        </button>
    </div>

    <div class="case6-progress-card">
        <div class="case6-progress-top">
            <span>INTERROGATIONS COMPLETED</span>
            <strong id="case6-progress-text">0 / 3</strong>
        </div>
        <div class="case6-track">
            <div id="case6-progress-fill"></div>
        </div>
    </div>

    <div class="case6-suspect-grid" id="case6-suspect-grid"></div>

    <div id="case6-interview" class="case6-interview" hidden>
        <div class="case6-interview-head">
            <div>
                <span class="case6-section-label">
                    CONFIDENTIAL INTERROGATION
                </span>
                <h3 id="case6-interview-title"></h3>
            </div>
            <button id="case6-close-interview" class="case6-close">
                ✕ CLOSE
            </button>
        </div>

        <div class="case6-interview-layout">
            <div class="case6-portrait-panel">
                <div id="case6-interview-avatar"></div>
                <span id="case6-interview-role"></span>
                <strong id="case6-interview-name"></strong>
            </div>
            <div class="case6-interview-details">
                <h4>📂 ACCOUNTING EVIDENCE</h4>
                <div id="case6-evidence-list"></div>

                <h4>🎙️ INTERROGATION TRANSCRIPT</h4>
                <div class="case6-dialogue">
                    <span>DETECTIVE</span>
                    <p id="case6-question"></p>
                </div>
                <div class="case6-dialogue case6-answer">
                    <span>CLIENT STATEMENT</span>
                    <p id="case6-statement"></p>
                </div>
            </div>
        </div>

        <div class="case6-decision">
            <h4>YOUR ASSESSMENT</h4>
            <p>Does the evidence confirm this debt is irrecoverable?</p>
            <div class="case6-decision-buttons">
                <button id="case6-mark-bad">
                    🚨 WRITE OFF AS BAD DEBT
                </button>
                <button id="case6-mark-keep">
                    ✓ KEEP AS RECEIVABLE
                </button>
            </div>
            <div id="case6-interview-feedback" aria-live="polite"></div>
        </div>
    </div>

    <div id="case6-verdict-panel" class="case6-verdict-panel" hidden>
        <div class="case6-verdict-icon">🔎</div>
        <span class="case6-section-label">ALL INTERROGATIONS COMPLETE</span>
        <h3>Make Your Final Accusation</h3>
        <p>
            Which customer's balance must be written off
            as an irrecoverable debt?
        </p>
        <div id="case6-verdict-options" class="case6-verdict-options"></div>
        <div id="case6-verdict-feedback" aria-live="polite"></div>
        <button id="case6-proceed" hidden>
            PROCEED TO FINANCIAL ANALYSIS →
        </button>
    </div>

    <button id="case6-back" class="secondary-button">
        ← BACK TO CASE FILES
    </button>
`);

screens.receivables = addGameScreen("receivables-screen", `
    <div class="case6-calc-header">
        <span class="case6-section-label">
            CASE 006 · FINAL AUDIT REPORT
        </span>
        <h2>📊 Receivables Investigation</h2>
        <p>
            You identified the irrecoverable debt.
            Now prepare the correct receivables valuation.
        </p>
    </div>

    <div class="case6-ledger">
        <div class="case6-ledger-title">
            <span>📄 TRADE RECEIVABLES WORKING PAPER</span>
            <span>FY 2026</span>
        </div>
        <div class="case6-ledger-row">
            <span>Gross Trade Receivables</span>
            <strong>RM20,000</strong>
        </div>
        <div class="case6-ledger-row">
            <span>Confirmed Irrecoverable Debt</span>
            <strong>(RM2,000)</strong>
        </div>
        <div class="case6-ledger-row">
            <span>Receivables After Write-off</span>
            <strong>RM18,000</strong>
        </div>
        <div class="case6-ledger-row">
            <span>Required Allowance Rate</span>
            <strong>5%</strong>
        </div>
        <div class="case6-ledger-note">
            Existing allowance balance: RM0.
            Apply the 5% allowance to receivables
            remaining after the confirmed write-off.
        </div>
    </div>

    <div class="case6-calculation">
        <div class="case6-calc-title">
            <span class="case6-section-label">FINAL CHALLENGE</span>
            <h3>Complete the Audit Working Paper</h3>
        </div>

        <label for="case6-allowance">
            01 — Required Allowance for Doubtful Debts (RM)
        </label>
        <input id="case6-allowance" type="number"
            min="0" step="0.01" placeholder="Enter allowance amount">

        <label for="case6-net">
            02 — Net Trade Receivables (RM)
        </label>
        <input id="case6-net" type="number"
            min="0" step="0.01" placeholder="Enter net receivables">

        <button id="case6-calc-notebook" class="notebook-button">
            📓 REVIEW INVESTIGATION NOTES
        </button>
        <button id="case6-submit" class="case6-main-button">
            SUBMIT FINAL AUDIT REPORT →
        </button>
        <div id="case6-calc-feedback" aria-live="polite"></div>
    </div>

    <div id="case6-result" class="case6-result" hidden>
        <div class="case6-trophy">🏆</div>
        <span class="case6-section-label">INVESTIGATION CLOSED</span>
        <h2>CASE 006 SOLVED!</h2>
        <p>
            RM20,000 − RM2,000 = RM18,000 receivables
            after write-off. Allowance = RM18,000 × 5%
            = RM900. Net trade receivables =
            RM18,000 − RM900 = RM17,100.
        </p>
        <p>
            Accounting entries: Dr Bad Debt Expense RM2,000,
            Cr Trade Receivables RM2,000.
            Dr Impairment Loss RM900,
            Cr Allowance for Doubtful Debts RM900.
        </p>
        <h3 id="case6-reward">+100 XP</h3>
        <p id="case6-total-xp"></p>
        <button id="case6-finish" class="case6-main-button">
            RETURN TO CASE FILES →
        </button>
    </div>
`);

addGameStyles(`
    /* CASE 006 — VISUAL DESIGN */

    #suspect-screen,
    #receivables-screen {
        background:
            radial-gradient(
                ellipse at 90% 0%,
                rgba(214,181,109,.08),
                transparent 48%
            ),
            #0d1626;
    }

    .case6-hero {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
        border: 1px solid #9a793e;
        background:
            radial-gradient(
                circle at 88% 26%,
                rgba(214,181,109,.18),
                transparent 38%
            ),
            linear-gradient(135deg, #14243c, #09111e);
        padding: 36px;
        box-shadow: 0 18px 45px rgba(0,0,0,.25);
    }

    .case6-hero::after {
        content: "";
        position: absolute;
        width: 250px;
        height: 250px;
        border: 1px solid rgba(214,181,109,.14);
        border-radius: 50%;
        top: -90px;
        right: -70px;
        pointer-events: none;
    }

    .case6-hero-content {
        position: relative;
        z-index: 1;
    }

    .case6-kicker {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 9px 13px;
        border: 1px solid #78643f;
        border-radius: 100px;
        color: #f0d797;
        font-size: 10px;
        letter-spacing: 2px;
        font-weight: bold;
    }

    .case6-pulse {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #6ee7a0;
        box-shadow: 0 0 12px #6ee7a0;
        animation: case6Pulse 2s infinite;
    }

    @keyframes case6Pulse {
        50% { opacity: .35; }
    }

    .case6-hero-icon {
        font-size: 64px;
        margin: 20px 0 4px;
        filter: drop-shadow(0 10px 18px rgba(0,0,0,.3));
    }

    .case6-episode {
        font-size: 11px;
        color: #d6b56d;
        letter-spacing: 3px;
        font-weight: bold;
    }

    .case6-hero h2 {
        margin: 10px 0;
        font-size: clamp(30px, 5.5vw, 58px);
        line-height: 1.06;
        letter-spacing: -1.5px;
        color: #fff;
    }

    .case6-hero h2 em {
        font-style: normal;
        color: #e5c77f;
    }

    .case6-hero-description {
        max-width: 560px;
        color: #c0cee0;
        line-height: 1.8;
        font-size: 15px;
    }

    .case6-hero-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-top: 26px;
    }

    .case6-hero-stats > div {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 17px;
        background: rgba(255,255,255,.045);
        border: 1px solid rgba(255,255,255,.13);
        border-radius: 12px;
    }

    .case6-hero-stats small {
        color: #a8b7cc;
        font-size: 10px;
        letter-spacing: 1px;
    }

    .case6-hero-stats strong {
        font-size: clamp(15px, 2.8vw, 22px);
        color: #f0d797;
    }

    .case6-topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin: 30px 0 15px;
    }

    .case6-topbar h3 {
        margin: 7px 0;
        font-size: 24px;
    }

    .case6-section-label {
        color: #d6b56d;
        font-size: 10px;
        font-weight: bold;
        letter-spacing: 2px;
    }

    .case6-progress-card {
        background: #17263d;
        border: 1px solid #344765;
        border-radius: 13px;
        padding: 17px;
        margin-bottom: 22px;
    }

    .case6-progress-top {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 12px;
        color: #c0cee0;
    }

    .case6-progress-top strong { color: #6ee7a0; }

    .case6-track {
        height: 9px;
        border-radius: 20px;
        background: #08111e;
        margin-top: 13px;
        overflow: hidden;
    }

    #case6-progress-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #bd9653, #f1d98e);
        transition: width .35s;
    }

    .case6-suspect-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
    }

    .case6-suspect-card {
        background: linear-gradient(180deg, #1b2d46, #142238);
        border: 1px solid #41536d;
        border-radius: 17px;
        padding: 20px;
        text-align: center;
        transition: transform .2s, border-color .2s;
        min-width: 0;
    }

    .case6-suspect-card:hover {
        transform: translateY(-4px);
        border-color: #d6b56d;
    }

    .case6-suspect-card.investigated {
        border-color: #438a72;
    }

    .case6-suspect-id {
        color: #a8b7cc;
        font-size: 10px;
        letter-spacing: 2px;
    }

    .case6-avatar {
        width: 95px;
        height: 95px;
        margin: 20px auto 15px;
        display: grid;
        place-items: center;
        font-size: 49px;
        border-radius: 50%;
        background: linear-gradient(135deg, #344e6d, #1d3049);
        border: 2px solid #b99c65;
        box-shadow: 0 10px 25px rgba(0,0,0,.22);
    }

    .case6-suspect-card h3 {
        margin: 8px 0;
        font-size: 19px;
    }

    .case6-suspect-role {
        color: #a8b7cc;
        font-size: 12px;
        min-height: 32px;
    }

    .case6-suspect-amount {
        margin: 18px 0;
        padding: 13px 8px;
        border-top: 1px solid #41536d;
        border-bottom: 1px solid #41536d;
    }

    .case6-suspect-amount small {
        display: block;
        color: #a8b7cc;
        font-size: 10px;
        margin-bottom: 6px;
    }

    .case6-suspect-amount strong {
        color: #f0d797;
        font-size: 23px;
    }

    .case6-suspect-card button {
        width: 100%;
        padding: 12px;
        font-size: 12px;
    }

    .case6-investigated-label {
        display: block;
        color: #6ee7a0;
        font-size: 11px;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .case6-interview,
    .case6-verdict-panel,
    .case6-calculation {
        margin: 25px 0;
        background: #17263d;
        border: 1px solid #9a793e;
        border-radius: 17px;
        padding: 24px;
        box-shadow: 0 15px 40px rgba(0,0,0,.2);
    }

    .case6-interview-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        border-bottom: 1px solid #41536d;
        padding-bottom: 16px;
        margin-bottom: 20px;
    }

    .case6-interview-head h3 {
        margin: 8px 0 0;
        font-size: 23px;
    }

    .case6-close {
        background: #334761;
        color: white;
        padding: 10px;
        font-size: 11px;
    }

    .case6-interview-layout {
        display: grid;
        grid-template-columns: 190px 1fr;
        gap: 22px;
    }

    .case6-portrait-panel {
        background: linear-gradient(180deg, #273e5a, #122036);
        border: 1px solid #53677e;
        border-radius: 13px;
        padding: 22px 12px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 13px;
    }

    #case6-interview-avatar {
        font-size: 80px;
    }

    #case6-interview-role {
        color: #a8b7cc;
        font-size: 11px;
    }

    #case6-interview-name {
        color: #f0d797;
    }

    .case6-interview-details h4 {
        color: #f0d797;
        font-size: 13px;
        letter-spacing: 1px;
        margin: 0 0 12px;
    }

    .case6-evidence-item {
        background: #0d1b2e;
        border-left: 3px solid #d6b56d;
        padding: 13px;
        margin-bottom: 9px;
        border-radius: 6px;
        line-height: 1.6;
        color: #d8e4f2;
        font-size: 13px;
    }

    .case6-dialogue {
        background: #263b56;
        padding: 14px;
        border-radius: 11px;
        margin-bottom: 11px;
    }

    .case6-dialogue span {
        color: #f0d797;
        font-size: 10px;
        letter-spacing: 1px;
        font-weight: bold;
    }

    .case6-dialogue p {
        margin-bottom: 0;
        line-height: 1.7;
        font-size: 14px;
    }

    .case6-answer {
        background: #173d38;
    }

    .case6-decision {
        margin-top: 20px;
        border-top: 1px solid #41536d;
        padding-top: 17px;
    }

    .case6-decision h4 { color: #f0d797; }
    .case6-decision p { color: #c0cee0; }

    .case6-decision-buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
    }

    #case6-mark-bad {
        background: #9a484b;
        color: white;
    }

    #case6-mark-keep {
        background: #28694f;
        color: white;
    }

    #case6-interview-feedback,
    #case6-verdict-feedback,
    #case6-calc-feedback {
        margin-top: 14px;
        line-height: 1.7;
        font-weight: bold;
        font-size: 13px;
    }

    .case6-verdict-panel {
        text-align: center;
    }

    .case6-verdict-icon {
        font-size: 50px;
        margin-bottom: 15px;
    }

    .case6-verdict-panel h3 {
        font-size: 25px;
        margin: 12px 0;
    }

    .case6-verdict-panel p {
        color: #c0cee0;
        line-height: 1.7;
    }

    .case6-verdict-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin: 20px 0;
    }

    .case6-verdict-options button {
        background: #293f5a;
        border: 1px solid #69809b;
        color: white;
        padding: 15px 10px;
        font-size: 12px;
    }

    .case6-verdict-options button.selected {
        background: #245a49;
        border-color: #6ee7a0;
    }

    #case6-proceed,
    .case6-main-button {
        background: linear-gradient(135deg, #f0d797, #c79d4d);
        color: #101827;
        font-weight: 900;
        letter-spacing: .5px;
    }

    .case6-calc-header {
        text-align: center;
        padding: 15px 0 22px;
    }

    .case6-calc-header h2 {
        font-size: clamp(25px, 4vw, 38px);
        margin: 12px 0;
    }

    .case6-calc-header p {
        color: #c0cee0;
        line-height: 1.7;
    }

    .case6-ledger {
        background: #fff9e9;
        color: #243044;
        border: 5px solid #c6b58b;
        border-radius: 14px;
        padding: 24px;
        box-shadow: 0 15px 35px rgba(0,0,0,.2);
    }

    .case6-ledger-title {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-weight: bold;
        font-size: 12px;
        letter-spacing: 1px;
        border-bottom: 2px solid #b8a982;
        padding-bottom: 17px;
        margin-bottom: 12px;
    }

    .case6-ledger-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid #d8ccb1;
        padding: 15px 0;
        font-size: 14px;
    }

    .case6-ledger-row strong {
        white-space: nowrap;
    }

    .case6-ledger-note {
        margin-top: 17px;
        padding: 13px;
        border-radius: 8px;
        background: #eae0c8;
        color: #4a5668;
        font-size: 13px;
        line-height: 1.7;
    }

    .case6-calc-title h3 {
        font-size: 24px;
        margin: 9px 0 24px;
    }

    .case6-calculation {
        display: flex;
        flex-direction: column;
        gap: 13px;
    }

    .case6-calculation label {
        font-weight: bold;
        line-height: 1.5;
    }

    .case6-calculation input {
        width: 100%;
        padding: 15px;
        border: 1px solid #647b99;
        border-radius: 9px;
        background: #0d1b2e;
        color: white;
        font-size: 17px;
    }

    .case6-calculation input:focus {
        outline: 2px solid #f0d797;
    }

    .case6-result {
        background: linear-gradient(135deg, #1b3c39, #14243c);
        border: 2px solid #d6b56d;
        border-radius: 18px;
        padding: 30px;
        text-align: center;
        margin: 25px 0;
    }

    .case6-trophy { font-size: 64px; }

    .case6-result h2 {
        color: #f0d797;
        font-size: 32px;
    }

    .case6-result p {
        line-height: 1.9;
        color: #e2edf6;
    }

    #case6-reward {
        color: #6ee7a0;
        font-size: 34px;
    }

    @media (max-width: 750px) {
        .case6-suspect-grid {
            grid-template-columns: 1fr;
        }

        .case6-interview-layout {
            grid-template-columns: 1fr;
        }

        .case6-portrait-panel {
            padding: 14px;
        }

        #case6-interview-avatar {
            font-size: 56px;
        }
    }

    @media (max-width: 540px) {
        .case6-hero {
            padding: 22px 17px;
        }

        .case6-hero-stats {
            grid-template-columns: 1fr;
        }

        .case6-topbar {
            flex-direction: column;
            align-items: stretch;
        }

        .case6-decision-buttons,
        .case6-verdict-options {
            grid-template-columns: 1fr;
        }

        .case6-interview,
        .case6-verdict-panel,
        .case6-calculation,
        .case6-ledger {
            padding: 15px;
        }

        .case6-interview-head {
            flex-direction: column;
        }

        .case6-ledger-row {
            font-size: 12px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .case6-pulse { animation: none; }
        .case6-suspect-card { transition: none; }
        #case6-progress-fill { transition: none; }
    }
`);

// Three customer accounts total RM20,000.
// RM2,000 confirmed irrecoverable; other balances remain
// subject to the overall 5% allowance assessment.

const suspects = [
    {
        id: "s1",
        name: "Daniel Lim",
        role: "Owner · Lim Trading",
        avatar: "👨🏻‍💼",
        balance: 8000,
        question: "Why is your RM8,000 invoice still outstanding?",
        statement: "We had a temporary cash flow delay. We have resumed payments and confirmed the remaining balance.",
        evidence: [
            "Invoice LT-108: RM8,000 outstanding.",
            "Recent bank remittance and payment arrangement verified.",
            "Business continues operating; no confirmed irrecoverability."
        ],
        badDebt: false,
        explanation: "No confirmed bad debt. The business remains active and has evidence of payment arrangements. Keep the balance as receivable, subject to allowance assessment."
    },
    {
        id: "s2",
        name: "Sarah Wong",
        role: "Director · SW Supplies",
        avatar: "👩🏻‍💼",
        balance: 2000,
        question: "Why has the RM2,000 invoice remained unpaid?",
        statement: "The company has ceased operations and entered liquidation. The liquidator confirmed there will be no distribution to unsecured creditors.",
        evidence: [
            "Invoice SW-204: RM2,000 outstanding.",
            "Official liquidation notice confirms business closure.",
            "Liquidator confirms zero expected recovery on this debt."
        ],
        badDebt: true,
        explanation: "Confirmed irrecoverable debt. The liquidator has confirmed no recovery is expected, so RM2,000 must be written off."
    },
    {
        id: "s3",
        name: "Amir Hakim",
        role: "Manager · AH Services",
        avatar: "👨🏽‍💼",
        balance: 10000,
        question: "Can your company settle the RM10,000 outstanding balance?",
        statement: "The invoice is being verified by our finance department. We remain operational and expect to settle it under the agreed terms.",
        evidence: [
            "Invoice AH-310: RM10,000 outstanding.",
            "Customer confirmed the invoice and repayment schedule.",
            "No liquidation notice or evidence confirming total loss."
        ],
        badDebt: false,
        explanation: "Not a confirmed write-off. Keep RM10,000 as receivable, subject to the overall allowance assessment."
    }
];

let interviewedSuspects = new Map();
let activeSuspectId = null;
let finalSuspectId = null;
let suspectAttempts = 0;
let receivableAttempts = 0;

function beginSuspectCase() {
    if (!completedCases.has(5)) return;

    currentCase = 6;
    interviewedSuspects.clear();
    activeSuspectId = null;
    finalSuspectId = null;
    suspectAttempts = 0;
    receivableAttempts = 0;

    $("case6-interview").hidden = true;
    $("case6-verdict-panel").hidden = true;
    $("case6-proceed").hidden = true;
    $("case6-verdict-feedback").textContent = "";
    $("case6-verdict-feedback").className = "";

    $("case6-allowance").value = "";
    $("case6-net").value = "";
    $("case6-allowance").disabled = false;
    $("case6-net").disabled = false;
    $("case6-submit").disabled = false;
    $("case6-calc-feedback").textContent = "";
    $("case6-calc-feedback").className = "";
    $("case6-result").hidden = true;

    renderSuspectCards();
    updateSuspectProgress();
    showScreen("suspects");
}

function renderSuspectCards() {
    const grid = $("case6-suspect-grid");
    grid.innerHTML = "";

    suspects.forEach((suspect, index) => {
        const investigated = interviewedSuspects.has(suspect.id);
        const card = document.createElement("div");
        card.className = "case6-suspect-card";

        if (investigated) card.classList.add("investigated");

        const id = document.createElement("span");
        id.className = "case6-suspect-id";
        id.textContent =
            "PERSON OF INTEREST 0" + (index + 1);

        const avatar = document.createElement("div");
        avatar.className = "case6-avatar";
        avatar.textContent = suspect.avatar;

        const name = document.createElement("h3");
        name.textContent = suspect.name;

        const role = document.createElement("div");
        role.className = "case6-suspect-role";
        role.textContent = suspect.role;

        const amount = document.createElement("div");
        amount.className = "case6-suspect-amount";

        const amountLabel = document.createElement("small");
        amountLabel.textContent = "OUTSTANDING BALANCE";

        const amountValue = document.createElement("strong");
        amountValue.textContent =
            "RM" + suspect.balance.toLocaleString();

        amount.append(amountLabel, amountValue);

        const button = document.createElement("button");
        button.textContent = investigated
            ? "REVIEW EVIDENCE →"
            : "INVESTIGATE SUSPECT →";

        button.addEventListener("click", () => {
            openSuspectInterview(suspect.id);
        });

        card.append(id, avatar, name, role, amount);

        if (investigated) {
            const status = document.createElement("span");
            status.className = "case6-investigated-label";
            status.textContent = "✓ INTERROGATION COMPLETE";
            card.appendChild(status);
        }

        card.appendChild(button);
        grid.appendChild(card);
    });
}

function updateSuspectProgress() {
    const count = interviewedSuspects.size;

    $("case6-progress-text").textContent = count + " / 3";
    $("case6-progress-fill").style.width =
        (count / suspects.length) * 100 + "%";

    if (count === suspects.length) {
        $("case6-verdict-panel").hidden = false;
        renderVerdictOptions();
    }
}

function openSuspectInterview(id) {
    const suspect = suspects.find(item => item.id === id);
    if (!suspect) return;

    activeSuspectId = id;

    $("case6-interview-title").textContent =
        "Interview: " + suspect.name;
    $("case6-interview-avatar").textContent = suspect.avatar;
    $("case6-interview-role").textContent = suspect.role;
    $("case6-interview-name").textContent = suspect.name;
    $("case6-question").textContent = suspect.question;
    $("case6-statement").textContent = suspect.statement;

    const evidenceList = $("case6-evidence-list");
    evidenceList.innerHTML = "";

    suspect.evidence.forEach(record => {
        const item = document.createElement("div");
        item.className = "case6-evidence-item";
        item.textContent = "📎 " + record;
        evidenceList.appendChild(item);
    });

    const completed = interviewedSuspects.has(id);

    $("case6-mark-bad").disabled = completed;
    $("case6-mark-keep").disabled = completed;
    $("case6-interview-feedback").textContent = completed
        ? "✓ Investigation completed. " + suspect.explanation
        : "";
    $("case6-interview-feedback").className =
        completed ? "puzzle-success" : "";

    $("case6-interview").hidden = false;
    $("case6-interview").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function assessSuspect(writeOff) {
    if (!activeSuspectId ||
        interviewedSuspects.has(activeSuspectId)) return;

    const suspect = suspects.find(
        item => item.id === activeSuspectId
    );

    if (writeOff !== suspect.badDebt) {
        suspectAttempts++;

        $("case6-interview-feedback").textContent =
            "✕ Assessment incorrect. Review the documents. " +
            "A late payment alone does not automatically " +
            "make a debt irrecoverable.";
        $("case6-interview-feedback").className =
            "puzzle-error";
        return;
    }

    interviewedSuspects.set(suspect.id, writeOff);

    $("case6-interview-feedback").textContent =
        "✓ Correct assessment! " + suspect.explanation;
    $("case6-interview-feedback").className =
        "puzzle-success";

    $("case6-mark-bad").disabled = true;
    $("case6-mark-keep").disabled = true;

    renderSuspectCards();
    updateSuspectProgress();
}

$("case6-mark-bad").addEventListener("click", () => {
    assessSuspect(true);
});

$("case6-mark-keep").addEventListener("click", () => {
    assessSuspect(false);
});

$("case6-close-interview").addEventListener("click", () => {
    $("case6-interview").hidden = true;

    if (interviewedSuspects.size === suspects.length) {
        $("case6-verdict-panel").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});

function renderVerdictOptions() {
    const container = $("case6-verdict-options");
    container.innerHTML = "";

    suspects.forEach(suspect => {
        const button = document.createElement("button");
        button.textContent = suspect.avatar + " " + suspect.name;

        if (finalSuspectId === suspect.id) {
            button.classList.add("selected");
        }

        button.addEventListener("click", () => {
            chooseFinalSuspect(suspect.id);
        });

        container.appendChild(button);
    });
}

function chooseFinalSuspect(id) {
    if (interviewedSuspects.size !== suspects.length) return;

    const suspect = suspects.find(item => item.id === id);
    finalSuspectId = id;
    renderVerdictOptions();

    if (suspect.badDebt) {
        $("case6-verdict-feedback").textContent =
            "✓ CORRECT! " + suspect.name +
            " has a confirmed irrecoverable balance of RM2,000.";
        $("case6-verdict-feedback").className =
            "puzzle-success";
        $("case6-proceed").hidden = false;
    } else {
        $("case6-verdict-feedback").textContent =
            "✕ Incorrect suspect. Find the customer with " +
            "official evidence of zero expected recovery.";
        $("case6-verdict-feedback").className =
            "puzzle-error";
        $("case6-proceed").hidden = true;
    }
}

$("case6-proceed").addEventListener("click", () => {
    const chosen = suspects.find(
        suspect => suspect.id === finalSuspectId
    );

    if (interviewedSuspects.size !== 3 ||
        !chosen || !chosen.badDebt) return;

    showScreen("receivables");
});

$("case6-submit").addEventListener("click", () => {
    const chosen = suspects.find(
        suspect => suspect.id === finalSuspectId
    );

    if (interviewedSuspects.size !== 3 ||
        !chosen || !chosen.badDebt) return;

    const allowanceText = $("case6-allowance").value.trim();
    const netText = $("case6-net").value.trim();

    if (!allowanceText || !netText) {
        $("case6-calc-feedback").textContent =
            "Please complete both calculations.";
        $("case6-calc-feedback").className =
            "puzzle-error";
        return;
    }

    const correctAllowance = Number(allowanceText) === 900;
    const correctNet = Number(netText) === 17100;

    if (correctAllowance && correctNet) {
        $("case6-calc-feedback").textContent =
            "✓ Correct! The audit working paper is complete.";
        $("case6-calc-feedback").className =
            "puzzle-success";

        $("case6-allowance").disabled = true;
        $("case6-net").disabled = true;
        $("case6-submit").disabled = true;

        const first = !completedCases.has(6);
        completedCases.add(6);
        saveProgress();
        updateProgress();

        $("case6-reward").textContent =
            first ? "+100 XP" : "CASE ALREADY COMPLETED";
        $("case6-total-xp").textContent =
            "TOTAL XP: " + completedCases.size * 100;
        $("case6-result").hidden = false;

        $("case6-result").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        receivableAttempts++;

        let feedback = "✕ Incorrect calculation. ";

        if (!correctAllowance && !correctNet) {
            feedback += "Check both amounts. ";
        } else if (!correctAllowance) {
            feedback += "Check the allowance. ";
        } else {
            feedback += "Check net receivables. ";
        }

        feedback += receivableAttempts >= 2
            ? "Hint: Deduct RM2,000 from RM20,000 first. Apply 5% to the remaining RM18,000, then deduct the allowance."
            : "Review the working paper and Detective Notebook.";

        $("case6-calc-feedback").textContent = feedback;
        $("case6-calc-feedback").className =
            "puzzle-error";
    }
});

$("case6-back").addEventListener("click", returnToMenu);
$("case6-finish").addEventListener("click", returnToMenu);

// =====================================================
// SHARED NOTEBOOK — ALL SIX CASES
// =====================================================

function addNotebookNote(title, description) {
    const card = document.createElement("div");
    card.className = "notebook-evidence-card";

    const heading = document.createElement("h4");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    card.append(heading, paragraph);
    $("notebook-evidence-list").appendChild(card);
}

function updateNotebook() {
    const data = cases[currentCase];

    $("notebook-case-name").textContent =
        data.number + " — " + data.title;
    $("notebook-objective").textContent = data.objective;
    $("notebook-formula").textContent = data.formula;
    $("notebook-evidence-list").innerHTML = "";

    let count = 0;
    let total = 3;

    if (currentCase === 3) {
        count = matchedPairs.size;
        total = 2;

        if (count === 0) {
            addNotebookNote(
                "No transactions matched",
                "Compare transaction references and amounts."
            );
        }

        if (matchedPairs.has("deposit3000")) {
            addNotebookNote(
                "Matched Deposit",
                "Deposit RM3,000 appears in both records."
            );
        }

        if (matchedPairs.has("cheque800")) {
            addNotebookNote(
                "Matched Cheque",
                "Cheque #103 RM800 appears in both records."
            );
        }

        if (count === 2) {
            addNotebookNote(
                "Unmatched Transactions",
                "Outstanding cheque RM1,200; deposit in transit RM2,000; bank charges RM100."
            );
        }
    } else if (currentCase === 4) {
        count = classifiedDocuments.size;
        total = 4;

        if (count === 0) {
            addNotebookNote(
                "No documents classified",
                "Review service periods and payment status."
            );
        }

        accrualDocuments.forEach(doc => {
            if (classifiedDocuments.has(doc.id)) {
                addNotebookNote(
                    doc.title + " — RM" +
                    doc.amount.toLocaleString(),
                    doc.explanation
                );
            }
        });
    } else if (currentCase === 5) {
        count = timelineOrder.length + periodAnswers.size;
        total = 24;

        addNotebookNote(
            "Insurance Policy",
            "Premium RM12,000 paid on 1 July 2026. Coverage: 1 July 2026 to 30 June 2027."
        );

        addNotebookNote(
            "Reporting Date",
            "The financial year ends on 31 December 2026."
        );

        addNotebookNote(
            "Timeline Progress",
            timelineOrder.length + "/12 months arranged; " +
            periodAnswers.size + "/12 months classified."
        );

        if (periodAnswers.size === 12) {
            addNotebookNote(
                "Verified Coverage",
                "Six months belong to 2026; six months to 2027."
            );
        }
    } else if (currentCase === 6) {
        count = interviewedSuspects.size;
        total = 3;

        addNotebookNote(
            "Trade Receivables Ledger",
            "Gross receivables RM20,000. Reporting date 31 December 2026. Required allowance rate 5%. Existing allowance RM0."
        );

        suspects.forEach(suspect => {
            if (interviewedSuspects.has(suspect.id)) {
                addNotebookNote(
                    suspect.name + " — RM" +
                    suspect.balance.toLocaleString(),
                    suspect.explanation
                );
            }
        });

        if (finalSuspectId === "s2") {
            addNotebookNote(
                "Confirmed Write-off",
                "Sarah Wong / SW Supplies: RM2,000 irrecoverable. Remaining gross receivables RM18,000."
            );
        }
    } else {
        count = collectedEvidence.size;
        total = 3;
        $("notebook-count").textContent = count + "/3";

        if (count === 0) {
            addNotebookNote(
                "No evidence collected",
                "Examine objects to collect accounting documents."
            );
        }

        collectedEvidence.forEach(id => {
            const evidence = data.evidence[id];
            addNotebookNote(
                evidence.label,
                evidence.evidenceDescription
            );
        });
    }

    $("notebook-progress-text").textContent =
        count + " / " + total;
    $("notebook-progress-fill").style.width =
        (count / total) * 100 + "%";
}

function openNotebook(button) {
    notebookReturnFocus = button;
    updateNotebook();

    const calculationScreen =
        !screens.puzzle.hidden ||
        !screens.reconciliation.hidden ||
        !screens.accrual.hidden ||
        !screens.insurance.hidden ||
        !screens.receivables.hidden;

    $("notebook-return").textContent =
        calculationScreen
            ? "RETURN TO CALCULATION"
            : "RETURN TO INVESTIGATION";

    notebookModal.hidden = false;
    $("close-notebook").focus();
}

function closeNotebook() {
    notebookModal.hidden = true;

    if (notebookReturnFocus) {
        notebookReturnFocus.focus();
    }
}

[
    "open-notebook",
    "open-puzzle-notebook",
    "open-case3-notebook",
    "open-case4-notebook",
    "open-accrual-notebook",
    "open-case5-notebook",
    "case6-notebook",
    "case6-calc-notebook"
].forEach(id => {
    $(id).addEventListener("click", () => {
        openNotebook($(id));
    });
});

$("close-notebook").addEventListener("click", closeNotebook);
$("notebook-return").addEventListener("click", closeNotebook);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !notebookModal.hidden) {
        closeNotebook();
    }
});

// =====================================================
// CASE BUTTONS AND INITIALISATION
// =====================================================

for (let id = 1; id <= 6; id++) {
    $("start-case" + id).addEventListener("click", () => {
        beginCase(id);
    });
}

updateProgress();
showScreen("menu");
