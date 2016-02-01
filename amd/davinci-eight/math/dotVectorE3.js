define(["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined'], function (require, exports, dotVectorCartesianE3_1, isDefined_1) {
    function dotVectorE3(a, b) {
        if (isDefined_1.default(a) && isDefined_1.default(b)) {
            return dotVectorCartesianE3_1.default(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorE3;
});
