import Fish from "../Fish.js";

export default class FishingRod {
    constructor() {
        this.icon = { key: 'basic-tools-icons', frame: 12 };
    }

    use(user) {
        user.isAttacking = true;
        user.setVelocity(0);

        let animKey = 'fish_down';
        if (user.lastDirection === 'left' || user.lastDirection === 'right') {
            animKey = 'fish_side';
        } else if (user.lastDirection === 'up') {
            animKey = 'fish_up';
        }
        
        user.anims.play(animKey, true);

        user.removeAllListeners('animationupdate');
        user.removeAllListeners('animationcomplete');

        user.once('animationcomplete', () => {
            this.catchFish(user);
        });
    }

    catchFish(user) {
        let animKey = 'catch_fish_down';
        if (user.lastDirection === 'left' || user.lastDirection === 'right') {
            animKey = 'catch_fish_side';
        } else if (user.lastDirection === 'up') {
            animKey = 'catch_fish_up';
        }
        
        user.anims.play(animKey, true);

        user.once('animationcomplete', () => {
            user.isAttacking = false;
            user.removeAllListeners('animationcomplete');
            user.scene.objects.push(new Fish(user.scene, user.x, user.y));
        });
    }
}