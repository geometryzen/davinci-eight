define(["require", "exports", '../core/convertUsage'], function (require, exports, convertUsage) {
    /**
     * Manages the (optional) WebGLBuffer used to support gl.drawElements().
     * @class ElementArray
     */
    var ElementArray = (function () {
        /**
         * @class ElementArray
         * @constructor
         * @param attributes {AttributeProvider}
         */
        function ElementArray(attributes) {
            this.attributes = attributes;
        }
        /**
         * @method contextFree
         */
        ElementArray.prototype.contextFree = function () {
            if (this.buffer) {
                this.context.deleteBuffer(this.buffer);
                this.buffer = void 0;
            }
            this.context = void 0;
        };
        /**
         * @method contextGain
         * @param context {WebGLRenderingContext}
         */
        ElementArray.prototype.contextGain = function (context, contextId) {
            if (this.attributes.hasElements()) {
                this.buffer = context.createBuffer();
            }
            this.context = context;
        };
        /**
         * @method contextLoss
         */
        ElementArray.prototype.contextLoss = function () {
            this.buffer = void 0;
            this.context = void 0;
        };
        /**
         * @method bufferData
         * @param attributes {AttributeProvider}
         */
        ElementArray.prototype.bufferData = function (attributes) {
            if (this.buffer) {
                var elements = attributes.getElements();
                this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
                var usage = convertUsage(elements.usage, this.context);
                this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, elements.data, usage);
            }
        };
        /**
         * @method bind
         */
        ElementArray.prototype.bind = function () {
            if (this.buffer) {
                this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.buffer);
            }
        };
        return ElementArray;
    })();
    return ElementArray;
});
