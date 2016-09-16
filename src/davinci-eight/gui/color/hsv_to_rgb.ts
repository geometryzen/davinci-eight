export default function hsv_to_rgb(h: number, s: number, v: number): { r: number; g: number; b: number } {

    const hi = Math.floor(h / 60) % 6;

    const f = h / 60 - Math.floor(h / 60);
    const p = v * (1.0 - s);
    const q = v * (1.0 - (f * s));
    const t = v * (1.0 - ((1.0 - f) * s));
    const c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
    ][hi];

    return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
    };
}
