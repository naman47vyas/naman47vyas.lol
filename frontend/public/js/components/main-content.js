// Main Content Component - Console Header and Content Tabs

const MainContent = {
  tabs: {
    home: {
      title: "Counter-Strike Source - /home",
      content: `
                <div class="border border-[#d5cc6e] bg-[#2a2e25] p-3">
                    <h3 class="font-bold text-[#d5cc6e] text-sm flex items-center gap-2">
                        <span class="animate-pulse">⚠️</span> SERVER MESSAGE OF THE DAY
                    </h3>
                    <div class="h-px bg-[#4b5844] my-2"></div>
                    <p class="text-[11px]">
                        This is the home of Naman Vyas, on the internet. Please be advised, this is underconstruction.<br />
                        Latest update: 11/26/2025 - Fixed CSS rendering bugs.
                    </p>
                </div>

                <div class="text-center py-8">
                    <h1 class="text-4xl font-black text-[#5e6d4b] tracking-tighter" style="text-shadow: 2px 2px 0px #000">
                        WELCOME TO THE SERVER
                    </h1>
                    <div class="mt-2 text-[#d5cc6e] font-mono text-xs">
                        Map: <span class="text-white">de_dust2</span> |
                        Players: <span class="text-white">1/32</span> |
                        Ping: <span class="text-white">5ms</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="bg-[#2d3326] p-2 border border-[#3e4637]">
                        <div class="text-[#99ccff] font-bold text-xs mb-1">Update #42</div>
                        <p class="text-[10px] text-gray-300">
                            Added support for new Half-Life 3 rumors. Still unconfirmed.
                        </p>
                    </div>
                    <div class="bg-[#2d3326] p-2 border border-[#3e4637]">
                        <div class="text-[#99ccff] font-bold text-xs mb-1">Config Loaded</div>
                        <p class="text-[10px] text-gray-300">
                            autoexec.cfg executed successfully.
                        </p>
                    </div>
                </div>
            `,
    },
    about: {
      title: "Counter-Strike Source - /about",
      content: `
                <h2 class="text-lg font-bold text-[#d5cc6e] mb-4 border-b border-[#4b5844] pb-1">
                    Player_Stats
                </h2>
                <div class="flex gap-4">
                    <div class="w-32 h-40 bg-black border border-gray-600 flex items-center justify-center">
                        <span class="text-[#d5cc6e] font-mono text-center text-xs">Model:<br />gordon.mdl</span>
                    </div>
                    <div class="flex-1 space-y-2 font-mono text-xs">
                        <div class="flex border-b border-[#3e4637] pb-1">
                            <span class="w-24 text-gray-500">Name:</span>
                            <span class="text-white">Admin</span>
                        </div>
                        <div class="flex border-b border-[#3e4637] pb-1">
                            <span class="w-24 text-gray-500">Class:</span>
                            <span class="text-white">Web Developer</span>
                        </div>
                        <div class="flex border-b border-[#3e4637] pb-1">
                            <span class="w-24 text-gray-500">Weapon:</span>
                            <span class="text-white">Keyboard + Mouse</span>
                        </div>
                        <div class="bg-[#2a2e25] p-2 mt-4 text-[10px] border border-[#d5cc6e] text-[#d5cc6e]">
                            "I grew up on LAN parties and CRT monitors. This site is a tribute to the golden age of PC gaming."
                        </div>
                    </div>
                </div>
            `,
    },
    gallery: {
      title: "Counter-Strike Source - /gallery",
      content: `
                <div class="bg-black p-1 border border-gray-600 mb-2 text-center text-xs text-gray-400">
                    Viewing screenshots/ (6 files)
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${Array.from(
                      { length: 4 },
                      (_, i) => `
                        <div class="aspect-video bg-[#111] border border-[#333] flex flex-col items-center justify-center group cursor-pointer hover:border-[#d5cc6e]">
                            <span class="text-xs text-gray-500 group-hover:text-[#d5cc6e]">de_map0${i + 1}.jpg</span>
                        </div>
                    `,
                    ).join("")}
                </div>
            `,
    },
    links: {
      title: "Counter-Strike Source - /links",
      content: `
                <table class="w-full text-left text-[10px] border-collapse">
                    <thead>
                        <tr class="bg-[#3e4637] text-[#d5cc6e]">
                            <th class="p-1 border border-[#222]">Hostname</th>
                            <th class="p-1 border border-[#222]">Map</th>
                            <th class="p-1 border border-[#222]">Latency</th>
                        </tr>
                    </thead>
                    <tbody class="font-mono text-gray-300">
                        <tr class="hover:bg-[#4b5844] cursor-pointer" onclick="window.open('#', '_blank')">
                            <td class="p-1 border border-[#222]">Valve Software</td>
                            <td class="p-1 border border-[#222]">www.valvesoftware.com</td>
                            <td class="p-1 border border-[#222]">5ms</td>
                        </tr>
                        <tr class="hover:bg-[#4b5844] cursor-pointer" onclick="window.open('#', '_blank')">
                            <td class="p-1 border border-[#222]">Steam Powered</td>
                            <td class="p-1 border border-[#222]">store.steampowered.com</td>
                            <td class="p-1 border border-[#222]">12ms</td>
                        </tr>
                        <tr class="hover:bg-[#4b5844] cursor-pointer" onclick="window.open('#', '_blank')">
                            <td class="p-1 border border-[#222]">GameBanana</td>
                            <td class="p-1 border border-[#222]">css_skins</td>
                            <td class="p-1 border border-[#222]">45ms</td>
                        </tr>
                    </tbody>
                </table>
            `,
    },
    guestbook: {
      title: "Counter-Strike Source - /guestbook",
      content: `
                <div class="flex-1 bg-[#222] border border-[#444] p-2 font-mono text-[10px] overflow-y-auto mb-2 min-h-[300px]"
                    style="font-family: 'Lucida Console'">
                    <div class="mb-1">
                        <span class="text-[#d5cc6e]">Player1:</span> nice site m8
                    </div>
                    <div class="mb-1">
                        <span class="text-blue-400">CT_Force:</span> where is the bomb?
                    </div>
                    <div class="mb-1">
                        <span class="text-[#d5cc6e]">Player1:</span> its at B
                    </div>
                    <div class="mb-1">
                        <span class="text-red-400">T_Terror:</span> Rush B cyka blyat
                    </div>
                    <div class="text-gray-500 italic">--- Previous messages cleared ---</div>
                </div>

                <form onsubmit="handleGuestbook(event)" class="flex gap-2 bg-[#3e4637] p-1 border border-[#222]">
                    <span class="text-[#d5cc6e] font-bold text-xs pt-1">Say:</span>
                    <input type="text" class="flex-1 bg-[#222] border border-[#555] text-white text-xs px-1"
                        placeholder="Type here..." />
                    <button type="submit" class="steam-btn px-2 text-xs">Submit</button>
                </form>
            `,
    },
  },

  render() {
    const container = document.getElementById("main-content");
    if (!container) {
      console.error("main-content container not found!");
      return;
    }

    container.innerHTML = `
            <!-- CONSOLE HEADER -->
            <div class="bg-[#2a2e25] border-t-2 border-[#4b5844] p-2 font-mono text-xs text-[#d5cc6e]">
                ] connect <span class="text-white">naman47vyas.lol</span><br />
                <span class="text-gray-400">Connection accepted.</span>
            </div>

            <!-- MAIN CONTENT WINDOW -->
            <div class="vgui-panel flex-1 min-h-[500px] flex flex-col">
                <div class="vgui-header">
                    <span id="window-title">Counter-Strike Source - /home</span>
                    <div class="flex gap-1">
                        <div class="w-3 h-3 border border-gray-500"></div>
                        <div class="w-3 h-3 border border-gray-500 bg-gray-600"></div>
                    </div>
                </div>

                <!-- CONTENT BODY -->
                <div class="vgui-inset flex-1 m-2 p-4 overflow-y-auto text-[#d1cfcd]">
                    ${this.renderAllTabs()}
                </div>
            </div>
        `;

    console.log("Main content rendered successfully!");
  },

  renderAllTabs() {
    return Object.entries(this.tabs)
      .map(
        ([tabId, tab]) => `
            <div id="content-${tabId}" class="tab-content ${tabId === "home" ? "active" : ""} space-y-6">
                ${tab.content}
            </div>
        `,
      )
      .join("");
  },

  init() {
    console.log("Initializing main content...");
    this.render();
  },
};

// Guestbook handler (global function for onclick)
function handleGuestbook(e) {
  e.preventDefault();
  alert("Chat message sent to server.");
  e.target.reset();
}

// Initialize immediately when this script loads
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => MainContent.init());
  } else {
    MainContent.init();
  }
})();
