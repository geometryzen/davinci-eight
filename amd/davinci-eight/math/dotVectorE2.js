define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined_1) {
    function dotVectorE2(a, b) {
        if (isDefined_1.default(a) && isDefined_1.default(b)) {
            return a.x * b.x + a.y * b.y;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorE2;
});
