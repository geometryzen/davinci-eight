define(["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined_1, isNumber_1) {
    function quadSpinorE2(s) {
        if (isDefined_1.default(s)) {
            var α = s.α;
            var xy = s.xy;
            if (isNumber_1.default(α) && isNumber_1.default(xy)) {
                return α * α + xy * xy;
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
    exports.default = quadSpinorE2;
});
