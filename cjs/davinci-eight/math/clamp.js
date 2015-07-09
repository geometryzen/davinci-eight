function clamp(x, a, b) {
    return (x < a) ? a : ((x > b) ? b : x);
}
module.exports = clamp;
