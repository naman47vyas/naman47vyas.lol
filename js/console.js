// Console Module

function runCommand() {
  const input = document.getElementById("console-input");
  const output = document.getElementById("console-output");

  if (!input || !output) return;

  const cmd = input.value.trim();

  if (cmd) {
    const newLine = document.createElement("div");
    newLine.innerHTML = `<span class="text-[#d5cc6e]">] ${cmd}</span>`;
    output.appendChild(newLine);

    // Simulate response
    setTimeout(() => {
      const resp = document.createElement("div");
      resp.className = "text-white";

      if (cmd === "quit" || cmd === "exit") {
        resp.innerText = "Cannot quit. You are trapped in the 90s.";
      } else if (cmd === "clear") {
        output.innerHTML = "";
      } else if (cmd === "help") {
        resp.innerHTML = `Available commands:<br/>
                    - clear: Clear console<br/>
                    - version: Show version info<br/>
                    - status: Show server status<br/>
                    - exit/quit: Exit (not working)`;
      } else if (cmd === "version") {
        resp.innerHTML = `Protocol version 48<br/>Exe version 1.1.2.7 (cstrike)`;
      } else if (cmd === "status") {
        resp.innerHTML = `hostname: naman47vyas.lol<br/>
                    version : 1.1.2.7/48 5788 secure<br/>
                    map     : de_dust2<br/>
                    players : 1 (32 max)`;
      } else {
        resp.innerText = `Unknown command: ${cmd}`;
      }

      if (cmd !== "clear") {
        output.appendChild(resp);
      }
      output.scrollTop = output.scrollHeight;
    }, 200);

    input.value = "";
  }
}

// Initialize console input handler
document.addEventListener("DOMContentLoaded", () => {
  const consoleInput = document.getElementById("console-input");
  if (consoleInput) {
    consoleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        runCommand();
      }
    });
  }
});
