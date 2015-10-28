define(["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined, isNumber) {
    function quadSpinorE2(s) {
        if (isDefined(s)) {
            var α = s.α;
            var β = s.β;
            if (isNumber(α) && isNumber(β)) {
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
    return quadSpinorE2;
});
