// Right Sidebar Component - FPS Counter, Console, Music Player

const SidebarRight = {
  render() {
    const container = document.getElementById("sidebar-right");
    if (!container) return;

    container.innerHTML = `
            <!-- FPS / STATS -->
            <div class="bg-transparent text-right font-mono text-[#d5cc6e] text-lg font-bold pr-2"
                style="text-shadow: 1px 1px 0 #000">
                <span id="fps-counter">99</span> FPS
            </div>

            <!-- CONSOLE WINDOW -->
            <div class="vgui-panel flex flex-col h-96">
                <div class="vgui-header">
                    <span>Console</span>
                    <div class="w-3 h-3 bg-red-800"></div>
                </div>
                <div class="flex-1 bg-[#222] p-1 font-mono text-[10px] overflow-y-auto console-text" id="console-output">
                    <div>Warning: connection problem detected.</div>
                    <div>Downloading resources...</div>
                    <div class="text-gray-500">sv_gravity 800</div>
                    <div class="text-gray-500">mp_startmoney 800</div>
                    <div class="text-white">Initializing renderer...</div>
                    <br />
                    <div class="text-[#d5cc6e]">] version</div>
                    <div class="text-white">
                        Protocol version 48<br />Exe version 1.1.2.7 (cstrike)
                    </div>
                </div>
                <div class="p-1 bg-[#3e4637] flex gap-1">
                    <input type="text" id="console-input"
                        class="w-full bg-[#222] border border-[#555] text-[#d5cc6e] px-1 font-mono text-[10px]"
                        placeholder="Enter command..." />
                    <button onclick="runCommand()" class="steam-btn text-[10px] px-2">
                        Submit
                    </button>
                </div>
            </div>

            <!-- MUSIC PLAYER (VGUI STYLE) -->
            <div class="vgui-panel">
                <div class="vgui-header">Media Player</div>
                <div class="p-2 bg-[#2a2e25] text-center space-y-2">
                    <div class="bg-black border border-gray-600 h-6 flex items-center justify-center text-[10px] text-[#0f0] font-mono">
                        <span class="marquee-container w-full h-full bg-transparent border-none text-[#0f0]">
                            <span class="marquee-content">Now Playing: cs1.6-theme.mp3 - 128kbps</span>
                        </span>
                    </div>
                    <div class="flex justify-center gap-1">
                        <button onclick="toggleMusic()" id="play-btn" class="steam-btn w-8 text-[9px]">
                            ►
                        </button>
                        <button onclick="stopMusic()" class="steam-btn w-8 text-[9px]">
                            ■
                        </button>
                        <!-- Volume Control (optional visual) -->
                        <div class="flex items-center gap-1 ml-1">
                            <div class="w-1 h-3 bg-[#0f0]"></div>
                            <div class="w-1 h-3 bg-[#0f0]"></div>
                            <div class="w-1 h-3 bg-[#0f0]"></div>
                            <div class="w-1 h-3 bg-[#333]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center text-[10px] text-[#5e6d4b]">
                &copy; Valve Corporation. All rights reserved.<br />
                Just kidding, it's a fan site.
            </div>
        `;
  },

  init() {
    this.render();
    this.startFPSCounter();
  },

  startFPSCounter() {
    setInterval(() => {
      const fpsEl = document.getElementById("fps-counter");
      if (fpsEl) {
        const fps = Math.floor(Math.random() * (101 - 95) + 95);
        fpsEl.innerText = fps;
      }
    }, 500);
  },
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => SidebarRight.init());
} else {
  SidebarRight.init();
}
