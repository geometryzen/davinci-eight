import VectorE3 = require('../math/VectorE3');
import IContextProvider = require('../core/IContextProvider');
import IMaterial = require('../core/IMaterial');
import Perspective = require('../cameras/Perspective');
import Shareable = require('../utils/Shareable');
import IFacet = require('../core/IFacet');
import IFacetVisitor = require('../core/IFacetVisitor');
import R3 = require('../math/R3');
/**
 * @class PerspectiveCamera
 */
declare class PerspectiveCamera extends Shareable implements Perspective, IFacet {
    /**
     * The name of the property that designates the position.
     * @property PROP_POSITION
     * @type {string}
     * @default 'X'
     * @static
     * @readOnly
     */
    static PROP_POSITION: string;
    static PROP_EYE: string;
    /**
     * @property material
     * @type {IMaterial}
     */
    material: IMaterial;
    /**
     * @property name
     * @type [string]
     */
    name: string;
    /**
     *
     */
    private inner;
    /**
     * <p>
     *
     * </p>
     * @class PerspectiveCamera
     * @constructor
     * @param [fov = 75 * Math.PI / 180] {number}
     * @param [aspect=1] {number}
     * @param [near=0.1] {number}
     * @param [far=2000] {number}
     * @example
     *   var camera = new EIGHT.PerspectiveCamera()
     *   camera.setAspect(canvas.clientWidth / canvas.clientHeight)
     *   camera.setFov(3.0 * e3)
     */
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    protected destructor(): void;
    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param canvasId {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId: number): void;
    contextFree(): void;
    contextGain(manager: IContextProvider): void;
    contextLost(): void;
    draw(canvasId: number): void;
    getProperty(name: string): number[];
    setProperty(name: string, value: number[]): void;
    /**
     * The aspect ratio (width / height) of the camera viewport.
     * @property aspect
     * @type {number}
     * @readOnly
     */
    aspect: number;
    /**
     * @method setAspect
     * @param aspect {number}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setAspect(aspect: number): PerspectiveCamera;
    /**
     * The position of the camera.
     * @property eye
     * @type {R3}
     * @readOnly
     */
    eye: R3;
    /**
     * @method setEye
     * @param eye {VectorE3}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setEye(eye: VectorE3): PerspectiveCamera;
    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     * @property fov
     * @type {number}
     * @readOnly
     */
    fov: number;
    /**
     * @method setFov
     * @param fov {number}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setFov(fov: number): PerspectiveCamera;
    look: R3;
    setLook(look: VectorE3): PerspectiveCamera;
    /**
     * The distance to the near plane.
     * @property near
     * @type {number}
     * @readOnly
     */
    near: number;
    /**
     * @method setNear
     * @param near {number}
     * @return {PerspectiveCamera} <p><code>this</code> instance, <em>without incrementing the reference count</em>.</p>
     * @chainable
     */
    setNear(near: number): PerspectiveCamera;
    far: number;
    setFar(far: number): PerspectiveCamera;
    up: R3;
    setUp(up: VectorE3): PerspectiveCamera;
}
export = PerspectiveCamera;
