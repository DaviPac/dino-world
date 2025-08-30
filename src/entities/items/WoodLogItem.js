import WoodFence from "../WoodFence.js";
import Item from "./Item.js";
import { isInRightFenceRange, isInLeftFenceRange, isInTopFenceRange, isInBottomFenceRange } from "../../utils/range.js"

export default class WoodLogItem extends Item {
    constructor() {
        super('basic-tools-icons', 0);
    }

    use(user) {
        let scene = user.scene;
        let x = user.x;
        let y = user.y;
        
        if (user.facing === 'up') {
            y -= 8;
        } else if (user.facing === 'down') {
            y += 16;
        } else if (user.facing === 'left') {
            x -= 16;
        } else {
            x += 16;
        }
        
        x = Math.round(x / 12) * 12;
        y = Math.round(y / 10) * 10;
        
        this.placeFence(scene, x, y);
    }

    placeFence(scene, x, y) {
        let existingFence = scene.objects.find(obj => 
            obj instanceof WoodFence && 
            Math.abs(obj.x - x) < 6 && 
            Math.abs(obj.y - y) < 5
        );
        
        if (existingFence) {
            return;
        }

        console.log("placing fence at", x, y);

        let woodFence = new WoodFence(scene, x, y);
        
        scene.objects.push(woodFence);
        
        let connections = this.findConnections(scene, woodFence);
        
        if (connections.length === 0) {
            woodFence.state = "alone";
        } else {
            this.updateFenceStates(scene, woodFence, connections);
        }
        
        woodFence.setDepth(woodFence.y - 2);
        let inventory = scene.player.inventory;
        let index = inventory.items.indexOf(this);
        if (index !== -1) inventory.items.splice(index, 1);
    }

    findConnections(scene, targetFence) {
        let connections = [];
        
        scene.objects.forEach(obj => {
            if (!(obj instanceof WoodFence) || obj === targetFence) return;
            
            let connection = null;
            
            // Tolerância reduzida para conexões mais precisas
            if (isInRightFenceRange(targetFence, obj, 13)) {
                connection = { fence: obj, direction: 'right', distance: Math.abs(targetFence.x - obj.x) };
            } else if (isInLeftFenceRange(targetFence, obj, 13)) {
                connection = { fence: obj, direction: 'left', distance: Math.abs(targetFence.x - obj.x) };
            } else if (isInTopFenceRange(targetFence, obj, 11)) {
                connection = { fence: obj, direction: 'top', distance: Math.abs(targetFence.y - obj.y) };
            } else if (isInBottomFenceRange(targetFence, obj, 11)) {
                connection = { fence: obj, direction: 'bottom', distance: Math.abs(targetFence.y - obj.y) };
            }
            
            if (connection) {
                connections.push(connection);
            }
        });
        
        return connections;
    }

    updateFenceStates(scene, newFence, connections) {
        this.updateSingleFenceState(scene, newFence);
        
        connections.forEach(connection => {
            this.updateSingleFenceState(scene, connection.fence);
        });
    }

    updateSingleFenceState(scene, fence) {
        let connections = this.findConnections(scene, fence);
        let horizontalConnections = connections.filter(c => c.direction === 'left' || c.direction === 'right');
        let verticalConnections = connections.filter(c => c.direction === 'top' || c.direction === 'bottom');
        
        this.setFenceState(fence, horizontalConnections, verticalConnections);
    }

    setFenceState(fence, horizontalConnections, verticalConnections) {
        let hasLeft = horizontalConnections.some(c => c.direction === 'left');
        let hasRight = horizontalConnections.some(c => c.direction === 'right');
        let hasTop = verticalConnections.some(c => c.direction === 'top');
        let hasBottom = verticalConnections.some(c => c.direction === 'bottom');
        
        
        if (hasLeft && hasRight && hasTop && hasBottom) {
            fence.state = "middle-middle";
        } else if (hasLeft && hasRight && hasTop) {
            fence.state = "middle-bottom";
        } else if (hasLeft && hasRight && hasBottom) {
            fence.state = "middle-top";
        } else if (hasTop && hasBottom && hasLeft) {
            fence.state = "middle-right";
        } else if (hasTop && hasBottom && hasRight) {
            fence.state = "middle-left";
        } else if (hasLeft && hasTop) {
            fence.state = "bottom-right";
        } else if (hasRight && hasTop) {
            fence.state = "bottom-left";
        } else if (hasLeft && hasBottom) {
            fence.state = "top-right";
        } else if (hasRight && hasBottom) {
            fence.state = "top-left";
        } else if (hasLeft && hasRight) {
            fence.state = "middle";
        } else if (hasTop && hasBottom) {
            fence.state = "side-middle";
        } else if (hasLeft) {
            fence.state = "right";
        } else if (hasRight) {
            fence.state = "left";
        } else if (hasTop) {
            fence.state = "side-bottom";
        } else if (hasBottom) {
            fence.state = "side-top";
        } else {
            fence.state = "alone";
        }
        
        console.log(`Final state: ${fence.state}`);
    }
}