export function approx(coords, n) {
    var max = 0;
    var iLen = coords.length;
    for (var i = 0; i < iLen; i++) {
        max = Math.max(max, Math.abs(coords[i]));
    }
    var threshold = max * Math.pow(10, -n);
    for (var i = 0; i < iLen; i++) {
        if (Math.abs(coords[i]) < threshold) {
            coords[i] = 0;
        }
    }
}
