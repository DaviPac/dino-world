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
        // Fallback para objetos sem body (usa origin)
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
    // sobreposição estrita de intervalos [a1,a2) e [b1,b2)
    return a1 < b2 && a2 > b1;
}

function intersectXRect(a, b) {
    return overlap1D(a.left, a.right, b.left, b.right);
}

function intersectYRect(a, b) {
    return overlap1D(a.top, a.bottom, b.top, b.bottom);
}

export function isInCuttingRange(src, target, threshold = 20) {
    const A = getRect(src);
    const B = getRect(target);

    const dx = B.cx - A.cx;
    const dy = B.cy - A.cy;

    // Mesma coluna (projeção X se sobrepõe) -> checa para cima/baixo
    if (intersectXRect(A, B)) {
        if (dy > 0) return src.facing === "down" && dy < (threshold * 1.22);
        return src.facing === "up" && -dy < (threshold * 1.22);
    }

    // Mesma linha (projeção Y se sobrepõe) -> checa esquerda/direita
    if (intersectYRect(A, B)) {
        if (dx > 0) return src.facing === "right" && dx < threshold;
        return src.facing === "left" && -dx < threshold;
    }

    return false;
}