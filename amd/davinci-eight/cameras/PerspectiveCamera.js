var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './Camera'], function (require, exports, Camera) {
    /**
     *
     */
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(fov, aspect, near, far) {
            if (fov === void 0) { fov = 75; }
            if (aspect === void 0) { aspect = 1; }
            if (near === void 0) { near = 0.1; }
            if (far === void 0) { far = 2000; }
            _super.call(this);
            this.projectionMatrix.makePerspective(fov, aspect, near, far);
        }
        return PerspectiveCamera;
    })(Camera);
    return PerspectiveCamera;
});
