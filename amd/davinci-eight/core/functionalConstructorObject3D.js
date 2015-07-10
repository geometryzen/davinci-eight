define(["require", "exports", '../core/Object3D'], function (require, exports, Object3D) {
    /**
     * @return {Object3D} The constructed object.
     */
    var functionalConstructorObject3D = function () {
        var inner = new Object3D();
        var publicAPI = {
            get position() {
                return inner.position;
            },
            set position(position) {
                inner.position = position;
            },
            get attitude() {
                return inner.attitude;
            },
            set attitude(attitude) {
                inner.attitude = attitude;
            },
            get parent() {
                return inner.parent;
            },
            get children() {
                return inner.children;
            },
            translateOnAxis: function (axis, distance) {
                inner.translateOnAxis(axis, distance);
                return publicAPI;
            }
        };
        return publicAPI;
    };
    return functionalConstructorObject3D;
});
