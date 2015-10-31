define(["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined, isNumber) {
    function quadSpinorE3(s) {
        if (isDefined(s)) {
            var α = s.α;
            var x = s.yz;
            var y = s.zx;
            var z = s.xy;
            if (isNumber(α) && isNumber(x) && isNumber(y) && isNumber(z)) {
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
    return quadSpinorE3;
});
