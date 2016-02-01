define(["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', '../i18n/readOnly'], function (require, exports, mustBeObject_1, mustBeString_1, readOnly_1) {
    var AttribLocation = (function () {
        function AttribLocation(manager, name) {
            mustBeObject_1.default('manager', manager);
            this._name = mustBeString_1.default('name', name);
        }
        Object.defineProperty(AttribLocation.prototype, "index", {
            get: function () {
                return this._index;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('index').message);
            },
            enumerable: true,
            configurable: true
        });
        AttribLocation.prototype.contextFree = function () {
            this._index = void 0;
            this._context = void 0;
        };
        AttribLocation.prototype.contextGain = function (context, program) {
            this._index = context.getAttribLocation(program, this._name);
            this._context = context;
        };
        AttribLocation.prototype.contextLost = function () {
            this._index = void 0;
            this._context = void 0;
        };
        AttribLocation.prototype.vertexPointer = function (size, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this._context.vertexAttribPointer(this._index, size, this._context.FLOAT, normalized, stride, offset);
        };
        AttribLocation.prototype.enable = function () {
            this._context.enableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.disable = function () {
            this._context.disableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.toString = function () {
            return ['attribute', this._name].join(' ');
        };
        return AttribLocation;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AttribLocation;
});
