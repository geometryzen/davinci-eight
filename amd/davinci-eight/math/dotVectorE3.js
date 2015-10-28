define(["require", "exports", '../math/dotVectorCartesianE3', '../checks/isDefined'], function (require, exports, dotVectorCartesianE3, isDefined) {
    function dotVectorE3(a, b) {
        if (isDefined(a) && isDefined(b)) {
            return dotVectorCartesianE3(a.x, a.y, a.z, b.x, b.y, b.z);
        }
        else {
            return void 0;
        }
    }
    return dotVectorE3;
});
