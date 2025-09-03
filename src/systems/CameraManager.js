export default class CameraManager {
    constructor(scene) {
        this.scene = scene;
        this.scene.cameras.main.setBounds(0, 0, this.scene.map.widthInPixels, this.scene.map.heightInPixels);
        this.scene.cameras.main.startFollow(this.scene.player);
        this.scene.cameras.main.setZoom(3);
    }
}