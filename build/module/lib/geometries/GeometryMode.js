/**
 * Determines how a Geometry will be rendered.
 */
export var GeometryMode;
(function (GeometryMode) {
    /**
     *
     */
    GeometryMode[GeometryMode["POINT"] = 0] = "POINT";
    /**
     *
     */
    GeometryMode[GeometryMode["WIRE"] = 1] = "WIRE";
    /**
     *
     */
    GeometryMode[GeometryMode["MESH"] = 2] = "MESH";
})(GeometryMode || (GeometryMode = {}));
