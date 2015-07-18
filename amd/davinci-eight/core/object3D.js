define(["require", "exports", '../math/Vector3', '../math/Spinor3'], function (require, exports, Vector3, Spinor3) {
    /**
     * @return {Node3D} The constructed object.
     */
    var object3D = function () {
        var position = new Vector3();
        var attitude = new Spinor3();
        var scale = new Vector3({ x: 1, y: 1, z: 1 });
        var parent = null;
        var children = [];
        var publicAPI = {
            get position() {
                return position;
            },
            set position(value) {
                position = value;
            },
            get attitude() {
                return attitude;
            },
            set attitude(value) {
                attitude = value;
            },
            get scale() {
                return scale;
            },
            set scale(value) {
                scale = value;
            },
            get parent() {
                return parent;
            },
            get children() {
                return children;
            },
            translateOnAxis: function (axis, distance) {
                throw new Error('Not Implemented');
                return publicAPI;
            }
        };
        return publicAPI;
    };
    return object3D;
});
