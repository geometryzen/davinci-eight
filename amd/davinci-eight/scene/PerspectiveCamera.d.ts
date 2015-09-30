import Cartesian3 = require('../math/Cartesian3');
import IContextProvider = require('../core/IContextProvider');
import ICamera = require('../scene/ICamera');
import IMaterial = require('../core/IMaterial');
import Perspective = require('../cameras/Perspective');
import UniformData = require('../core/UniformData');
import UniformDataVisitor = require('../core/UniformDataVisitor');
import Vector3 = require('../math/Vector3');
/**
 * @class PerspectiveCamera
 */
declare class PerspectiveCamera implements ICamera, Perspective, UniformData {
    position: Vector3;
    private _refCount;
    private _uuid;
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
         var camera = new EIGHT.PerspectiveCamera()
         camera.setAspect(canvas.clientWidth / canvas.clientHeight)
         camera.setFov(3.0 * e3)
     */
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    addRef(): number;
    setUniforms(visitor: UniformDataVisitor, canvasId: number): void;
    contextFree(): void;
    contextGain(manager: IContextProvider): void;
    contextLost(): void;
    draw(canvasId: number): void;
    /**
     * The aspect ratio (width / height) of the camera viewport.
     * @property aspect
     * @type {number}
     * @readonly
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
     * @type {Vector3}
     * @readonly
     */
    eye: Vector3;
    /**
     * @method setEye
     * @param eye {Cartesian3}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setEye(eye: Cartesian3): PerspectiveCamera;
    /**
     * The field of view is the (planar) angle (magnitude) in the camera horizontal plane that encloses object that can be seen.
     * Measured in radians.
     * @property fov
     * @type {number}
     * @readonly
     */
    fov: number;
    /**
     * @method setFov
     * @param fov {number}
     * @return {PerspectiveCamera} `this` instance without incrementing the reference count.
     * @chainable
     */
    setFov(fov: number): PerspectiveCamera;
    look: Vector3;
    setLook(look: Cartesian3): PerspectiveCamera;
    /**
     * The distance to the near plane.
     * @property near
     * @type {number}
     * @readonly
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
    up: Vector3;
    setUp(up: Cartesian3): PerspectiveCamera;
    release(): number;
}
export = PerspectiveCamera;
