import AttributeProvider = require('../core/AttributeProvider');
declare function boxMesh(options?: {
    width?: number;
    height?: number;
    depth?: number;
    widthSegments?: number;
    wireFrame?: boolean;
}): AttributeProvider;
export = boxMesh;
