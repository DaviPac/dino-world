export default class Axe {
    constructor() {
        this.icon = { key: 'basic-tools-icons', frame: 57 };
    }

    use(user) {
        if (user.swingAxe) user.swingAxe();
    }
}