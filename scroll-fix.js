
"use strict";

/*
 AUDIT DETECTIVE — LOGIN SCROLL FIX

 Fix page scrolling after local account login.
 Does not modify cases, XP or saved progress.
*/

(() => {
  const SESSION_KEY = "adActiveAccountV1";
  const ACCOUNTS_KEY = "adLocalAccountsV1";

  function isLoggedIn() {
    try {
      const id = sessionStorage.getItem(SESSION_KEY);
      const accounts = JSON.parse(
        localStorage.getItem(ACCOUNTS_KEY) || "[]"
      );

      return Boolean(
        id &&
        Array.isArray(accounts) &&
        accounts.some(account => account.id === id)
      );
    } catch {
      return false;
    }
  }

  function fixScroll() {
    if (!isLoggedIn()) return;

    const auth = document.getElementById("detective-auth");
    const oldLogin = document.getElementById("p3-launch");

    // Only unlock page scroll when no fullscreen
    // game cutscene or final ending is active.
    const storyCutscene =
      document.getElementById("story-cutscene");

    const finalEnding =
      document.getElementById("s2-ending");

    const storyIsOpen =
      storyCutscene &&
      !storyCutscene.hidden &&
      getComputedStyle(storyCutscene).display !== "none";

    const endingIsOpen =
      finalEnding &&
      !finalEnding.hidden &&
      getComputedStyle(finalEnding).display !== "none";

    if (storyIsOpen || endingIsOpen) return;

    if (auth) {
      auth.hidden = true;
    }

    if (oldLogin) {
      oldLogin.hidden = true;
      oldLogin.style.display = "none";
    }

    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";
    document.body.style.position = "";
    document.body.style.height = "";
  }

  document.addEventListener("DOMContentLoaded", fixScroll);

  window.addEventListener("load", fixScroll);

  window.addEventListener("pageshow", fixScroll);

  // The old title screen can change overflow
  // after the new account system initializes.
  setInterval(fixScroll, 700);

  console.log("Login Scroll Fix loaded.");
})();
