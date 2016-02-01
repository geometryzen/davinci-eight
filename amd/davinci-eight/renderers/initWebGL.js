define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined_1) {
    function initWebGL(canvas, attributes) {
        if (isDefined_1.default(canvas)) {
            var context;
            try {
                context = (canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
            }
            catch (e) {
            }
            if (context) {
                return context;
            }
            else {
                throw new Error("Unable to initialize WebGL. Your browser may not support it.");
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = initWebGL;
});
