define(["require", "exports"], function (require, exports) {
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    function gcompE3(m, index) {
        switch (index) {
            case COORD_W:
                {
                    return m.α;
                }
                break;
            case COORD_X:
                {
                    return m.x;
                }
                break;
            case COORD_Y:
                {
                    return m.y;
                }
                break;
            case COORD_Z:
                {
                    return m.z;
                }
                break;
            case COORD_XY:
                {
                    return m.xy;
                }
                break;
            case COORD_YZ:
                {
                    return m.yz;
                }
                break;
            case COORD_ZX:
                {
                    return m.zx;
                }
                break;
            case COORD_XYZ:
                {
                    return m.β;
                }
                break;
            default: {
                throw new Error("index => " + index);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gcompE3;
});
