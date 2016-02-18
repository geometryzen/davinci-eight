define(["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined_1, isNumber_1) {
    function quadSpinorE2(s) {
        if (isDefined_1.default(s)) {
            var α = s.α;
            var β = s.β;
            if (isNumber_1.default(α) && isNumber_1.default(β)) {
                return α * α + β * β;
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
