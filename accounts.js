
"use strict";

/*
 AUDIT DETECTIVE — LOCAL MULTI-PLAYER ACCOUNTS

 Load this file BEFORE script.js and all polish files.

 Local profiles only. Not secure authentication.
 Never use a real-life password or sensitive PIN.
*/

(() => {
  const ACCOUNTS_KEY = "adLocalAccountsV1";
  const SESSION_KEY = "adActiveAccountV1";
  const PROGRESS_KEY = "auditDetectiveProgress";
  const PROFILE_KEY = "auditDetectivePlayerProfile";

  const byId = id => document.getElementById(id);

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function validIds(value) {
    if (!Array.isArray(value)) return [];

    return [...new Set(
      value.filter(id =>
        Number.isInteger(id) && id >= 1 && id <= 10
      )
    )].sort((a, b) => a - b);
  }

  function currentProgress() {
    return validIds(
      readJSON(PROGRESS_KEY, {}).completed
    );
  }

  function getAccounts() {
    const accounts = readJSON(ACCOUNTS_KEY, []);
    return Array.isArray(accounts) ? accounts : [];
  }

  function saveAccounts(accounts) {
    localStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify(accounts)
    );
  }

  function activeId() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  function activeAccount() {
    return getAccounts().find(
      account => account.id === activeId()
    );
  }

  function makeId() {
    if (crypto && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    return Date.now().toString(36) +
      "-" + Math.random().toString(36).slice(2);
  }

  // ==================================
  // PROGRESS SYNCHRONIZATION
  // ==================================

  let lastKnownProgress = "";

  function writeGameProgress(ids) {
    const cleaned = validIds(ids);

    localStorage.setItem(
      PROGRESS_KEY,
      JSON.stringify({ completed: cleaned })
    );

    lastKnownProgress = JSON.stringify(cleaned);
  }

  function saveActiveProgress() {
    const account = activeAccount();
    if (!account) return;

    const accounts = getAccounts();
    const target = accounts.find(
      item => item.id === account.id
    );

    if (!target) return;

    const stored = validIds(target.completed);
    const game = currentProgress();

    // Union protects Cases 007–010 against older
    // game code that may rewrite only Cases 001–006.
    const merged = validIds([...stored, ...game]);

    target.completed = merged;

    // Keep the player's latest profile name.
    const profile = readJSON(PROFILE_KEY, {});
    if (
      typeof profile.name === "string" &&
      profile.name.trim()
    ) {
      target.name = profile.name.trim().slice(0, 24);
    }

    saveAccounts(accounts);

    if (
      JSON.stringify(game) !== JSON.stringify(merged)
    ) {
      writeGameProgress(merged);
    }

    lastKnownProgress = JSON.stringify(merged);
  }

  function loadAccount(account) {
    // IMPORTANT: save outgoing account first.
    if (activeAccount()) {
      saveActiveProgress();
    }

    sessionStorage.setItem(SESSION_KEY, account.id);

    writeGameProgress(account.completed || []);

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ name: account.name })
    );
  }

  function logout() {
    if (!activeAccount()) return;

    const yes = confirm(
      "LOGOUT DETECTIVE?\n\n" +
      "Your investigation progress will be saved.\n" +
      "Switch to another detective account?"
    );

    if (!yes) return;

    saveActiveProgress();

    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(PROFILE_KEY);

    location.reload();
  }

  // ==================================
  // ACCOUNT SCREEN
  // ==================================

  function createAuthUI() {
    const auth = document.createElement("div");
    auth.id = "detective-auth";

    auth.innerHTML = `
      <main class="auth-card">
        <div class="auth-logo">🕵️</div>

        <div class="auth-kicker">
          FINANCIAL INVESTIGATION DIVISION
        </div>

        <h1 class="auth-title">
          DETECTIVE ACCESS PORTAL
        </h1>

        <p class="auth-description">
          Identify yourself before entering
          the investigation headquarters.
        </p>

        <div class="auth-tabs">
          <button id="auth-login-tab"
            class="auth-tab active" type="button">
            LOGIN
          </button>

          <button id="auth-create-tab"
            class="auth-tab" type="button">
            CREATE ACCOUNT
          </button>
        </div>

        <form id="auth-form">
          <div class="auth-field">
            <label for="auth-name">
              DETECTIVE CODENAME
            </label>
            <input id="auth-name"
              maxlength="24"
              autocomplete="username"
              placeholder="Enter your codename"
              required>
          </div>

          <div class="auth-field">
            <label for="auth-pin">
              ACCESS PIN (4–8 DIGITS)
            </label>
            <input id="auth-pin"
              type="password"
              inputmode="numeric"
              pattern="[0-9]{4,8}"
              minlength="4"
              maxlength="8"
              autocomplete="off"
              placeholder="Enter your PIN"
              required>
          </div>

          <div id="auth-error"
            class="auth-error"
            role="alert"
            aria-live="polite"></div>

          <button id="auth-submit"
            class="auth-submit" type="submit">
            UNLOCK INVESTIGATION HQ →
          </button>
        </form>

        <div id="auth-account-list"
          class="auth-account-list"></div>

        <p class="auth-hint">
          Local game profiles only.
          Accounts stay in this browser.
          Do not use a real password or banking PIN.
        </p>
      </main>
    `;

    document.body.appendChild(auth);

    let mode = "login";

    function setMode(next) {
      mode = next;

      byId("auth-login-tab").classList.toggle(
        "active", mode === "login"
      );

      byId("auth-create-tab").classList.toggle(
        "active", mode === "create"
      );

      byId("auth-submit").textContent =
        mode === "login"
          ? "UNLOCK INVESTIGATION HQ →"
          : "CREATE DETECTIVE ACCOUNT →";

      byId("auth-error").textContent = "";
      byId("auth-pin").value = "";
    }

    function renderAccounts() {
      const list = byId("auth-account-list");
      list.innerHTML = "";

      getAccounts().forEach(account => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "auth-account-chip";
        chip.textContent = "🕵️ " + account.name;

        chip.addEventListener("click", () => {
          setMode("login");
          byId("auth-name").value = account.name;
          byId("auth-pin").focus();
        });

        list.appendChild(chip);
      });
    }

    byId("auth-login-tab").addEventListener(
      "click", () => setMode("login")
    );

    byId("auth-create-tab").addEventListener(
      "click", () => setMode("create")
    );

    byId("auth-form").addEventListener(
      "submit",
      event => {
        event.preventDefault();

        const name = byId("auth-name").value.trim();
        const pin = byId("auth-pin").value;
        const error = byId("auth-error");

        error.textContent = "";

        if (name.length < 2 || name.length > 24) {
          error.textContent =
            "Codename must be 2–24 characters.";
          return;
        }

        if (!/^[0-9]{4,8}$/.test(pin)) {
          error.textContent =
            "PIN must contain 4–8 digits.";
          return;
        }

        const accounts = getAccounts();
        const existing = accounts.find(
          account =>
            account.name.toLowerCase() ===
            name.toLowerCase()
        );

        if (mode === "create") {
          if (existing) {
            error.textContent =
              "Codename already exists. Please login.";
            return;
          }

          let completed = [];

          if (
            accounts.length === 0 &&
            currentProgress().length > 0
          ) {
            const importOld = confirm(
              "EXISTING GAME PROGRESS FOUND\n\n" +
              "Would you like to import your old " +
              "completed cases into this account?\n\n" +
              "OK = Import old progress\n" +
              "Cancel = Start from zero"
            );

            if (importOld) {
              completed = currentProgress();
            }
          }

          const account = {
            id: makeId(),
            name,
            pin,
            completed
          };

          accounts.push(account);

try {
  // Save the new account without logging in
  saveAccounts(accounts);

  // Return player to the LOGIN tab
  setMode("login");

  // Keep the new codename ready for login
  byId("auth-name").value = name;

  // Clear PIN so player must enter it again
  byId("auth-pin").value = "";

  // Update the account list
  renderAccounts();

  // Show successful registration message
  error.textContent =
    "✅ ACCOUNT CREATED SUCCESSFULLY! Please log in to continue.";

  // Focus on PIN input
  byId("auth-pin").focus();

} catch {
  error.textContent =
    "Could not save account. Check browser storage.";
}

return;
        }

        if (!existing || existing.pin !== pin) {
          error.textContent =
            "Incorrect codename or PIN.";
          return;
        }

        loadAccount(existing);
        location.reload();
      }
    );

    renderAccounts();

    // Existing Part 3 start screen is replaced.
    const oldLaunch = byId("p3-launch");
    if (oldLaunch) {
      oldLaunch.hidden = true;
      oldLaunch.style.display = "none";
    }

    if (getAccounts().length === 0) {
      setMode("create");
    }
  }

  // ==================================
  // LOGGED-IN ACCOUNT BAR
  // ==================================

  function createAccountBar() {
    const account = activeAccount();
    const dashboard = byId("ad-dashboard");

    if (!account || !dashboard) return;

    const bar = document.createElement("div");
    bar.id = "detective-account-bar";

    const name = document.createElement("span");
    name.className = "account-bar-name";
    name.textContent = "🔐 ACTIVE DETECTIVE: " + account.name;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "account-bar-button";
    button.textContent = "↪ LOGOUT / SWITCH DETECTIVE";
    button.addEventListener("click", logout);

    bar.append(name, button);
    dashboard.insertAdjacentElement("beforebegin", bar);
  }

  // ==================================
  // BOOT
  // ==================================

  function boot() {
    const account = activeAccount();

    // Hide old start screen even if polish3.js
    // created it after this file loaded.
    const oldLaunch = byId("p3-launch");
    if (oldLaunch) {
      oldLaunch.hidden = true;
      oldLaunch.style.display = "none";
    }

    if (!account) {
      createAuthUI();
      return;
    }

    // Restore account data if the page was reloaded.
    const game = currentProgress();
    const stored = validIds(account.completed);

    const merged = validIds([...game, ...stored]);
    writeGameProgress(merged);

    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ name: account.name })
    );

    createAccountBar();

    lastKnownProgress = JSON.stringify(merged);
  }

  document.addEventListener("DOMContentLoaded", boot);

  // Detect newly completed cases.
  // The original game continues to use its usual key.
  setInterval(() => {
    if (!activeAccount()) return;

    const game = JSON.stringify(currentProgress());

    if (game !== lastKnownProgress) {
      saveActiveProgress();
    }
  }, 400);

  window.addEventListener("pagehide", () => {
    if (activeAccount()) {
      saveActiveProgress();
    }
  });

  console.log("Detective Local Accounts engine loaded.");
})();
