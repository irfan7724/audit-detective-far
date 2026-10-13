
"use strict";

/*
 AUDIT DETECTIVE — AVATAR SYNC
 Keeps the same detective avatar across
 Lobby, Profile and Achievements.

 Does not modify accounts, XP or navigation.
*/

(() => {
    const SESSION_KEY = "adActiveAccountV1";
    const AVATAR_PREFIX = "adDetectiveAvatar_";

    const $ = id => document.getElementById(id);

    const allowedAvatars = [
        "🕵️",
        "👩‍💼",
        "👨‍💼",
        "👩‍🔬",
        "👨‍🔬",
        "🥷"
    ];

    function getAvatar() {
        const accountId = sessionStorage.getItem(
            SESSION_KEY
        );

        if (!accountId) return "🕵️";

        const saved = localStorage.getItem(
            AVATAR_PREFIX + accountId
        );

        return allowedAvatars.includes(saved)
            ? saved
            : "🕵️";
    }

    function updateAvatar() {
        const avatar = getAvatar();

        const targets = [
            document.querySelector(
                "#game-lobby .lobby-logo"
            ),
            $("detective-header-avatar"),
            $("dp-avatar"),
            document.querySelector(
                "#career-achievements .career-avatar"
            )
        ];

        targets.forEach(element => {
            if (element) {
                element.textContent = avatar;
            }
        });
    }

    /*
     Refresh after clicking an avatar option.
     The original profile script saves first,
     then this script updates all other places.
    */
    document.addEventListener("click", event => {
        const option = event.target.closest(
            ".dp-avatar-choice"
        );

        if (option) {
            requestAnimationFrame(updateAvatar);
        }
    });

    /*
     Refresh when opening Profile or Achievements.
    */
    document.addEventListener("click", event => {
        const button = event.target.closest(
            "#detective-profile-trigger, " +
            '[data-lobby-page="achievements"], ' +
            "#dp-achievements"
        );

        if (button) {
            requestAnimationFrame(updateAvatar);
        }
    });

    /*
     Also refresh after returning to Lobby.
    */
    document.getElementById("lobby-back")
        ?.addEventListener(
            "click",
            () => requestAnimationFrame(updateAvatar)
        );

    window.addEventListener(
        "pageshow",
        updateAvatar
    );

    window.addEventListener(
        "storage",
        updateAvatar
    );

    updateAvatar();

    console.log("Detective Avatar Sync ready.");
})();
