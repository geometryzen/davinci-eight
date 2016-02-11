import Arrow from './Arrow'
import Color from '../core/Color'
import Cuboid from './Cuboid'
import Cylinder from './Cylinder'
import DirectionalLight from '../facets/DirectionalLight'
import Facet from '../core/Facet'
import isDefined from '../checks/isDefined'
import mustBeNumber from '../checks/mustBeNumber'
import PerspectiveCamera from '../facets/PerspectiveCamera'
import readOnly from '../i18n/readOnly'
import Shareable from '../core/Shareable'
import DrawList from './DrawList'
import Sphere from './Sphere'
import WebGLRenderer from '../core/WebGLRenderer'

export default class World extends Shareable {
    private drawList: DrawList
    private visual: WebGLRenderer
    public ambients: Facet[];
    private _camera = new PerspectiveCamera(45 * Math.PI / 180, 1, 0.1, 1000)
    constructor(visual: WebGLRenderer, drawList: DrawList, ambients: Facet[]) {
        super('World')

        visual.addRef()
        this.visual = visual

        drawList.addRef()
        this.drawList = drawList

        this.drawList.subscribe(visual)

        this.ambients = ambients;

        this._camera.position.setXYZ(0, 1, 7)
        this._camera.look.setXYZ(0, 0, 0)
        this.ambients.push(this._camera)

        const dirLight = new DirectionalLight({ x: 0, y: 0, z: -1 }, Color.white)
        this.ambients.push(dirLight)
    }
    destructor(): void {
        this.drawList.unsubscribe()
        this.drawList.release()
        this.visual.release()
        super.destructor()
    }
    get camera(): PerspectiveCamera {
        return this._camera;
    }
    set camera(unused: PerspectiveCamera) {
        throw new Error(readOnly('camera').message)
    }
    arrow(): Arrow {
        const arrow = new Arrow()
        arrow.color = Color.fromRGB(0.6, 0.6, 0.6)
        this.drawList.add(arrow)
        arrow.release()
        return arrow
    }
    cuboid(options: { width?: number; height?: number; depth?: number } = {}): Cuboid {
        const cuboid = new Cuboid()
        cuboid.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        cuboid.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        cuboid.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
        cuboid.color = Color.green
        this.drawList.add(cuboid)
        cuboid.release()
        return cuboid
    }
    cylinder(options: { radius?: number } = {}): Cylinder {
        const cylinder = new Cylinder()
        cylinder.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        cylinder.color = Color.magenta
        this.drawList.add(cylinder)
        cylinder.release()
        return cylinder
    }
    sphere(options: { radius?: number } = {}): Sphere {
        const sphere = new Sphere()
        sphere.radius = isDefined(options.radius) ? mustBeNumber('radius', options.radius) : 0.5
        sphere.color = Color.blue
        this.drawList.add(sphere)
        sphere.release()
        return sphere
    }
}
