define(["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined_1, isNumber_1) {
    function quadSpinorE3(s) {
        if (isDefined_1.default(s)) {
            var α = s.α;
            var x = s.yz;
            var y = s.zx;
            var z = s.xy;
            if (isNumber_1.default(α) && isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
                return α * α + x * x + y * y + z * z;
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
    exports.default = quadSpinorE3;
});
