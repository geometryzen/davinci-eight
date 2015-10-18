define(["require", "exports", '../checks/mustBeInteger'], function (require, exports, mustBeInteger) {
    /**
     * @class GeometryElements
     */
    var GeometryElements = (function () {
        /**
         * @class GeometryElements
         * @constructor
         * @param mode {DrawMode} <p>The geometric primitive type.</p>
         * @param indices {number[]} <p>A list of index into the attributes</p>
         * @param attributes {{[name:string]: GeometryAttribute}}
         */
        function GeometryElements(mode, indices, attributes) {
            // TODO: Looks like a DrawAttributeMap here (implementation only)
            /**
             * @property attributes
             * @type {{[name:string]: GeometryAttribute}}
             */
            this.attributes = {};
            mustBeInteger('mode', mode);
            this.mode = mode;
            this.indices = indices;
            this.attributes = attributes;
        }
        return GeometryElements;
    })();
    return GeometryElements;
});
