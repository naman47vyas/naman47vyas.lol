// Visual and Audio Effects Module

const Effects = {
  init() {
    // Global click handler for gunshot effect
    document.addEventListener("click", (e) => {
      this.playGunshotSound();
      this.createBulletHole(e.pageX, e.pageY);
    });
  },

  playGunshotSound() {
    const gunAudio = document.getElementById("gunshot-sound");
    if (gunAudio) {
      // Clone the audio node to allow rapid fire/overlapping sounds
      const soundClone = gunAudio.cloneNode();
      soundClone.volume = 0.2; // Keep volume low
      soundClone.play().catch(() => {
        // Silently fail if audio can't play
      });
    }
  },

  createBulletHole(x, y) {
    const hole = document.createElement("div");
    hole.className = "bullet-hole";
    // Center the bullet hole on the click position
    hole.style.left = x - 3 + "px";
    hole.style.top = y - 3 + "px";
    document.body.appendChild(hole);

    // Remove bullet hole after animation completes
    setTimeout(() => {
      hole.remove();
    }, 3000);
  },
};

// Initialize effects when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  Effects.init();
});
