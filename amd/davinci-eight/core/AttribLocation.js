define(["require", "exports", '../checks/mustBeObject', '../checks/mustBeString', '../i18n/readOnly'], function (require, exports, mustBeObject, mustBeString, readOnly) {
    /**
     * @class AttribLocation
     */
    var AttribLocation = (function () {
        /**
         * Utility class for managing a shader attribute variable.
         * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
         * In particular, this class manages buffer allocation, location caching, and data binding.
         * While this class may be created directly by the user, it is preferable
         * to use the AttribLocation instances managed by the Program because
         * there will be improved integrity and context loss management.
         * @class AttribLocation
         * @constructor
         * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
         * @param name {string} The name of the variable as it appears in the GLSL program.
         */
        function AttribLocation(manager, name) {
            mustBeObject('manager', manager);
            this._name = mustBeString('name', name);
        }
        Object.defineProperty(AttribLocation.prototype, "index", {
            /**
             * Returns the cached index obtained by calling <code>getAttribLocation</code> on the
             * <code>WebGLRenderingContext</code>.
             * @property index
             * @type {number}
             * @readOnly
             */
            get: function () {
                return this._index;
            },
            set: function (unused) {
                throw new Error(readOnly('index').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Notifies this <code>AttribLocation</code> of a browser free WebGL context event.
         * This <code>AttribLocation</code> responds by setting its cached index and context to undefined.
         * @method contextFree
         * @return {void}
         */
        AttribLocation.prototype.contextFree = function () {
            // Nothing to deallocate. Just reflect notification in state variables.
            // This is coincidentally the same as contextLost, but not appropriate for DRY.
            this._index = void 0;
            this._context = void 0;
        };
        /**
         * Notifies this <code>AttribLocation</code> of a browser gain WebGL context event.
         * This <code>AttribLocation</code> responds by obtaining and caching attribute index.
         * @method contextGain
         * @param context {WebGLRenderingContext}
         * @param program {WebGLProgram}
         * @return {void}
         */
        AttribLocation.prototype.contextGain = function (context, program) {
            this._index = context.getAttribLocation(program, this._name);
            this._context = context;
        };
        /**
         * Notifies this <code>AttribLocation</code> of a browser lost WebGL context event.
         * This <code>AttribLocation</code> responds by setting its cached index and context to undefined.
         * @method contextLost
         * @return {void}
         */
        AttribLocation.prototype.contextLost = function () {
            this._index = void 0;
            this._context = void 0;
        };
        /**
         * Calls the <code>vertexAttribPointer</code> method
         * on the underlying <code>WebGLRenderingContext</code>
         * using the cached attribute index and the supplied parameters.
         * Note that the <code>type</code> parameter is hard-code to <code>FLOAT</code>.
         * @method vertexPointer
         * @param size {number} The number of components per attribute. Must be 1, 2, 3, or 4.
         * @param [normalized = false] {boolean} Used for WebGL rendering context vertexAttribPointer method.
         * @param [stride = 0] {number} Used for WebGL rendering context vertexAttribPointer method.
         * @param [offset = 0] {number} Used for WebGL rendering context vertexAttribPointer method.
         * @return {void}
         */
        AttribLocation.prototype.vertexPointer = function (size, normalized, stride, offset) {
            if (normalized === void 0) { normalized = false; }
            if (stride === void 0) { stride = 0; }
            if (offset === void 0) { offset = 0; }
            this._context.vertexAttribPointer(this._index, size, this._context.FLOAT, normalized, stride, offset);
        };
        /**
         * Calls the <code>enableVertexAttribArray</code> method
         * on the underlying <code>WebGLRenderingContext</code>
         * using the cached attribute index.
         * @method enable
         * @return {void}
         */
        AttribLocation.prototype.enable = function () {
            this._context.enableVertexAttribArray(this._index);
        };
        /**
         * Calls the <code>disableVertexAttribArray</code> method
         * on the underlying <code>WebGLRenderingContext</code>
         * using the cached attribute index.
         * @method disable
         * @return {void}
         */
        AttribLocation.prototype.disable = function () {
            this._context.disableVertexAttribArray(this._index);
        };
        /**
         * Returns a non-normative string representation of the GLSL attribute.
         * @method toString
         * @return {string}
         */
        AttribLocation.prototype.toString = function () {
            return ['attribute', this._name].join(' ');
        };
        return AttribLocation;
    })();
    return AttribLocation;
});
