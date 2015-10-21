define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    function euclidean3Quaditude1Arg(vector) {
        if (isDefined(vector)) {
            var x = vector.x;
            var y = vector.y;
            var z = vector.z;
            return x * x + y * y + z * z;
        }
        else {
            return void 0;
        }
    }
    return euclidean3Quaditude1Arg;
});
