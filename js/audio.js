// Audio Module - Music Player Controls

const AudioPlayer = {
  audio: null,
  playBtn: null,
  isPlaying: false,

  init() {
    this.audio = document.getElementById("audio-player");
    this.playBtn = document.getElementById("play-btn");
  },

  toggle() {
    if (!this.audio || !this.playBtn) {
      this.init();
    }

    if (this.isPlaying) {
      this.audio.pause();
      this.playBtn.innerText = "►";
      this.isPlaying = false;
    } else {
      this.audio.play().catch((e) => {
        console.log("Audio play failed (user interaction needed):", e);
      });
      this.playBtn.innerText = "II";
      this.isPlaying = true;
    }
  },

  stop() {
    if (!this.audio || !this.playBtn) {
      this.init();
    }

    this.audio.pause();
    this.audio.currentTime = 0;
    this.playBtn.innerText = "►";
    this.isPlaying = false;
  },
};

// Global functions for onclick handlers
function toggleMusic() {
  AudioPlayer.toggle();
}

function stopMusic() {
  AudioPlayer.stop();
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  AudioPlayer.init();
});
