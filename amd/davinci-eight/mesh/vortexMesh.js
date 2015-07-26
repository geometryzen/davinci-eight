define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/VortexGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, VortexGeometry, adapterOptions, checkMeshArgs) {
    function vortexGeometry(options) {
        return new VortexGeometry();
    }
    function vortexMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(vortexGeometry(checkedOptions), adapterOptions(checkedOptions));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getVertexAttributeData: function (name) {
                return base.getVertexAttributeData(name);
            },
            getAttributeMetaInfos: function () {
                return base.getAttributeMetaInfos();
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
            hasElements: function () {
                return base.hasElements();
            },
            getElements: function () {
                return base.getElements();
            }
        };
        return publicAPI;
    }
    return vortexMesh;
});
