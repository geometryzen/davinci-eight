define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/BoxGeometry', '../mesh/adapterOptions', '../mesh/checkMeshArgs'], function (require, exports, GeometryAdapter, BoxGeometry, adapterOptions, checkMeshArgs) {
    function boxGeometry(options) {
        return new BoxGeometry(1, 1, 1);
    }
    function boxMesh(options) {
        var checkedOptions = checkMeshArgs(options);
        var base = new GeometryAdapter(boxGeometry(checkedOptions), adapterOptions(checkedOptions));
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
    return boxMesh;
});
