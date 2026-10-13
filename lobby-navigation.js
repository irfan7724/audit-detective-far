
"use strict";

/*
 AUDIT DETECTIVE — SMART BACK NAVIGATION

 Case Files -> Case -> Back -> Case Files
 Story Mode -> Case -> Back -> Story Mode

 Preserves existing login, XP, cases and Story Mode.
*/

(() => {
    const $ = id => document.getElementById(id);

    const lobby = $("game-lobby");
    const view = $("lobby-view");
    const welcome = $("welcome-screen");
    const content = $("lobby-view-content");

    if (!lobby || !view || !welcome || !content) {
        console.warn("Smart Navigation: Lobby not found.");
        return;
    }

    const PROGRESS_KEY = "auditDetectiveProgress";
    const SESSION_KEY = "adActiveAccountV1";

    const screenIds = [
        "investigation-screen",
        "puzzle-screen",
        "matching-screen",
        "reconciliation-screen",
        "sorting-screen",
        "accrual-screen",
        "timeline-screen",
        "insurance-screen",
        "suspect-screen",
        "receivables-screen",
        "case7-screen",
        "case8-screen",
        "case9-screen",
        "case10-screen"
    ];

    let caseOrigin = "cases";
    let wasPlaying = false;
    let returning = false;

    function readCompleted() {
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

    function refreshStats() {
        const count = readCompleted().size;

        if ($("lobby-count")) {
            $("lobby-count").textContent = count + " / 10";
        }

        if ($("lobby-xp")) {
            $("lobby-xp").textContent = count * 100 + " XP";
        }

        if ($("lobby-fill")) {
            $("lobby-fill").style.width = count * 10 + "%";
        }

        if ($("lobby-rank")) {
            $("lobby-rank").textContent =
                count === 10 ? "LEGENDARY DETECTIVE" :
                count >= 7 ? "SENIOR INVESTIGATOR" :
                count >= 4 ? "INVESTIGATOR" :
                "ROOKIE DETECTIVE";
        }
    }

    function isPlaying() {
        return screenIds.some(id => {
            const screen = $(id);

            return screen &&
                !screen.hidden &&
                getComputedStyle(screen).display !== "none";
        });
    }

    function restoreMenuSections() {
        /*
         The original lobby.js moves existing elements
         and leaves comment markers at their old locations.

         Restore them before rebuilding the destination.
        */
        const moved = [
            welcome.querySelector(".case-grid"),
            $("story-hub")
        ];

        // Case grid might currently be inside lobby-view.
        const grid = document.querySelector(
            "#lobby-view-content .case-grid"
        );

        if (grid && !welcome.contains(grid)) {
            welcome.appendChild(grid);
        }

        // Story hub can remain in its current parent.
        // We move it to the view when needed.
    }

    function prepareView(title) {
        lobby.hidden = true;
        view.hidden = false;

        document.body.classList.remove("lobby-home");
        document.body.classList.add("lobby-section");

        if ($("lobby-view-title")) {
            $("lobby-view-title").textContent = title;
        }
    }

    function returnToCaseFiles() {
        prepareView("🔎 CASE FILES");

        const grid = document.querySelector(".case-grid");

        if (!grid) {
            content.textContent = "Case Files unavailable.";
            return;
        }

        content.replaceChildren();
        content.appendChild(grid);

        grid.hidden = false;
        grid.style.display = "";

        window.scrollTo(0, 0);
    }

    function returnToStory() {
        prepareView("📖 STORY MODE");

        const hub = $("story-hub");

        if (!hub) {
            returnToCaseFiles();
            return;
        }

        content.replaceChildren();
        content.appendChild(hub);

        hub.hidden = false;
        hub.style.display = "";

        /*
         Refresh chapters by using the existing
         Story Mode open button only if required.
         Avoid toggling it closed.
        */
        const openButton = $("story-open");

        if (openButton) {
            hub.hidden = true;
            openButton.click();
            hub.hidden = false;
        }

        window.scrollTo(0, 0);
    }

    function returnToOrigin() {
        if (returning) return;

        returning = true;
        wasPlaying = false;

        refreshStats();

        if (caseOrigin === "story") {
            returnToStory();
        } else {
            returnToCaseFiles();
        }

        requestAnimationFrame(() => {
            returning = false;
        });
    }

    function detectCaseStart(button) {
        if (!button || button.disabled) return;

        /*
         A Story Mode case is launched after
         the briefing closes. At that moment,
         Story Mode hub is still available.
        */
        const storyHub = $("story-hub");

        const storyActive =
            document.body.classList.contains(
                "lobby-section"
            ) &&
            $("lobby-view-title")?.textContent
                .includes("STORY MODE");

        if (storyActive) {
            caseOrigin = "story";
        } else if (
            document.body.classList.contains(
                "lobby-section"
            ) &&
            $("lobby-view-title")?.textContent
                .includes("CASE FILES")
        ) {
            caseOrigin = "cases";
        }

        requestAnimationFrame(() => {
            if (isPlaying()) {
                wasPlaying = true;

                lobby.hidden = true;
                view.hidden = true;

                document.body.classList.remove(
                    "lobby-home",
                    "lobby-section"
                );
            }
        });
    }

    document.addEventListener("click", event => {
        const button = event.target.closest(
            'button[id^="start-case"]'
        );

        if (button) {
            detectCaseStart(button);
        }
    }, true);

    /*
     Story Mode launches cases programmatically.
     Capture the origin before the original
     button handler opens the game screen.
    */
    document.addEventListener("click", event => {
        const button = event.target.closest("button");

        if (!button) return;

        if (button.id === "story-next" &&
            button.textContent.includes("OPEN CASE FILE")) {
            caseOrigin = "story";
        }
    }, true);

    function handleScreenChange() {
        if (!sessionStorage.getItem(SESSION_KEY)) return;

        if (isPlaying()) {
            wasPlaying = true;
            return;
        }

        if (wasPlaying && !welcome.hidden) {
            returnToOrigin();
        }
    }

    const observer = new MutationObserver(() => {
        handleScreenChange();
    });

    screenIds.forEach(id => {
        const screen = $(id);

        if (screen) {
            observer.observe(screen, {
                attributes: true,
                attributeFilter: [
                    "hidden",
                    "style",
                    "class"
                ]
            });
        }
    });

    observer.observe(welcome, {
        attributes: true,
        attributeFilter: ["hidden"]
    });

    /*
     The original Back handlers execute first.
     We then restore the appropriate page.
    */
    document.addEventListener("click", event => {
        const button = event.target.closest("button");

        if (!button) return;

        const label = button.textContent
            .trim()
            .toUpperCase();

        const isBack =
            label.includes("BACK TO CASE FILES") ||
            label.includes("RETURN TO CASE FILES") ||
            label.includes("BACK TO MAIN MENU");

        if (isBack && wasPlaying) {
            requestAnimationFrame(handleScreenChange);
        }
    });

    /*
     The original lobby Back button still handles
     returning from a section to the main Lobby.
    */
    $("lobby-back")?.addEventListener("click", () => {
        wasPlaying = false;
    });

    console.log("Smart Back Navigation ready.");
})();
