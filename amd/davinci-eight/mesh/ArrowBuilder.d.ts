import AttributeProvider = require('../core/AttributeProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @class ArrowBuilder
 */
declare class ArrowBuilder {
    private $axis;
    private $height;
    private $depth;
    private $widthSegments;
    private $heightSegments;
    private $depthSegments;
    private $wireFrame;
    constructor(options?: ArrowOptions);
    axis: Cartesian3;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    wireFrame: boolean;
    setAxis(axis: Cartesian3): ArrowBuilder;
    setHeight(height: number): ArrowBuilder;
    setDepth(depth: number): ArrowBuilder;
    setWidthSegments(widthSegments: number): ArrowBuilder;
    setHeightSegments(heightSegments: number): ArrowBuilder;
    setDepthSegments(depthSegments: number): ArrowBuilder;
    setWireFrame(wireFrame: boolean): ArrowBuilder;
    buildMesh(): AttributeProvider;
}
export = ArrowBuilder;
