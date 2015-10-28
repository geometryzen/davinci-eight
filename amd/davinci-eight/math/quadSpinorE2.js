define(["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined, isNumber) {
    function quadSpinorE2(s) {
        if (isDefined(s)) {
            var s0 = s.w;
            var s1 = s.xy;
            if (isNumber(s0) && isNumber(s1)) {
                return s0 * s0 + s1 * s1;
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
