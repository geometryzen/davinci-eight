import AttributeProvider = require('../core/AttributeProvider');
import BoxOptions = require('../mesh/BoxOptions');
/**
 * @class BoxBuilder
 */
declare class BoxBuilder {
    private $width;
    private $height;
    private $depth;
    private $widthSegments;
    private $heightSegments;
    private $depthSegments;
    private $wireFrame;
    constructor(options?: BoxOptions);
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    wireFrame: boolean;
    setWidth(width: number): BoxBuilder;
    setHeight(height: number): BoxBuilder;
    setDepth(depth: number): BoxBuilder;
    setWidthSegments(widthSegments: number): BoxBuilder;
    setHeightSegments(heightSegments: number): BoxBuilder;
    setDepthSegments(depthSegments: number): BoxBuilder;
    setWireFrame(wireFrame: boolean): BoxBuilder;
    buildMesh(): AttributeProvider;
}
export = BoxBuilder;
