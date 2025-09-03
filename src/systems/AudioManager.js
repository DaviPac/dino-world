export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
    }

    addMusic(musicName, volume = 1.5) {
        this.scene.sound.add(musicName, {
            loop: true,
            volume: volume
        });
    }

    play(soundName) {
        this.scene.sound.play(soundName);
    }

    mute(soundName) {
        let music = this.scene.sound.get(soundName);
        console.log(music);
        music.setVolume(0);
    }

    getSound(soundName) {
        return this.scene.sound.get(soundName);
    }

    toggleMute() {
        return;
    }
}