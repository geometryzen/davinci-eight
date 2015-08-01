define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/CylinderGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, CylinderGeometry, adapterOptions, checkMeshArgs) {
    function sphereGeometry(options) {
        return new CylinderGeometry();
    }
    function cylinderMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(sphereGeometry(checkedOptions), adapterOptions(checkedOptions));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getAttribArray: function (name) {
                return base.getAttribArray(name);
            },
            getAttribMeta: function () {
                return base.getAttribMeta();
            },
            get drawMode() {
                return base.drawMode;
            },
            set drawMode(value) {
                base.drawMode = value;
            },
            get dynamic() {
                return base.dynamic;
            },
            hasElementArray: function () {
                return base.hasElementArray();
            },
            getElementArray: function () {
                return base.getElementArray();
            }
        };
        return publicAPI;
    }
    return cylinderMesh;
});
