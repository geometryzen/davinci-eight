var PrimitiveMode = (function () {
    function PrimitiveMode() {
    }
    PrimitiveMode.POINTS = 1;
    PrimitiveMode.LINES = 2;
    PrimitiveMode.LINE_STRIP = 3;
    PrimitiveMode.LINE_LOOP = 4;
    PrimitiveMode.TRIANGLES = 5;
    return PrimitiveMode;
})();
module.exports = PrimitiveMode;
