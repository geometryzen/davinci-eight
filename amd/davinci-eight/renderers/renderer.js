define(["require", "exports", '../collections/IUnknownArray', '../utils/refChange', '../utils/uuid4', '../commands/WebGLClearColor', '../commands/WebGLEnable', '../commands/WebGLDisable'], function (require, exports, IUnknownArray_1, refChange_1, uuid4_1, WebGLClearColor_1, WebGLEnable_1, WebGLDisable_1) {
    var CLASS_NAME = "CanonicalIContextRenderer";
    function renderer() {
        var _manager;
        var uuid = uuid4_1.default().generate();
        var refCount = 1;
        var commands = new IUnknownArray_1.default([]);
        var self = {
            addRef: function () {
                refCount++;
                refChange_1.default(uuid, CLASS_NAME, +1);
                return refCount;
            },
            get canvas() {
                return _manager ? _manager.canvas : void 0;
            },
            get commands() {
                return commands;
            },
            get gl() {
                return _manager ? _manager.gl : void 0;
            },
            clearColor: function (red, green, blue, alpha) {
                commands.pushWeakRef(new WebGLClearColor_1.default(red, green, blue, alpha));
            },
            contextFree: function (canvasId) {
                commands.forEach(function (command) {
                    command.contextFree(canvasId);
                });
                _manager = void 0;
            },
            contextGain: function (manager) {
                _manager = manager;
                commands.forEach(function (command) {
                    command.contextGain(manager);
                });
            },
            contextLost: function (canvasId) {
                commands.forEach(function (command) {
                    command.contextLost(canvasId);
                });
                _manager = void 0;
            },
            disable: function (capability) {
                commands.pushWeakRef(new WebGLDisable_1.default(capability));
            },
            enable: function (capability) {
                commands.pushWeakRef(new WebGLEnable_1.default(capability));
            },
            render: function (drawList, ambients) {
                var gl = _manager.gl;
                if (gl) {
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    return drawList.draw(ambients, _manager.canvasId);
                }
            },
            viewport: function (x, y, width, height) {
                return self.gl.viewport(x, y, width, height);
            },
            release: function () {
                refCount--;
                refChange_1.default(uuid, CLASS_NAME, -1);
                if (refCount === 0) {
                    commands.release();
                    commands = void 0;
                    return 0;
                }
                else {
                    return refCount;
                }
            }
        };
        refChange_1.default(uuid, CLASS_NAME, +1);
        return self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = renderer;
});
