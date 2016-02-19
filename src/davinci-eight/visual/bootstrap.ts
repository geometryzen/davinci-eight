import Color from '../core/Color'
import R3 from '../math/R3'
import DirectionalLight from '../facets/DirectionalLight'
import Facet from '../core/Facet'
import isDefined from '../checks/isDefined'
import mustBeBoolean from '../checks/mustBeBoolean'
import mustBeFunction from '../checks/mustBeFunction'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeString from '../checks/mustBeString'
import DrawList from './DrawList'
import PerspectiveCamera from '../facets/PerspectiveCamera'
import refChange from '../core/refChange'
import TrackballCameraControls from '../controls/TrackballCameraControls'
import World from './World'
import WebGLRenderer from '../core/WebGLRenderer'

export default function(
    canvasId: string,
    animate: (timestamp: number) => any,
    options: {
        height?: number;
        memcheck?: boolean;
        onload?: () => any;
        onunload?: () => any;
        width?: number;
    } = {}): World {

    mustBeString('canvasId', canvasId)
    mustBeFunction('animate', animate)

    options.height = isDefined(options.height) ? mustBeNumber('options.height', options.height) : void 0
    options.memcheck = isDefined(options.memcheck) ? mustBeBoolean('options.memcheck', options.memcheck) : false
    options.onload = isDefined(options.onload) ? mustBeFunction('options.onload', options.onload) : void 0
    options.onunload = isDefined(options.onunload) ? mustBeFunction('options.onunload', options.onunload) : void 0
    options.width = isDefined(options.width) ? mustBeNumber('options.width', options.width) : void 0

    if (options.memcheck) {
        refChange('start', 'bootstrap')
    }

    const renderer = new WebGLRenderer()
    renderer.clearColor(0.1, 0.1, 0.1, 1.0)

    const drawList = new DrawList()

    const ambients: Facet[] = []

    const dirLight = new DirectionalLight(R3.e3.neg(), Color.white)
    ambients.push(dirLight)

    const camera = new PerspectiveCamera(45 * Math.PI / 180, 1, 0.1, 1000)
    camera.position.setXYZ(0, 0, 7)
    camera.look.setXYZ(0, 0, 0)
    camera.up.setXYZ(0, 1, 0)
    ambients.push(camera)

    const controls = new TrackballCameraControls(camera)

    const world = new World(renderer, drawList, ambients, controls)

    let requestId: number;

    function step(timestamp: number) {
        requestId = window.requestAnimationFrame(step)

        renderer.clear()

        controls.update()

        dirLight.direction.copy(camera.look).sub(camera.position)

        try {
            animate(timestamp)
        }
        catch (e) {
            window.cancelAnimationFrame(requestId)
            console.warn(e)
        }
        drawList.draw(ambients)
    }

    window.onload = function() {
        const canvas = <HTMLCanvasElement>document.getElementById(canvasId)
        if (isDefined(options.height)) {
            canvas.height = options.height
        }
        else {
            canvas.height = 600
        }
        if (isDefined(options.width)) {
            canvas.width = options.width
        }
        else {
            canvas.width = 600
        }
        renderer.start(canvas)

        controls.subscribe(world.canvas)
        controls.rotateSpeed = 4

        // Don't call the user's onload function until we've initialized WebGL.
        // We want to avoid the situation where get canvas implicitly creates a 
        // new canvas element and initializes WebGL leading to two canvas elements.
        // and creates a canvas. TODO: Such behavior is surprising and should be retracted.
        if (options.onload) {
            options.onload()
        }

        requestId = window.requestAnimationFrame(step)
    }

    window.onunload = function() {

        if (options.onunload) {
            options.onunload()
        }

        controls.release()
        world.release()
        drawList.release()
        renderer.release()

        if (options.memcheck) {
            refChange('stop', 'onunload')
            refChange('dump', 'onunload')
        }
    }

    // The caller is now responsible for releasing the world.
    return world
}
