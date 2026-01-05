// Left Sidebar Component - Profile, Navigation, Friends List

const SidebarLeft = {
  render() {
    const container = document.getElementById("sidebar-left");
    if (!container) return;

    container.innerHTML = `
            <!-- PROFILE CARD -->
            <div class="vgui-panel">
                <div class="vgui-header">
                    <span>Current Player</span>
                    <span class="text-[10px] text-gray-400">ONLINE</span>
                </div>
                <div class="p-2 flex flex-col items-center space-y-3">
                    <div class="w-20 h-20 border-2 border-[#666] relative bg-[#222]">
                        <img src="assets/images/FvTDdrZX0AENGZb.jpeg" alt="avatar" class="w-full h-full object-cover opacity-80" />
                        <div class="absolute -bottom-2 -right-2 bg-red-800 text-white text-[9px] px-1 border border-black font-bold">
                            VAC
                        </div>
                    </div>
                    <div class="text-center">
                        <h2 class="text-[#d5cc6e] font-bold text-lg leading-none">
                            Naman Vyas
                        </h2>
                        <div class="text-[10px] text-gray-400 mt-1">
                            github id: <a href="https://www.github.com/naman47vyas">naman47vyas</a>
                        </div>
                    </div>

                    <div class="w-full vgui-inset p-2 text-[10px] space-y-1 font-mono">
                        <div class="flex justify-between">
                            <span>Status:</span>
                            <span class="text-green-500">In-Game</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Game:</span>
                            <span class="text-[#d5cc6e]">Backend Dev @ middleware.io</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Time:</span> <span>3360 hrs</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- NAVIGATION (SERVER BROWSER TABS) -->
            <div class="vgui-panel">
                <div class="vgui-header">
                    <span>Server Browser</span>
                    <button class="w-3 h-3 bg-[#444] text-[8px] flex items-center justify-center leading-none">
                        x
                    </button>
                </div>
                <div class="p-1 space-y-1">
                    <button onclick="navigate('blog')" id="btn-blog" class="steam-btn w-full active">
                        Blog Posts
                    </button>
                    <button onclick="navigate('about')" id="btn-about" class="steam-btn w-full">
                        About Me
                    </button>
                    <button onclick="navigate('gallery')" id="btn-gallery" class="steam-btn w-full">
                        Gallery
                    </button>
                    <button onclick="navigate('links')" id="btn-links" class="steam-btn w-full">
                        Links
                    </button>
                    <button onclick="navigate('guestbook')" id="btn-guestbook" class="steam-btn w-full">
                        Guestbook
                    </button>
                </div>
            </div>

            <!-- FRIENDS LIST -->
            <div class="vgui-panel h-64 flex flex-col">
                <div class="vgui-header">
                    <span>Friends</span>
                    <span class="text-[9px]">3 Online</span>
                </div>
                <div class="vgui-inset flex-1 overflow-y-auto p-1 space-y-1 text-[10px]">
                    ${this.renderFriendsList()}
                </div>
            </div>
        `;
  },

  renderFriendsList() {
    const friends = [
      { name: "Gorden_F", status: "online", game: "cs_office" },
      { name: "AlyxV", status: "online", game: "d2_coast" },
      { name: "GMan", status: "away", game: "Snoozing" },
      { name: "Barney", status: "offline", game: "Offline" },
    ];

    return friends
      .map((friend) => {
        let statusClass = "bg-gray-600";
        let textClass = "text-gray-500";

        if (friend.status === "online") {
          statusClass = "bg-green-500 rounded-full shadow-[0_0_4px_#0f0]";
          textClass = "text-[#a3b9cc] hover:bg-[#4b5844] cursor-pointer";
        } else if (friend.status === "away") {
          statusClass = "bg-blue-400 rounded-full";
          textClass = "text-[#a3b9cc] hover:bg-[#4b5844] cursor-pointer";
        }

        return `
                <div class="flex items-center gap-2 ${textClass} p-1">
                    <div class="w-2 h-2 ${statusClass}"></div>
                    <span>${friend.name}</span>
                    <span class="ml-auto text-gray-500">${friend.status === "offline" ? "" : "- "}${friend.game}</span>
                </div>
            `;
      })
      .join("");
  },

  init() {
    this.render();
  },
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => SidebarLeft.init());
} else {
  SidebarLeft.init();
}
