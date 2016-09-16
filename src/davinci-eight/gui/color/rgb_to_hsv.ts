export default function rgb_to_hsv(r: number, g: number, b: number): { h: number; s: number; v: number } {

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h: number;
    let s: number;

    if (max !== 0) {
        s = delta / max;
    } else {
        return {
            h: NaN,
            s: 0,
            v: 0
        };
    }

    if (r === max) {
        h = (g - b) / delta;
    } else if (g === max) {
        h = 2 + (b - r) / delta;
    } else {
        h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
        h += 1;
    }

    return {
        h: h * 360,
        s: s,
        v: max / 255
    };
}
