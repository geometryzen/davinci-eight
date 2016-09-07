import {Arrow} from '../visual/Arrow';
import BlendingFactorDest from '../core/BlendingFactorDest';
import BlendingFactorSrc from '../core/BlendingFactorSrc';
import Capability from '../core/Capability';
import {Cylinder} from '../visual/Cylinder';
import {DirectionalLight} from '../facets/DirectionalLight';
import {Engine} from '../core/Engine';
import {Facet} from '../core/Facet';
import {Geometric3} from '../math/Geometric3';
import G3 from './G3';
import {PerspectiveCamera} from '../facets/PerspectiveCamera';
import {Renderable} from '../core/Renderable';
import {Scene} from '../core/Scene';
import {Sphere} from '../visual/Sphere';
import {TrackballControls} from '../controls/TrackballControls';

export default class WorldG3 {
    public scaleFactor: G3 = G3.meter;
    private engine: Engine;
    private scene: Scene;
    private ambients: Facet[] = [];
    private trackball: TrackballControls;
    private dirLight: DirectionalLight;
    private camera: PerspectiveCamera;
    public framecounter: number = 0;
    public arrow: Arrow;
    public cylinder: Cylinder;
    public sphere: Sphere;

    constructor(canvas: string | HTMLCanvasElement | WebGLRenderingContext) {
        this.engine = new Engine(canvas)
            .size(500, 500)
            .clearColor(0.1, 0.1, 0.1, 1.0)
            .enable(Capability.DEPTH_TEST)
            .enable(Capability.BLEND)
            .blendFunc(BlendingFactorSrc.SRC_ALPHA, BlendingFactorDest.ONE);

        this.scene = new Scene(this.engine)
        this.arrow = new Arrow({ contextManager: this.engine });
        this.cylinder = new Cylinder({ contextManager: this.engine });
        this.sphere = new Sphere({ contextManager: this.engine });

        this.camera = new PerspectiveCamera()
        // this.camera.eye.copy(e3 - e2).normalize().scale(2)
        // this.camera.up.copy(e2)
        this.ambients.push(this.camera)

        this.dirLight = new DirectionalLight()
        this.ambients.push(this.dirLight)

        this.trackball = new TrackballControls(this.camera, window)
        // Workaround because Trackball no longer supports context menu for panning.
        this.trackball.noPan = true
        this.trackball.subscribe(this.engine.canvas)
    }
    /**
     * Adds a drawable object to the WorldG3.
     */
    add(drawable: Renderable): void {
        if (drawable) {
            this.scene.add(drawable)
        }
        else {
            // Throw Error 
        }
    }
    /**
     * 
     */
    clear(): void {
        this.engine.clear()

        this.trackball.update()

        this.dirLight.direction.copy(this.camera.look).sub(this.camera.eye)
    }

    draw(): void {
        this.scene.draw(this.ambients)
    }
}

export function scale(quantity: G3, scaleFactor: G3): Geometric3 {
    const dimless = quantity.div(scaleFactor);
    const uom = dimless.uom
    if (!uom || uom.isOne()) {
        return Geometric3.copy(dimless)
    }
    else {
        // window.alert(`Units of scaleFactor, ${scaleFactor}, is not consistent with units of quantity, ${quantity}.`)
    }
}

