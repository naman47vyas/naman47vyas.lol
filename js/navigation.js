// Navigation Module

function navigate(tabId) {
  // Hide all tab content
  document.querySelectorAll(".tab-content").forEach((el) => {
    el.classList.remove("active");
  });

  // Show selected tab
  const selectedTab = document.getElementById(`content-${tabId}`);
  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  // Update button states
  document.querySelectorAll(".steam-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const selectedBtn = document.getElementById(`btn-${tabId}`);
  if (selectedBtn) {
    selectedBtn.classList.add("active");
  }

  // Update window title
  const windowTitle = document.getElementById("window-title");
  if (windowTitle) {
    const titles = {
      home: "Counter-Strike Source - /home",
      about: "Counter-Strike Source - /about",
      gallery: "Counter-Strike Source - /gallery",
      links: "Counter-Strike Source - /links",
      guestbook: "Counter-Strike Source - /guestbook",
    };
    windowTitle.textContent = titles[tabId] || "Counter-Strike Source";
  }

  // Play navigation sound
  playSound("click");
}

function playSound(type) {
  const clickAudio = document.getElementById("gunshot-sound");
  if (clickAudio) {
    const soundClone = clickAudio.cloneNode();
    soundClone.volume = 0.2;
    soundClone.play().catch(() => {});
  }
}
