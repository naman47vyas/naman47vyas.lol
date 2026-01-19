// Main Content Component - Console Header and Content Tabs

const MainContent = {
  tabs: {
    blog: {
      title: "Counter-Strike Source - /blog",
      content: `
                <div class="border border-[#d5cc6e] bg-[#2a2e25] p-3 mb-4">
                    <h3 class="font-bold text-[#d5cc6e] text-sm flex items-center gap-2">
                        <span>📝</span> BLOG POSTS
                    </h3>
                    <div class="h-px bg-[#4b5844] my-2"></div>
                    <p class="text-[10px] text-gray-400">
                        Technical writings, thoughts, and experiences from the trenches.
                    </p>
                </div>
                `,
    },
    about: {
      title: "Counter-Strike Source - /about",
      content: `
            <h2 class="text-lg font-bold text-[#d5cc6e] mb-4 border-b border-[#4b5844] pb-1">
                Player_Stats
            </h2>


            <div class="flex gap-4 mb-6">
                <div class="w-32 h-40 bg-black border border-gray-600 relative overflow-hidden">
                    <img src="assets/images/FvTDdrZX0AENGZb.jpeg" alt="Player Model" class="w-full h-full object-cover opacity-90" />
                    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-center py-1">
                        <span class="text-[#d5cc6e] font-mono text-[9px]">engineer.mdl</span>
                    </div>
                </div>
                <div class="flex-1 space-y-2 font-mono text-xs">
                    <div class="flex border-b border-[#3e4637] pb-1">
                        <span class="w-32 text-gray-500">Name:</span>
                        <span class="text-white">Naman Vyas</span>
                    </div>
                    <div class="flex border-b border-[#3e4637] pb-1">
                        <span class="w-32 text-gray-500">Class:</span>
                        <span class="text-white">Software Engineer</span>
                    </div>
                    <div class="flex border-b border-[#3e4637] pb-1">
                        <span class="w-32 text-gray-500">Current Server:</span>
                        <span class="text-white">Middleware Labs (Agent Team)</span>
                    </div>
                    <div class="flex border-b border-[#3e4637] pb-1">
                        <span class="w-32 text-gray-500">Primary Weapons:</span>
                        <span class="text-white">Go, Python</span>
                    </div>
                    <div class="flex border-b border-[#3e4637] pb-1">
                        <span class="w-32 text-gray-500">Secondary:</span>
                        <span class="text-white">Bash, SQL</span>
                    </div>
                    <div class="flex border-b border-[#3e4637] pb-1">
                        <span class="w-32 text-gray-500">Experience:</span>
                        <span class="text-white">4+ Years</span>
                    </div>
                </div>
            </div>

            <div class="mb-6 bg-[#2a2e25] border border-[#3e4637] p-3">
                <h3 class="text-[#d5cc6e] font-bold text-xs mb-2 border-b border-[#4b5844] pb-1">
                    [ LOADOUT / TECH STACK ]
                </h3>
                <div class="space-y-2 text-[10px] font-mono">
                    <div>
                        <span class="text-gray-400">Languages:</span>
                        <span class="text-white ml-2">Go • Python • Bash • SQL</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Frameworks:</span>
                        <span class="text-white ml-2">OpenTelemetry • FastAPI • Flask • SQLAlchemy</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Databases:</span>
                        <span class="text-white ml-2">PostgreSQL • MySQL • Redis • Elasticsearch</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Tools:</span>
                        <span class="text-white ml-2">Git • GitHub Actions • Docker • Nginx • RabbitMQ</span>
                    </div>
                    <div>
                        <span class="text-gray-400">Specialties:</span>
                        <span class="text-white ml-2">Backend Dev • Testing • ML • Observability</span>
                    </div>
                </div>
            </div>

            <div class="mb-4 bg-[#2d3326] border border-[#3e4637] p-3">
                <h3 class="text-[#99ccff] font-bold text-xs mb-2">
                    [ RECENT KILLS / ACHIEVEMENTS ]
                </h3>
                <div class="space-y-2 text-[10px]">
                    <div class="text-gray-300">
                        <span class="text-[#d5cc6e]">»</span> Increased telemetry cardinality by 100% with InnoParser for MySQL InnoDB logs
                    </div>
                    <div class="text-gray-300">
                        <span class="text-[#d5cc6e]">»</span> Built 7+ integrations for middleware-agent (MySQL, PostgreSQL, Nginx, RabbitMQ, etc.)
                    </div>
                    <div class="text-gray-300">
                        <span class="text-[#d5cc6e]">»</span> Architected type-safe config system replacing runtime uncertainties with compile-time guarantees
                    </div>
                    <div class="text-gray-300">
                        <span class="text-[#d5cc6e]">»</span> Enriched APM with sub-millisecond stack traces powering LLM-driven debugging
                    </div>
                    <div class="text-gray-300">
                        <span class="text-[#d5cc6e]">»</span> Implemented FAISS similarity search <50ms for 100K+ images at Infosys
                    </div>
                </div>
            </div>

            <div class="bg-[#2a2e25] p-3 border border-[#d5cc6e]">
                <div class="text-[10px] font-mono space-y-1">
                    <div class="text-[#d5cc6e] font-bold mb-2">[ CONNECT / CONTACT ]</div>
                    <div class="text-gray-300">
                        <span class="text-gray-500">Email:</span>
                        <a href="mailto:writetonamanvyas@gmail.com" class="text-white ml-2 hover:text-[#d5cc6e]">writetonamanvyas@gmail.com</a>
                    </div>
                    <div class="text-gray-300">
                        <span class="text-gray-500">GitHub:</span>
                        <a href="https://github.com/naman47vyas" target="_blank" class="text-white ml-2 hover:text-[#d5cc6e]">github.com/naman47vyas</a>
                    </div>
                    <div class="text-gray-300">
                        <span class="text-gray-500">LinkedIn:</span>
                        <a href="https://linkedin.com/in/vyasn30" target="_blank" class="text-white ml-2 hover:text-[#d5cc6e]">linkedin.com/in/vyasn30</a>
                    </div>
                </div>
            </div>

            <div class="mt-4 text-center text-[9px] text-gray-500 font-mono">
                B.E. Computer Science • Gujarat Technological University '21 • CGPA 8.5
            </div>
        `,
    },
    gallery: {
      title: "Counter-Strike Source - /gallery",
      content: `
                <div class="bg-black p-1 border border-gray-600 mb-2 text-center text-xs text-gray-400">
                    Viewing photos/ (1 files)
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${Array.from(
                      { length: 1 },
                      (_, i) => `
                      <div
                        onclick="openModal('assets/images/gallery/IMG20260115184423.jpg')"
                        class="aspect-video bg-[#111] border border-[#333] flex flex-col items-center justify-center group cursor-pointer hover:border-[#d5cc6e]">
                          <img src="assets/images/gallery/IMG20260115184423.jpg" alt="Photo 1" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
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
                        <tr class="hover:bg-[#4b5844] cursor-pointer" onclick="window.open('https://github.com/naman47vyas', '_blank')">
                            <td class="p-1 border border-[#222]">GitHub</td>
                            <td class="p-1 border border-[#222]">github.com/naman47vyas</td>
                            <td class="p-1 border border-[#222]">5ms</td>
                        </tr>
                        <tr class="hover:bg-[#4b5844] cursor-pointer" onclick="window.open('https://linkedin.com/in/vyasn30', '_blank')">
                            <td class="p-1 border border-[#222]">LinkedIn</td>
                            <td class="p-1 border border-[#222]">linkedin.com/in/vyasn30</td>
                            <td class="p-1 border border-[#222]">12ms</td>
                        </tr>
                        <tr class="hover:bg-[#4b5844] cursor-pointer" onclick="window.open('mailto:writetonamanvyas@gmail.com', '_blank')">
                            <td class="p-1 border border-[#222]">Email</td>
                            <td class="p-1 border border-[#222]">writetonamanvyas@gmail.com</td>
                            <td class="p-1 border border-[#222]">8ms</td>
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
            <div class="bg-[#2a2e25] border-t-2 border-[#4b5844] p-2 font-mono text-xs text-[#d5cc6e]">
                ] connect <span class="text-white">naman47vyas.lol</span><br />
                <span class="text-gray-400">Connection accepted.</span>
            </div>

            <div class="vgui-panel flex-1 min-h-[500px] flex flex-col">
                <div class="vgui-header">
                    <span id="window-title">Counter-Strike Source - /blog</span>
                    <div class="flex gap-1">
                        <div class="w-3 h-3 border border-gray-500"></div>
                        <div class="w-3 h-3 border border-gray-500 bg-gray-600"></div>
                    </div>
                </div>

                <div class="vgui-inset flex-1 m-2 p-4 overflow-y-auto text-[#d1cfcd]">
                    ${this.renderAllTabs()}
                </div>
            </div>

            <div id="gallery-modal" onclick="closeModal()" class="hidden fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                <div class="relative max-w-4xl max-h-[90vh]">
                     <img id="modal-image" src="" class="max-w-full max-h-[85vh] border-2 border-[#d5cc6e] shadow-[0_0_20px_rgba(213,204,110,0.2)]" onclick="event.stopPropagation()" />
                     <div class="text-center mt-2 text-[#d5cc6e] font-mono text-xs">
                        [ CLICK BACKGROUND TO CLOSE ]
                     </div>
                </div>
            </div>
        `;

    console.log("Main content rendered successfully!");
  },

  renderAllTabs() {
    return Object.entries(this.tabs)
      .map(
        ([tabId, tab]) => `
            <div id="content-${tabId}" class="tab-content ${tabId === "about" ? "active" : ""} space-y-6">
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

// Guestbook handler
function handleGuestbook(e) {
  e.preventDefault();
  alert("Chat message sent to server.");
  e.target.reset();
}

// Modal Handlers
function openModal(imageSrc) {
  const modal = document.getElementById("gallery-modal");
  const modalImg = document.getElementById("modal-image");
  if (modal && modalImg) {
    modalImg.src = imageSrc;
    modal.classList.remove("hidden");
  }
}

function closeModal() {
  const modal = document.getElementById("gallery-modal");
  if (modal) {
    modal.classList.add("hidden");
    // clear src to stop video/large loading if applicable, or just reset
    setTimeout(() => {
      document.getElementById("modal-image").src = "";
    }, 200);
  }
}

// Initialize immediately when this script loads
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => MainContent.init());
  } else {
    MainContent.init();
  }
})();

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
