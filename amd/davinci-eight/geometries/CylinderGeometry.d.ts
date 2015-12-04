import AxialGeometry = require('../geometries/AxialGeometry');
import VectorE3 = require('../math/VectorE3');
import IAxialGeometry = require('../geometries/IAxialGeometry');
import Primitive = require('../geometries/Primitive');
/**
 * @class CylinderGeometry
 */
declare class CylinderGeometry extends AxialGeometry implements IAxialGeometry<CylinderGeometry> {
    /**
     * @property radius
     * @type {number}
     * @default 1
     */
    radius: number;
    /**
     * @property height
     * @type {number}
     * @default 1
     */
    height: number;
    /**
     * @property thetaSegments
     * @type {number}
     * @default 16
     */
    thetaSegments: number;
    /**
     * @class CylinderGeometry
     * @constructor
     * @param axis {VectorE3} The <code>axis</code> property. This will be normalized to unity.
     * @param sliceStart {VectorE3} A direction, orthogonal to <code>axis</code>.
     */
    constructor(axis: VectorE3, sliceStart: VectorE3);
    setAxis(axis: VectorE3): CylinderGeometry;
    setPosition(position: VectorE3): CylinderGeometry;
    toPrimitives(): Primitive[];
    enableTextureCoords(enable: boolean): CylinderGeometry;
}
export = CylinderGeometry;
