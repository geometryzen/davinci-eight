define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/BoxGeometry', '../mesh/adapterOptions'], function (require, exports, GeometryAdapter, BoxGeometry, adapterOptions) {
    function boxGeometry(options) {
        options = options || {};
        return new BoxGeometry(options.width, options.height, options.depth, options.widthSegments, options.heightSegments, options.depthSegments, options.wireFrame);
    }
    function boxMesh(monitor, options) {
        var base = new GeometryAdapter(monitor, boxGeometry(options), adapterOptions(options));
        base.addRef();
        var refCount = 1;
        var self = {
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
                return refCount;
            },
            release: function () {
                refCount--;
                if (refCount === 0) {
                    base.release();
                    base = void 0;
                }
                return refCount;
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
        return self;
    }
    return boxMesh;
});
