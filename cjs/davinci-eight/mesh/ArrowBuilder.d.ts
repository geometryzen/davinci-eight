import AttribProvider = require('../core/AttribProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
import Cartesian3 = require('../math/Cartesian3');
import ContextManager = require('../core/ContextManager');
/**
 * @class ArrowBuilder
 */
declare class ArrowBuilder {
    private $axis;
    private $flavor;
    private $height;
    private $depth;
    private $widthSegments;
    private $heightSegments;
    private $depthSegments;
    private $coneHeight;
    private $wireFrame;
    constructor(options?: ArrowOptions);
    axis: Cartesian3;
    flavor: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    coneHeight: number;
    wireFrame: boolean;
    setAxis(axis: Cartesian3): ArrowBuilder;
    setFlavor(flavor: number): ArrowBuilder;
    setHeight(height: number): ArrowBuilder;
    setDepth(depth: number): ArrowBuilder;
    setWidthSegments(widthSegments: number): ArrowBuilder;
    setHeightSegments(heightSegments: number): ArrowBuilder;
    setDepthSegments(depthSegments: number): ArrowBuilder;
    setConeHeight(coneHeight: number): ArrowBuilder;
    setWireFrame(wireFrame: boolean): ArrowBuilder;
    buildMesh(monitor: ContextManager): AttribProvider;
}
export = ArrowBuilder;
