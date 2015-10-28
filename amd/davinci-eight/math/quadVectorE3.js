define(["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE3, isDefined, isNumber) {
    function quadVectorE3(vector) {
        if (isDefined(vector)) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            if (isNumber(x) && isNumber(y) && isNumber(z)) {
                return dotVectorCartesianE3(x, y, z, x, y, z);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    return quadVectorE3;
});
