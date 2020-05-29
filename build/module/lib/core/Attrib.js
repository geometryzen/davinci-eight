import { readOnly } from '../i18n/readOnly';
/**
 * An object-oriented representation of an <code>attribute</code> in a GLSL shader program.
 */
var Attrib = /** @class */ (function () {
    /**
     *
     */
    function Attrib(contextManager, info) {
        /**
         *
         */
        this.suppressWarnings = true;
        this._name = info.name;
    }
    Object.defineProperty(Attrib.prototype, "index", {
        /**
         * Returns the cached index obtained by calling <code>getAttribLocation</code> on the
         * <code>WebGLRenderingContext</code>.
         */
        get: function () {
            return this._index;
        },
        set: function (unused) {
            throw new Error(readOnly('index').message);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Notifies this <code>Attrib</code> of a browser free WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    Attrib.prototype.contextFree = function () {
        // Nothing to deallocate. Just reflect notification in state variables.
        // This is coincidentally the same as contextLost, but not appropriate for DRY.
        this._index = void 0;
        this._gl = void 0;
    };
    /**
     * Notifies this <code>Attrib</code> of a browser gain WebGL context event.
     * This <code>Attrib</code> responds by obtaining and caching attribute index.
     *
     * @param context
     * @param program
     */
    Attrib.prototype.contextGain = function (context, program) {
        this._index = context.getAttribLocation(program, this._name);
        this._gl = context;
    };
    /**
     * Notifies this <code>Attrib</code> of a browser lost WebGL context event.
     * This <code>Attrib</code> responds by setting its cached index and context to undefined.
     */
    Attrib.prototype.contextLost = function () {
        this._index = void 0;
        this._gl = void 0;
    };
    /**
     * Specifies the data formats and locations of vertex attributes in a vertex attributes array.
     * Calls the <code>vertexAttribPointer</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index and the supplied parameters.
     * Note that the <code>type</code> parameter is hard-code to <code>FLOAT</code>.
     *
     * @param size The number of components per attribute. Must be 1, 2, 3, or 4.
     * @param type The data type of each component in the array.
     * @param normalized Specifies whether fixed-point data values should be normalized (true), or are converted to fixed point vales (false) when accessed.
     * @param stride The distance in bytes between the beginning of consecutive vertex attributes.
     * @param offset The offset in bytes of the first component in the vertex attribute array. Must be a multiple of type.
     */
    Attrib.prototype.config = function (size, type, normalized, stride, offset) {
        if (normalized === void 0) { normalized = false; }
        if (stride === void 0) { stride = 0; }
        if (offset === void 0) { offset = 0; }
        // TODO: Notice that when this function is called, the cached index is used.
        // This suggests that we should used the cached indices to to look up attributes
        // when we are in the animation loop.
        if (this._gl) {
            this._gl.vertexAttribPointer(this._index, size, type, normalized, stride, offset);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("vertexAttribPointer(index = " + this._index + ", size = " + size + ", type = " + type + ", normalized = " + normalized + ", stride = " + stride + ", offset = " + offset + ")");
            }
        }
    };
    /**
     * Calls the <code>enableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    Attrib.prototype.enable = function () {
        if (this._gl) {
            this._gl.enableVertexAttribArray(this._index);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("enableVertexAttribArray(index = " + this._index + ")");
            }
        }
    };
    /**
     * Calls the <code>disableVertexAttribArray</code> method
     * on the underlying <code>WebGLRenderingContext</code>
     * using the cached attribute index.
     */
    Attrib.prototype.disable = function () {
        if (this._gl) {
            this._gl.disableVertexAttribArray(this._index);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("disableVertexAttribArray(index = " + this._index + ")");
            }
        }
    };
    /**
     * Returns the address of the specified vertex attribute.
     * Experimental.
     */
    Attrib.prototype.getOffset = function () {
        if (this._gl) {
            // The API docs don't permit the pname attribute to be anything other than VERTEX_ATTRIB_ARRAY_POINTER.
            return this._gl.getVertexAttribOffset(this._index, this._gl.VERTEX_ATTRIB_ARRAY_POINTER);
        }
        else {
            if (!this.suppressWarnings) {
                console.warn("getVertexAttribOffset(index = " + this._index + ", VERTEX_ATTRIB_ARRAY_POINTER)");
            }
            return void 0;
        }
    };
    /**
     * Returns a non-normative string representation of the GLSL attribute.
     */
    Attrib.prototype.toString = function () {
        return ['attribute', this._name].join(' ');
    };
    return Attrib;
}());
export { Attrib };
