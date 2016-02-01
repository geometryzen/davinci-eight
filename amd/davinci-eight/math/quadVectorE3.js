define(["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE3_1, isDefined_1, isNumber_1) {
    function quadVectorE3(vector) {
        if (isDefined_1.default(vector)) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            if (isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
                return dotVectorCartesianE3_1.default(x, y, z, x, y, z);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadVectorE3;
});
