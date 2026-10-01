function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    if (typeof window === "undefined") return;

    try {
      const soundIndex = Math.floor(Math.random() * 4) + 1;
      const sound = new Audio(`/sounds/keystroke${soundIndex}.mp3`);
      sound.currentTime = 0;
      sound.play().catch((err) => console.log("Audio play failed:", err));
    } catch (e) {
      console.log("Audio playback error:", e);
    }
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;
