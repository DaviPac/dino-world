import Item from "./Item.js";

export default class Axe extends Item{
    constructor() {
        super('basic-tools-icons', 57);
    }

    use(user) {
        user.isAttacking = true;
        user.setVelocity(0);

        let animKey = 'axe_down';
        if (user.lastDirection === 'left' || user.lastDirection === 'right') {
            animKey = 'axe_side';
        } else if (user.lastDirection === 'up') {
            animKey = 'axe_up';
        }
        
        user.anims.play(animKey, true);

        user.removeAllListeners('animationupdate');

        user.on('animationupdate', (anim, frame) => {
            if (frame.index === 3) {
                user.axeHit = true;
            }
        }, user);

        user.once('animationcomplete', () => {
            user.isAttacking = false;
            user.axeHit = false;
            user.removeAllListeners('animationupdate');
        });
    }
}