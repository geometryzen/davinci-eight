define(["require", "exports", '../math/dotVectorCartesianE2', '../checks/isDefined', '../checks/isNumber'], function (require, exports, dotVectorCartesianE2_1, isDefined_1, isNumber_1) {
    function quadVectorE2(vector) {
        if (isDefined_1.default(vector)) {
            var x = vector.x;
            var y = vector.y;
            if (isNumber_1.default(x) && isNumber_1.default(y)) {
                return dotVectorCartesianE2_1.default(x, y, x, y);
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
    exports.default = quadVectorE2;
});
