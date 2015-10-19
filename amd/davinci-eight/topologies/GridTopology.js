var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/DrawMode', '../checks/isDefined', '../topologies/MeshTopology', '../checks/mustBeArray', '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, DrawMode, isDefined, MeshTopology, mustBeArray, mustBeInteger, readOnly) {
    function numPostsForFence(segmentCount) {
        mustBeInteger('segmentCount', segmentCount);
        return segmentCount + 1;
    }
    function dimensionsForGrid(segmentCounts) {
        mustBeArray('segmentCounts', segmentCounts);
        return segmentCounts.map(numPostsForFence);
    }
    function numVerticesForGrid(uSegments, vSegments) {
        mustBeInteger('uSegments', uSegments);
        mustBeInteger('vSegments', vSegments);
        return dimensionsForGrid([uSegments, vSegments]).reduce(function (a, b) { return a * b; }, 1);
    }
    function triangleStripForGrid(uSegments, vSegments, elements) {
        // Make sure that we have somewhere valid to store the result.
        elements = isDefined(elements) ? mustBeArray('elements', elements) : [];
        var uLength = numPostsForFence(uSegments);
        var lastVertex = uSegments + uLength * vSegments;
        /**
         * The number of elements needed if we executed a strip per row.
         * Remark Notice the asymmetry. Could be a performance impact.
         */
        var eSimple = 2 * uLength * vSegments;
        /**
         * Index for triangle strip array.
         */
        var j = 0;
        // FIXME: Loop 0 <= i < eSimple (Edsger W. Dijksta)
        // For this algorithm, imagine a little vertical loop containing two dots.
        // The uppermost dot we shall call the `top` and the lowermost the `bottom`.
        // Advancing i by two each time corresponds to advancing this loop one place to the right.
        for (var i = 1; i <= eSimple; i += 2) {
            var k = (i - 1) / 2; // etc
            // top element
            elements[j] = (i - 1) / 2;
            // bottom element
            elements[j + 1] = elements[j] + uLength;
            // check for end of column
            if (elements[j + 1] % uLength === uSegments) {
                // Don't add degenerate triangles if we are on either
                // 1. the last vertex of the first row
                // 2. the last vertex of the last row.
                if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
                    // additional vertex degenerate triangle
                    // The next point is the same as the one before
                    elements[j + 2] = elements[j + 1];
                    // additional vertex degenerate triangle
                    // 
                    elements[j + 3] = (1 + i) / 2;
                    // Increment j for the two duplicate vertices
                    j += 2;
                }
            }
            // Increment j for this step.
            j += 2;
        }
        return elements;
    }
    /**
     * @class GridTopology
     * @extends MeshTopology
     */
    var GridTopology = (function (_super) {
        __extends(GridTopology, _super);
        function GridTopology(uSegments, vSegments) {
            _super.call(this, DrawMode.TRIANGLE_STRIP, numVerticesForGrid(uSegments, vSegments));
            this.elements = triangleStripForGrid(uSegments, vSegments);
            this._uSegments = uSegments;
            this._vSegments = vSegments;
        }
        Object.defineProperty(GridTopology.prototype, "uSegments", {
            get: function () {
                return this._uSegments;
            },
            set: function (unused) {
                throw new Error(readOnly('uSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "uLength", {
            get: function () {
                return numPostsForFence(this._uSegments);
            },
            set: function (unused) {
                throw new Error(readOnly('uLength').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vSegments", {
            get: function () {
                return this._vSegments;
            },
            set: function (unused) {
                throw new Error(readOnly('vSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vLength", {
            get: function () {
                return numPostsForFence(this._vSegments);
            },
            set: function (unused) {
                throw new Error(readOnly('vLength').message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * <p>
         * Provides access to each vertex so that attributes may be set.
         * The indices
         * </p>
         * @method vertex
         * @param uIndex {number} The zero-based `horizontal` index.
         * @param vIndex {number} The zero-based 'vertical` index.
         * @return {Vertex} The vertex corresponding to the specified coordinates.
         * @example
             var topo = new EIGHT.GridTopology(1, 1)
             topo.vertex(uIndex, vIndex).attributes('aPosition') = new Vector3([i - 0.5, j - 0.5, 0])
         */
        GridTopology.prototype.vertex = function (uIndex, vIndex) {
            mustBeInteger('uIndex', uIndex);
            mustBeInteger('vIndex', vIndex);
            return this.vertices[(this._vSegments - vIndex) * this.uLength + uIndex];
        };
        return GridTopology;
    })(MeshTopology);
    return GridTopology;
});
