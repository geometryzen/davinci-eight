define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function euclidean3Quaditude1Arg2Arg(a, b) {
        if (isDefined(a) && isDefined(b)) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        else {
            return void 0;
        }
    }
    return euclidean3Quaditude1Arg2Arg;
});
