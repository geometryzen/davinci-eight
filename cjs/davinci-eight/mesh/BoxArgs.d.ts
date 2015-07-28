declare class BoxArgs {
    private $width;
    private $height;
    private $depth;
    private $widthSegments;
    private $heightSegments;
    private $depthSegments;
    private $wireFrame;
    constructor();
    width: number;
    height: number;
    depth: number;
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    wireFrame: boolean;
    setWidth(width: number): BoxArgs;
    setHeight(height: number): BoxArgs;
    setDepth(depth: number): BoxArgs;
    setWidthSegments(widthSegments: number): BoxArgs;
    setHeightSegments(heightSegments: number): BoxArgs;
    setDepthSegments(depthSegments: number): BoxArgs;
    setWireFrame(wireFrame: boolean): BoxArgs;
}
export = BoxArgs;
