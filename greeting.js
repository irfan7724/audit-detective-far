
"use strict";

/*
 AUDIT DETECTIVE — PERSONAL GREETING
 Displays "Hai Detective [Name]!" after login.
*/

(() => {
  const PROFILE_KEY = "auditDetectivePlayerProfile";

  const menu = document.getElementById("welcome-screen");
  const dashboard = document.getElementById("ad-dashboard");

  if (!menu || !dashboard) return;

  const greeting = document.createElement("div");
  greeting.id = "detective-greeting";

  Object.assign(greeting.style, {
    marginBottom: "20px",
    padding: "22px",
    borderRadius: "14px",
    border: "1px solid rgba(244,205,128,.45)",
    background: "linear-gradient(135deg,#1d3045,#111c2d)",
    boxShadow: "0 12px 35px rgba(0,0,0,.25)"
  });

  const eyebrow = document.createElement("div");
  eyebrow.textContent = "◈ DETECTIVE HEADQUARTERS";
  eyebrow.style.cssText =
    "color:#79dce7;font-size:10px;" +
    "font-weight:900;letter-spacing:2px;";

  const heading = document.createElement("h2");
  heading.style.cssText =
    "color:#ffe3a4;font-size:clamp(23px,4vw,35px);" +
    "margin:12px 0 8px;line-height:1.3;";

  const description = document.createElement("p");
  description.textContent =
    "Welcome to Investigation HQ. Your next mission awaits.";
  description.style.cssText =
    "color:#c4d2e3;font-size:13px;line-height:1.7;";

  const verified = document.createElement("div");
  verified.textContent =
    "✓ IDENTITY VERIFIED · ACCESS GRANTED";
  verified.style.cssText =
    "color:#86e0b0;font-size:10px;" +
    "font-weight:900;letter-spacing:1px;margin-top:12px;";

  greeting.append(
    eyebrow,
    heading,
    description,
    verified
  );

  dashboard.parentNode.insertBefore(greeting, dashboard);

  function updateGreeting() {
    let name = "";

    try {
      const profile = JSON.parse(
        localStorage.getItem(PROFILE_KEY)
      );

      if (typeof profile?.name === "string") {
        name = profile.name.trim();
      }
    } catch {
      name = "";
    }

    heading.textContent = name
      ? "👋 Hai Detective " + name + "!"
      : "👋 Hai Detective!";

    greeting.hidden = !name;
  }

  // Update after player enters the game.
  const enterButton = document.getElementById("p3-enter");

  if (enterButton) {
    enterButton.addEventListener("click", () => {
      updateGreeting();
    });
  }

  // Update after editing the player profile.
  const saveButton = document.getElementById(
    "p3-save-profile"
  );

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      updateGreeting();
    });
  }

  window.addEventListener("storage", event => {
    if (event.key === PROFILE_KEY) {
      updateGreeting();
    }
  });

  updateGreeting();

  console.log("Detective greeting ready.");
})();
