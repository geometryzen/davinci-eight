import Facet from '../core/Facet'
import isDefined from '../checks/isDefined'
import mustBeBoolean from '../checks/mustBeBoolean'
import mustBeFunction from '../checks/mustBeFunction'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeString from '../checks/mustBeString'
import refChange from '../core/refChange'
import DrawList from './DrawList'
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

    const visual = new WebGLRenderer()
    visual.clearColor(0.1, 0.1, 0.1, 1.0)

    const drawList = new DrawList()

    const ambients: Facet[] = []

    const world = new World(visual, drawList, ambients)

    let requestId: number;

    function step(timestamp: number) {
        requestId = requestAnimationFrame(step)
        visual.clear()
        animate(timestamp)
        drawList.draw(ambients)
    }

    window.onload = function() {
        if (options.onload) {
            options.onload()
        }
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
        visual.start(canvas)

        requestId = requestAnimationFrame(step)
    }

    window.onunload = function() {

        if (options.onunload) {
            options.onunload()
        }

        world.release()
        drawList.release()
        visual.release()

        if (options.memcheck) {
            refChange('stop', 'onunload')
            refChange('dump', 'onunload')
        }
    }

    // The caller is now responsible for releasing the world.
    return world
}
