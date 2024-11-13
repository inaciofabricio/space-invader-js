class SoundEffects {
    constructor() {
        this.shootSounds = [
            new Audio("assets/audios/shoot.mp3"),
            new Audio("assets/audios/shoot.mp3"),
            new Audio("assets/audios/shoot.mp3"),
            new Audio("assets/audios/shoot.mp3"),
            new Audio("assets/audios/shoot.mp3"),
        ];

        this.hitSounds = [
            new Audio("assets/audios/hit.mp3"),
            new Audio("assets/audios/hit.mp3"),
            new Audio("assets/audios/hit.mp3"),
            new Audio("assets/audios/hit.mp3"),
            new Audio("assets/audios/hit.mp3"),
        ];

        this.explosionSound = new Audio("assets/audios/explosion.mp3");
        this.nextLevelSound = new Audio("assets/audios/next_level.mp3");

        this.currentShootSound = 0;
        this.currentHitSound = 0;

        this.adjustVolumes();
    }

    // Toca o som de tiro, reiniciando o tempo de reprodução a cada vez.
    // Alterna para o próximo som de tiro no array.
    playShootSound() {
        this.shootSounds[this.currentShootSound].currentTime = 0;
        this.shootSounds[this.currentShootSound].play();
        this.currentShootSound =
            (this.currentShootSound + 1) % this.shootSounds.length;
    }

    // Toca o som de acerto, reiniciando o tempo de reprodução a cada vez.
    // Alterna para o próximo som de acerto no array.
    playHitSound() {
        this.hitSounds[this.currentHitSound].currentTime = 0;
        this.hitSounds[this.currentHitSound].play();
        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length;
    }

    // Toca o som de explosão.
    playExplosionSound() {
        this.explosionSound.play();
    }

    // Toca o som de próximo nível.
    playNextLevelSound() {
        this.nextLevelSound.play();
    }

    // Ajusta o volume de todos os sons para garantir que fiquem equilibrados.
    adjustVolumes() {
        this.hitSounds.forEach((sound) => (sound.volume = 0.2));
        this.shootSounds.forEach((sound) => (sound.volume = 0.5));
        this.explosionSound.volume = 0.2;
        this.nextLevelSound.volume = 0.4;
    }
}

export default SoundEffects;