var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../core/DrawMode', '../checks/isDefined', '../topologies/MeshTopology', '../checks/mustBeArray', '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, DrawMode_1, isDefined_1, MeshTopology_1, mustBeArray_1, mustBeInteger_1, readOnly_1) {
    function numPostsForFence(segmentCount) {
        mustBeInteger_1.default('segmentCount', segmentCount);
        return segmentCount + 1;
    }
    function dimensionsForGrid(segmentCounts) {
        mustBeArray_1.default('segmentCounts', segmentCounts);
        return segmentCounts.map(numPostsForFence);
    }
    function numVerticesForGrid(uSegments, vSegments) {
        mustBeInteger_1.default('uSegments', uSegments);
        mustBeInteger_1.default('vSegments', vSegments);
        return dimensionsForGrid([uSegments, vSegments]).reduce(function (a, b) { return a * b; }, 1);
    }
    function triangleStripForGrid(uSegments, vSegments, elements) {
        elements = isDefined_1.default(elements) ? mustBeArray_1.default('elements', elements) : [];
        var uLength = numPostsForFence(uSegments);
        var lastVertex = uSegments + uLength * vSegments;
        var eSimple = 2 * uLength * vSegments;
        var j = 0;
        for (var i = 1; i <= eSimple; i += 2) {
            var k = (i - 1) / 2;
            elements[j] = (i - 1) / 2;
            elements[j + 1] = elements[j] + uLength;
            if (elements[j + 1] % uLength === uSegments) {
                if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
                    elements[j + 2] = elements[j + 1];
                    elements[j + 3] = (1 + i) / 2;
                    j += 2;
                }
            }
            j += 2;
        }
        return elements;
    }
    var GridTopology = (function (_super) {
        __extends(GridTopology, _super);
        function GridTopology(uSegments, vSegments) {
            _super.call(this, DrawMode_1.default.TRIANGLE_STRIP, numVerticesForGrid(uSegments, vSegments));
            this.elements = triangleStripForGrid(uSegments, vSegments);
            this._uSegments = uSegments;
            this._vSegments = vSegments;
        }
        Object.defineProperty(GridTopology.prototype, "uSegments", {
            get: function () {
                return this._uSegments;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "uLength", {
            get: function () {
                return numPostsForFence(this._uSegments);
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('uLength').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vSegments", {
            get: function () {
                return this._vSegments;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('vSegments').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vLength", {
            get: function () {
                return numPostsForFence(this._vSegments);
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('vLength').message);
            },
            enumerable: true,
            configurable: true
        });
        GridTopology.prototype.vertex = function (uIndex, vIndex) {
            mustBeInteger_1.default('uIndex', uIndex);
            mustBeInteger_1.default('vIndex', vIndex);
            return this.vertices[(this._vSegments - vIndex) * this.uLength + uIndex];
        };
        return GridTopology;
    })(MeshTopology_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GridTopology;
});
