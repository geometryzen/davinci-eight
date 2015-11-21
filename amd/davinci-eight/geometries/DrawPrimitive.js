define(["require", "exports", '../checks/mustBeArray', '../checks/mustBeInteger', '../checks/mustBeObject'], function (require, exports, mustBeArray, mustBeInteger, mustBeObject) {
    /**
     * @class DrawPrimitive
     */
    var DrawPrimitive = (function () {
        /**
         * A tuple representing the information required to describe a single WebGL primitive.
         * @class DrawPrimitive
         * @constructor
         * @param mode {DrawMode} <p>The primitive type.</p>
         * @param indices {number[]} <p>A list of index into the attributes</p>
         * @param attributes {{[name:string]: DrawAttribute}}
         */
        function DrawPrimitive(mode, indices, attributes) {
            // TODO: Looks like a DrawAttributeMap here (implementation only)
            /**
             * A map from attribute name to <code>DrawAttribute</code>.
             * @property attributes
             * @type {{[name:string]: DrawAttribute}}
             */
            this.attributes = {};
            this.mode = mustBeInteger('mode', mode);
            this.indices = mustBeArray('indices', indices);
            this.attributes = mustBeObject('attributes', attributes);
        }
        return DrawPrimitive;
    })();
    return DrawPrimitive;
});
