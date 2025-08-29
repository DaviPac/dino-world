function getRect(o) {
    if (o.body && o.body.width != null) {
        const left = o.body.x;
        const top = o.body.y;
        const width = o.body.width;
        const height = o.body.height;
        return {
            left,
            right: left + width,
            top,
            bottom: top + height,
            cx: left + width / 2,
            cy: top + height / 2,
            width,
            height,
        };
    } else {
        const originX = o.originX ?? 0.5;
        const originY = o.originY ?? 0.5;
        const left = o.x - (o.width ?? 0) * originX;
        const top = o.y - (o.height ?? 0) * originY;
        const width = o.width ?? 0;
        const height = o.height ?? 0;
        return {
            left,
            right: left + width,
            top,
            bottom: top + height,
            cx: left + width / 2,
            cy: top + height / 2,
            width,
            height,
        };
    }
}

function overlap1D(a1, a2, b1, b2) {
    return a1 < b2 && a2 > b1;
}

function intersectRect(a, b) {
    return overlap1D(a.left, a.right, b.left, b.right) && 
           overlap1D(a.top, a.bottom, b.top, b.bottom);
}

export function isInCuttingRange(src, target, threshold = 10) {
    const A = getRect(src);
    const B = getRect(target);

    const dx = B.cx - A.cx;
    const dy = B.cy - A.cy;
    
    // Verifica se há sobreposição total (já se tocam)
    if (intersectRect(A, B)) {
        return true;
    }

    // Define a área de corte baseada na direção que o src está facing
    let cuttingArea;
    
    switch (src.facing) {
        case "up":
            cuttingArea = {
                left: A.left - threshold/2,
                right: A.right + threshold/2,
                top: A.top - threshold,
                bottom: A.top,
                width: A.width + threshold,
                height: threshold
            };
            break;
            
        case "down":
            cuttingArea = {
                left: A.left - threshold/2,
                right: A.right + threshold/2,
                top: A.bottom,
                bottom: A.bottom + threshold,
                width: A.width + threshold,
                height: threshold
            };
            break;
            
        case "left":
            cuttingArea = {
                left: A.left - threshold,
                right: A.left,
                top: A.top - threshold/2,
                bottom: A.bottom + threshold/2,
                width: threshold,
                height: A.height + threshold
            };
            break;
            
        case "right":
            cuttingArea = {
                left: A.right,
                right: A.right + threshold,
                top: A.top - threshold/2,
                bottom: A.bottom + threshold/2,
                width: threshold,
                height: A.height + threshold
            };
            break;
            
        default:
            return false;
    }
    
    // Verifica se o target intersecta com a área de corte
    return intersectRect(cuttingArea, B);
}

export function isInRightFenceRange(src, target, threshold = 15) {
    let yDiff = Math.abs(src.y - target.y);
    let xDiff = target.x - src.x;
    return yDiff <= 5 && xDiff >= -2 && xDiff <= threshold;
}

export function isInLeftFenceRange(src, target, threshold = 15) {
    let yDiff = Math.abs(src.y - target.y);
    let xDiff = src.x - target.x;
    return yDiff <= 5 && xDiff >= -2 && xDiff <= threshold;
}

export function isInTopFenceRange(src, target, threshold = 15) {
    let xDiff = Math.abs(src.x - target.x);
    let yDiff = src.y - target.y;
    return xDiff <= 5 && yDiff >= -2 && yDiff <= threshold;
}

export function isInBottomFenceRange(src, target, threshold = 15) {
    let xDiff = Math.abs(src.x - target.x);
    let yDiff = target.y - src.y;
    return xDiff <= 5 && yDiff >= -2 && yDiff <= threshold;
}