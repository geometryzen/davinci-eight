define(["require", "exports", '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/mustBeNumber', '../math/SpinG3m', '../math/R3m'], function (require, exports, mustBeDefined_1, mustBeInteger_1, mustBeNumber_1, SpinG3m_1, R3m_1) {
    function arc3(begin, angle, generator, segments) {
        mustBeDefined_1.default('begin', begin);
        mustBeNumber_1.default('angle', angle);
        mustBeDefined_1.default('generator', generator);
        mustBeInteger_1.default('segments', segments);
        var points = [];
        var point = R3m_1.default.copy(begin);
        var rotor = SpinG3m_1.default.copy(generator).scale((-angle / 2) / segments).exp();
        points.push(point.clone());
        for (var i = 0; i < segments; i++) {
            point.rotate(rotor);
            points.push(point.clone());
        }
        return points;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = arc3;
});
