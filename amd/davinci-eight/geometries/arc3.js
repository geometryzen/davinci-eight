define(["require", "exports", '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/Spinor3', '../math/Vector3'], function (require, exports, mustBeDefined, mustBeInteger, mustBeNumber, Spinor3, Vector3) {
    /**
     * Computes a list of points corresponding to an arc centered on the origin.
     * param begin {Cartesian3} The begin position.
     * param angle: {number} The angle of the rotation.
     * param generator {Spinor3Coords} The generator of the rotation.
     * param segments {number} The number of segments.
     */
    function arc3(begin, angle, generator, segments) {
        mustBeDefined('begin', begin);
        mustBeNumber('angle', angle);
        mustBeDefined('generator', generator);
        mustBeInteger('segments', segments);
        /**
         * The return value is an array of points with length => segments + 1.
         */
        var points = [];
        /**
         * Temporary point that we will advance for each segment.
         */
        var point = Vector3.copy(begin);
        /**
         * The rotor that advances us through one segment.
         */
        var rotor = Spinor3.copy(generator).scale((-angle / 2) / segments).exp();
        points.push(point.clone());
        for (var i = 0; i < segments; i++) {
            point.rotate(rotor);
            points.push(point.clone());
        }
        return points;
    }
    return arc3;
});
