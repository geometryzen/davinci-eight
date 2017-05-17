/**
 * The common low values for a Simplex.
 */
/**
 * The common low values for a Simplex.
 */ export var SimplexMode;
(function (SimplexMode) {
    SimplexMode[SimplexMode["EMPTY"] = -1] = "EMPTY";
    SimplexMode[SimplexMode["POINT"] = 0] = "POINT";
    SimplexMode[SimplexMode["LINE"] = 1] = "LINE";
    SimplexMode[SimplexMode["TRIANGLE"] = 2] = "TRIANGLE";
    SimplexMode[SimplexMode["TETRAHEDRON"] = 3] = "TETRAHEDRON";
    SimplexMode[SimplexMode["FIVE_CELL"] = 4] = "FIVE_CELL";
})(SimplexMode || (SimplexMode = {}));
