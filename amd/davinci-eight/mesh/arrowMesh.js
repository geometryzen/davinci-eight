define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/ArrowGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, ArrowGeometry, adapterOptions, checkMeshArgs) {
    function arrowGeometry(options) {
        return new ArrowGeometry();
    }
    function arrowMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(arrowGeometry(checkedOptions), adapterOptions(checkedOptions));
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
            dynamics: function () {
                return base.dynamics();
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
    return arrowMesh;
});
