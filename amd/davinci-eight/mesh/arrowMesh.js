define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/ArrowGeometry', '../mesh/adapterOptions', '../math/Spinor3'], function (require, exports, GeometryAdapter, ArrowGeometry, adapterOptions, Spinor3) {
    function arrowGeometry(options) {
        options = options || {};
        var scale = 1;
        var attitude = new Spinor3();
        var segments = 12;
        var length = 1;
        var radiusShaft = 0.01;
        var radiusCone = 0.08;
        return new ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, options.coneHeight, options.axis);
    }
    function arrowMesh(options) {
        var base = new GeometryAdapter(arrowGeometry(options), adapterOptions(options));
        var refCount = 0;
        var publicAPI = {
            draw: function () {
                return base.draw();
            },
            update: function () {
                return base.update();
            },
            getAttribData: function () {
                return base.getAttribData();
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
            addRef: function () {
                refCount++;
            },
            release: function () {
                refCount--;
                if (refCount === 0) {
                    base.release();
                }
            },
            contextFree: function () {
                return base.contextFree();
            },
            contextGain: function (context) {
                return base.contextGain(context);
            },
            contextLoss: function () {
                return base.contextLoss();
            }
        };
        return publicAPI;
    }
    return arrowMesh;
});
