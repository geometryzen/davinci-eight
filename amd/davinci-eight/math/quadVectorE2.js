define(["require", "exports", '../math/dotVectorCartesianE2', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE2, isDefined, isNumber) {
    function quadVectorE2(vector) {
        if (isDefined(vector)) {
            var x = vector.x;
            var y = vector.y;
            if (isNumber(x) && isNumber(y)) {
                return dotVectorCartesianE2(x, y, x, y);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    return quadVectorE2;
});
