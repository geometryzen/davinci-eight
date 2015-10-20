import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
import Geometry = require('../geometries/Geometry');
import IGeometry = require('../geometries/IGeometry');
declare class CuboidGeometry extends Geometry implements IGeometry<CuboidGeometry> {
    iSegments: number;
    jSegments: number;
    kSegments: number;
    private _a;
    private _b;
    private _c;
    private sides;
    constructor();
    width: number;
    height: number;
    depth: number;
    private regenerate();
    setPosition(position: Cartesian3): CuboidGeometry;
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): CuboidGeometry;
}
export = CuboidGeometry;
