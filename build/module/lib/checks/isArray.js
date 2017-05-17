export function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
}
