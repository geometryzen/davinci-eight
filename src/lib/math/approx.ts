export function approx(coords: number[], n: number): void {
    let max = 0;
    const iLen = coords.length;
    for (let i = 0; i < iLen; i++) {
        max = Math.max(max, Math.abs(coords[i]));
    }
    const threshold = max * Math.pow(10, -n);
    for (let i = 0; i < iLen; i++) {
        if (Math.abs(coords[i]) < threshold) {
            coords[i] = 0;
        }
    }
}
