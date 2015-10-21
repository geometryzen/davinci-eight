import Cartesian3 = require('../math/Cartesian3')
import DrawPrimitive = require('../geometries/DrawPrimitive')
import GridTopology = require('../topologies/GridTopology')
import Geometry = require('../geometries/Geometry')
import IGeometry = require('../geometries/IGeometry')
import mustBeBoolean = require('../checks/mustBeBoolean')
import mustBeNumber = require('../checks/mustBeNumber')
import Symbolic = require('../core/Symbolic')
import Vector2 = require('../math/Vector2')
import Vector3 = require('../math/Vector3')

function side(basis: Vector3[], uSegments: number, vSegments: number): GridTopology {
    var normal = Vector3.copy(basis[0]).cross(basis[1]).normalize()
    var aNeg = Vector3.copy(basis[0]).scale(-0.5)
    var aPos = Vector3.copy(basis[0]).scale(+0.5)
    var bNeg = Vector3.copy(basis[1]).scale(-0.5)
    var bPos = Vector3.copy(basis[1]).scale(+0.5)
    var cPos = Vector3.copy(basis[2]).scale(+0.5)
    var side = new GridTopology(uSegments, vSegments)
    for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
            var u = uIndex / uSegments
            var v = vIndex / vSegments
            var a = Vector3.copy(aNeg).lerp(aPos, u)
            var b = Vector3.copy(bNeg).lerp(bPos, v)
            var vertex = side.vertex(uIndex, vIndex)
            vertex.attributes[Symbolic.ATTRIBUTE_POSITION] = Vector3.copy(a).add(b).add(cPos)
            vertex.attributes[Symbolic.ATTRIBUTE_NORMAL] = normal
            vertex.attributes[Symbolic.ATTRIBUTE_TEXTURE_COORDS] = new Vector2([u, v])
        }
    }
    return side
}

/**
 * @class CuboidGeometry
 */
class CuboidGeometry extends Geometry implements IGeometry<CuboidGeometry> {
    public iSegments: number = 1;
    public jSegments: number = 1;
    public kSegments: number = 1;
    private _a: Vector3 = Vector3.e1.clone();
    private _b: Vector3 = Vector3.e2.clone();
    private _c: Vector3 = Vector3.e3.clone();
    private sides: GridTopology[];
    /**
     * @class CuboidGeometry
     * @constructor
     */
    constructor() {
        super()
        this.sides = []
    }
    /**
     * @property width
     * @type {number}
     */
    get width() {
        return this._a.magnitude()
    }
    set width(width: number) {
        mustBeNumber('width', width)
        this._a.setMagnitude(width)
    }
    /**
     * @property height
     * @type {number}
     */
    get height() {
        return this._b.magnitude()
    }
    set height(height: number) {
        mustBeNumber('height', height)
        this._b.setMagnitude(height)
    }
    /**
     * @property depth
     * @type {number}
     */
    get depth() {
        return this._c.magnitude()
    }
    set depth(depth: number) {
        mustBeNumber('depth', depth)
        this._c.setMagnitude(depth)
    }
    private regenerate(): void {
        this.sides = []
        // front
        this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments))
        // right
        this.sides.push(side([Vector3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments))
        // left
        this.sides.push(side([this._c, this._b, Vector3.copy(this._a).scale(-1)], this.kSegments, this.jSegments))
        // back
        this.sides.push(side([Vector3.copy(this._a).scale(-1), this._b, Vector3.copy(this._c).scale(-1)], this.iSegments, this.jSegments))
        // top
        this.sides.push(side([this._a, Vector3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments))
        // bottom
        this.sides.push(side([this._a, this._c, Vector3.copy(this._b).scale(-1)], this.iSegments, this.kSegments))
    }
    /**
     * @method setPosition
     * @param position {Cartesian3}
     * @return {CuboidGeometry}
     */
    public setPosition(position: Cartesian3): CuboidGeometry {
        super.setPosition(position)
        return this
    }
    /**
     * @method toPrimitives
     * @return {DrawPrimitive[]}
     */
    public toPrimitives(): DrawPrimitive[] {
        this.regenerate()
        return this.sides.map((side) => { return side.toDrawPrimitive() })
    }
    enableTextureCoords(enable: boolean): CuboidGeometry {
        super.enableTextureCoords(enable)
        return this
    }
}
export = CuboidGeometry