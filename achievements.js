
"use strict";

/*
 AUDIT DETECTIVE — ACHIEVEMENTS REDESIGN
 A separate career profile without modifying
 the original XP, badges, sound or case logic.
*/

(() => {
    const $ = id => document.getElementById(id);

    const view = $("lobby-view");
    const content = $("lobby-view-content");

    if (!view || !content) {
        console.warn("Achievements: Lobby view not found.");
        return;
    }

    const badges = [
        {
            icon: "🔎",
            name: "FIRST CLUE",
            detail: "Complete your first case",
            required: 1
        },
        {
            icon: "📂",
            name: "CASE SPECIALIST",
            detail: "Complete 3 cases",
            required: 3
        },
        {
            icon: "🛡️",
            name: "SENIOR DETECTIVE",
            detail: "Complete 6 cases",
            required: 6
        },
        {
            icon: "🏆",
            name: "FAR LEGEND",
            detail: "Complete all 10 cases",
            required: 10
        }
    ];

    const panel = document.createElement("section");
    panel.id = "career-achievements";

    panel.innerHTML = `
        <div class="career-heading">
            <div>
                <span class="career-eyebrow">
                    ◈ DETECTIVE PERSONNEL FILE
                </span>
                <h2>HALL OF FAME</h2>
                <p>
                    Your investigation career,
                    achievements and milestones.
                </p>
            </div>
            <div class="career-emblem">🏆</div>
        </div>

        <div class="career-profile">
            <div class="career-profile-top">
                <div class="career-avatar">🕵️</div>
                <div>
                    <span class="career-small">
                        REGISTERED DETECTIVE
                    </span>
                    <h3 id="career-name">Detective</h3>
                    <span id="career-rank">
                        JUNIOR DETECTIVE
                    </span>
                </div>
            </div>

            <div class="career-stats">
                <div>
                    <strong id="career-xp">0</strong>
                    <span>TOTAL XP</span>
                </div>
                <div>
                    <strong id="career-cases">0/10</strong>
                    <span>CASES SOLVED</span>
                </div>
                <div>
                    <strong id="career-badges">0/4</strong>
                    <span>BADGES EARNED</span>
                </div>
            </div>

            <div class="career-progress-label">
                <span>INVESTIGATION PROGRESS</span>
                <strong id="career-percent">0%</strong>
            </div>

            <div class="career-track"
                 role="progressbar"
                 aria-label="Investigation progress"
                 aria-valuemin="0"
                 aria-valuemax="100"
                 aria-valuenow="0">
                <div id="career-fill"></div>
            </div>
        </div>

        <div class="career-badge-heading">
            <h3>INVESTIGATION BADGES</h3>
            <p>Unlock rewards as you solve cases.</p>
        </div>

        <div class="career-badge-grid"
             id="career-badge-grid"></div>

        <p class="career-footer">
            FINANCIAL ACCOUNTING & REPORTING
            · AUDIT DETECTIVE
        </p>
    `;

    function getCompleted() {
        try {
            const data = JSON.parse(
                localStorage.getItem(
                    "auditDetectiveProgress"
                )
            );

            return new Set(
                Array.isArray(data?.completed)
                    ? data.completed.filter(
                        n => Number.isInteger(n) &&
                             n >= 1 && n <= 10
                    )
                    : []
            );
        } catch {
            return new Set();
        }
    }

    function getName() {
        try {
            const activeId = sessionStorage.getItem(
                "adActiveAccountV1"
            );

            const accounts = JSON.parse(
                localStorage.getItem(
                    "adLocalAccountsV1"
                ) || "[]"
            );

            const account = Array.isArray(accounts)
                ? accounts.find(a => a.id === activeId)
                : null;

            if (account?.name) return account.name;

            const profile = JSON.parse(
                localStorage.getItem(
                    "auditDetectivePlayerProfile"
                ) || "{}"
            );

            return profile.name || "Detective";
        } catch {
            return "Detective";
        }
    }

    function getRank(count) {
        const ranks = [
            "Junior Detective",
            "Junior Detective",
            "Financial Investigator",
            "Senior Financial Detective",
            "Elite Financial Detective",
            "Master Financial Detective",
            "Chief Audit Detective",
            "Expert Audit Detective",
            "Elite Audit Detective",
            "Supreme Financial Detective",
            "Legendary Audit Detective"
        ];

        return ranks[Math.min(count, 10)];
    }

    function refresh() {
        const count = getCompleted().size;
        const earned = badges.filter(
            badge => count >= badge.required
        ).length;

        $("career-name").textContent = getName();
        $("career-rank").textContent =
            "★ " + getRank(count).toUpperCase();

        $("career-xp").textContent =
            (count * 100).toLocaleString("en-MY");

        $("career-cases").textContent =
            count + "/10";

        $("career-badges").textContent =
            earned + "/4";

        $("career-percent").textContent =
            (count * 10) + "%";

        $("career-fill").style.width =
            (count * 10) + "%";

        panel.querySelector(".career-track")
            .setAttribute(
                "aria-valuenow",
                String(count * 10)
            );

        const grid = $("career-badge-grid");
        grid.replaceChildren();

        badges.forEach(badge => {
            const unlocked =
                count >= badge.required;

            const card = document.createElement("div");
            card.className =
                "career-badge" +
                (unlocked ? " unlocked" : " locked");

            const icon = document.createElement("div");
            icon.className = "career-badge-icon";
            icon.textContent =
                unlocked ? badge.icon : "🔒";

            const name = document.createElement("strong");
            name.textContent = badge.name;

            const detail = document.createElement("small");
            detail.textContent = badge.detail;

            const status = document.createElement("span");
            status.className = "career-badge-status";
            status.textContent =
                unlocked ? "✓ UNLOCKED" : "LOCKED";

            card.append(icon, name, detail, status);
            grid.appendChild(card);
        });
    }

    function openAchievements() {
        if (!view.hidden) {
            content.appendChild(panel);

            document.body.classList.add(
                "career-achievements-open"
            );

            refresh();
            window.scrollTo(0, 0);
        }
    }

    function closeAchievements() {
        document.body.classList.remove(
            "career-achievements-open"
        );

        panel.remove();
    }

    document.addEventListener("click", event => {
        const button = event.target.closest(
            '[data-lobby-page="achievements"]'
        );

        if (button) {
            // Wait for lobby.js to finish moving
            // its original dashboard elements.
            requestAnimationFrame(openAchievements);
        }
    });

    $("lobby-back")?.addEventListener(
        "click",
        closeAchievements,
        true
    );

    document.addEventListener("click", event => {
        const button = event.target.closest(
            "[data-lobby-page], #lobby-settings"
        );

        if (button &&
            button.dataset.lobbyPage !== "achievements") {
            closeAchievements();
        }
    }, true);

    window.addEventListener("pageshow", () => {
        if (panel.isConnected) refresh();
    });

    window.addEventListener("storage", event => {
        if (
            event.key === "auditDetectiveProgress" &&
            panel.isConnected
        ) {
            refresh();
        }
    });

    console.log("Achievements Redesign ready.");
})();
