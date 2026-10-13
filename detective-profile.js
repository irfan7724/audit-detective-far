
"use strict";

/*
 AUDIT DETECTIVE — DETECTIVE PROFILE
 Personal avatar, codename, rank and XP.
 Compatible with existing local accounts.
*/

(() => {
    const $ = id => document.getElementById(id);

    const ACCOUNTS = "adLocalAccountsV1";
    const SESSION = "adActiveAccountV1";
    const PROFILE = "auditDetectivePlayerProfile";
    const PROGRESS = "auditDetectiveProgress";

    const avatars = ["🕵️", "👩‍💼", "👨‍💼", "👩‍🔬", "👨‍🔬", "🥷"];

    const header = document.querySelector(
        "#game-lobby .lobby-header"
    );

    if (!header) {
        console.warn("Detective Profile: Lobby not found.");
        return;
    }

    function read(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key)) ??
                fallback;
        } catch {
            return fallback;
        }
    }

    function accounts() {
        const data = read(ACCOUNTS, []);
        return Array.isArray(data) ? data : [];
    }

    function activeAccount() {
        const id = sessionStorage.getItem(SESSION);
        return accounts().find(a => a.id === id);
    }

    function completedCount() {
        const data = read(PROGRESS, {});
        const ids = Array.isArray(data.completed)
            ? data.completed
            : [];

        return new Set(
            ids.filter(n =>
                Number.isInteger(n) && n >= 1 && n <= 10
            )
        ).size;
    }

    function rank(count) {
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

    function avatarKey() {
        const account = activeAccount();
        return account
            ? "adDetectiveAvatar_" + account.id
            : null;
    }

    function currentAvatar() {
        const key = avatarKey();
        const saved = key ? localStorage.getItem(key) : null;
        return avatars.includes(saved) ? saved : avatars[0];
    }

    const profileButton = document.createElement("button");
    profileButton.id = "detective-profile-trigger";
    profileButton.type = "button";
    profileButton.setAttribute("aria-label", "Open detective profile");

    profileButton.innerHTML = `
        <span id="detective-header-avatar">🕵️</span>
        <span class="detective-trigger-label">MY PROFILE</span>
        <span>⌄</span>
    `;

    const logoutButton = $("lobby-logout");

    if (logoutButton) {
        header.insertBefore(profileButton, logoutButton);
    } else {
        header.appendChild(profileButton);
    }

    const overlay = document.createElement("div");
    overlay.id = "detective-profile-overlay";
    overlay.hidden = true;

    overlay.innerHTML = `
        <section class="detective-profile-card"
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="dp-title">

            <div class="dp-top">
                <span>◈ DETECTIVE PERSONNEL FILE</span>
                <button id="dp-close"
                        type="button"
                        aria-label="Close profile">✕</button>
            </div>

            <div class="dp-identity">
                <div id="dp-avatar" class="dp-avatar">🕵️</div>
                <h2 id="dp-title">DETECTIVE PROFILE</h2>
                <h3 id="dp-name"></h3>
                <p id="dp-rank"></p>
                <small id="dp-id"></small>
            </div>

            <div class="dp-stats">
                <div>
                    <strong id="dp-xp">0</strong>
                    <span>TOTAL XP</span>
                </div>
                <div>
                    <strong id="dp-cases">0/10</strong>
                    <span>CASES SOLVED</span>
                </div>
            </div>

            <div class="dp-section">
                <h4>🎭 CHOOSE YOUR AVATAR</h4>
                <div id="dp-avatar-options"
                     class="dp-avatar-options"></div>
            </div>

            <div class="dp-section">
                <h4>✏️ EDIT DETECTIVE CODENAME</h4>
                <form id="dp-name-form">
                    <input id="dp-name-input"
                           type="text"
                           minlength="2"
                           maxlength="24"
                           required
                           placeholder="Detective codename">
                    <button type="submit">SAVE NAME</button>
                </form>
                <p id="dp-message" role="status"></p>
            </div>

            <button id="dp-achievements"
                    class="dp-achievements"
                    type="button">
                🏆 VIEW MY ACHIEVEMENTS →
            </button>

            <p class="dp-footnote">
                Profile changes are saved on this device.
            </p>
        </section>
    `;

    document.body.appendChild(overlay);

    const avatarOptions = $("dp-avatar-options");

    avatars.forEach(avatar => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "dp-avatar-choice";
        button.textContent = avatar;
        button.setAttribute(
            "aria-label",
            "Choose avatar " + avatar
        );

        button.addEventListener("click", () => {
            const key = avatarKey();
            if (!key) return;

            localStorage.setItem(key, avatar);
            refresh();
        });

        avatarOptions.appendChild(button);
    });

    function refresh() {
        const account = activeAccount();
        if (!account) return;

        const count = completedCount();
        const avatar = currentAvatar();

        $("detective-header-avatar").textContent = avatar;
        $("dp-avatar").textContent = avatar;
        $("dp-name").textContent = account.name;
        $("dp-rank").textContent = "★ " + rank(count);
        $("dp-id").textContent =
            "DETECTIVE ID: " +
            account.id.slice(0, 8).toUpperCase();

        $("dp-xp").textContent =
            (count * 100).toLocaleString("en-MY");

        $("dp-cases").textContent = count + "/10";

        $("dp-name-input").value = account.name;

        avatarOptions.querySelectorAll("button")
            .forEach(button => {
                const selected =
                    button.textContent === avatar;

                button.classList.toggle(
                    "selected",
                    selected
                );

                button.setAttribute(
                    "aria-pressed",
                    String(selected)
                );
            });

        if ($("lobby-player")) {
            $("lobby-player").textContent = account.name;
        }
    }

    function openProfile() {
        if (!activeAccount()) return;

        refresh();
        $("dp-message").textContent = "";
        overlay.hidden = false;
        document.body.classList.add("dp-open");
        $("dp-close").focus();
    }

    function closeProfile() {
        overlay.hidden = true;
        document.body.classList.remove("dp-open");
        profileButton.focus();
    }

    profileButton.addEventListener("click", openProfile);
    $("dp-close").addEventListener("click", closeProfile);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeProfile();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !overlay.hidden) {
            closeProfile();
        }
    });

    $("dp-name-form").addEventListener("submit", event => {
        event.preventDefault();

        const account = activeAccount();
        if (!account) return;

        const newName = $("dp-name-input").value.trim();
        const message = $("dp-message");

        if (newName.length < 2 || newName.length > 24) {
            message.textContent =
                "Codename must be 2–24 characters.";
            return;
        }

        const all = accounts();

        const duplicate = all.some(a =>
            a.id !== account.id &&
            a.name.toLowerCase() === newName.toLowerCase()
        );

        if (duplicate) {
            message.textContent =
                "Codename already belongs to another detective.";
            return;
        }

        const target = all.find(a => a.id === account.id);
        if (!target) return;

        try {
            target.name = newName;

            // Update both locations so accounts.js
            // does not restore the previous name.
            localStorage.setItem(
                ACCOUNTS,
                JSON.stringify(all)
            );

            localStorage.setItem(
                PROFILE,
                JSON.stringify({ name: newName })
            );

            refresh();
            message.textContent = "✓ Codename saved!";
        } catch {
            message.textContent =
                "Unable to save. Check browser storage.";
        }
    });

    $("dp-achievements").addEventListener("click", () => {
        closeProfile();

        const button = document.querySelector(
            '[data-lobby-page="achievements"]'
        );

        if (button) button.click();
    });

    refresh();

    console.log("Detective Profile ready.");
})();
