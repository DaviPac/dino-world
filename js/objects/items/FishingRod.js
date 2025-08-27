export default class FishingRod {
    constructor() {
        this.icon = { key: 'basic-tools-icons', frame: 12 };
    }

    use(user) {
        if (user.fish) user.fish();
    }
}