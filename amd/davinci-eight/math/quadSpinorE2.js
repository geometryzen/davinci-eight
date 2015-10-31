define(["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined, isNumber) {
    function quadSpinorE2(s) {
        if (isDefined(s)) {
            var α = s.α;
            var xy = s.xy;
            if (isNumber(α) && isNumber(xy)) {
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
    return quadSpinorE2;
});
