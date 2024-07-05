document.addEventListener('DOMContentLoaded', function () {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicControlButton = document.getElementById('musicControlButton');
    const isMusicPaused = localStorage.getItem('isMusicPaused') === 'true';

    // Initialize Music State
    if (isMusicPaused) {
        backgroundMusic.pause();
        musicControlButton.textContent = 'Play Music';
    } else {
        backgroundMusic.play();
        musicControlButton.textContent = 'Pause Music';
    }

    // Toggle Music Playback
    window.toggleMusic = function () {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicControlButton.textContent = 'Pause Music';
            localStorage.setItem('isMusicPaused', 'false');
        } else {
            backgroundMusic.pause();
            musicControlButton.textContent = 'Play Music';
            localStorage.setItem('isMusicPaused', 'true');
        }
    };
});
