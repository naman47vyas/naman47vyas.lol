// Main Application Entry Point

const App = {
  init() {
    console.log(
      "%c🎮 Counter-Strike: Source - Personal Site",
      "color: #d5cc6e; font-size: 16px; font-weight: bold;",
    );
    console.log("%cWelcome to the server!", "color: #5e6d4b;");
    console.log(
      "%cMap: de_dust2 | Players: 1/32 | Ping: 5ms",
      "color: #c0c6b1;",
    );

    // All component initialization is handled by their individual modules
    // This is just the main entry point for any global app logic

    this.addKeyboardShortcuts();
  },

  addKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Tilde key (~) to focus console
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        const consoleInput = document.getElementById("console-input");
        if (consoleInput) {
          consoleInput.focus();
        }
      }

      // Number keys 1-5 for quick navigation
      if (
        e.key >= "1" &&
        e.key <= "5" &&
        !e.target.matches("input, textarea")
      ) {
        const tabs = ["home", "about", "gallery", "links", "guestbook"];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
          navigate(tabs[tabIndex]);
        }
      }

      // M key to toggle music
      if (e.key === "m" && !e.target.matches("input, textarea")) {
        toggleMusic();
      }
    });
  },
};

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.init());
} else {
  App.init();
}
