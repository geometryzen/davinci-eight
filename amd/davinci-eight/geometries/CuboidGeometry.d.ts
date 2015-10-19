import DrawPrimitive = require('../geometries/DrawPrimitive');
import IGeometry = require('../geometries/IGeometry');
declare class CuboidGeometry implements IGeometry {
    iSegments: number;
    jSegments: number;
    kSegments: number;
    private _a;
    private _b;
    private _c;
    private sides;
    constructor();
    regenerate(): void;
    toPrimitives(): DrawPrimitive[];
}
export = CuboidGeometry;
