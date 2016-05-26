import BootstrapOptions from './BootstrapOptions'
import {Color} from '../core/Color'
import R3 from '../math/R3'
import {DirectionalLight} from '../facets/DirectionalLight'
import Facet from '../core/Facet'
import isDefined from '../checks/isDefined'
import mustBeBoolean from '../checks/mustBeBoolean'
import mustBeFunction from '../checks/mustBeFunction'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeObject from '../checks/mustBeObject'
import mustBeString from '../checks/mustBeString'
import DrawList from './DrawList'
import {PerspectiveCamera} from '../facets/PerspectiveCamera'
import refChange from '../core/refChange'
import {TrackballControls} from '../controls/TrackballControls'
import World from './World'
import {Engine} from '../core/Engine'

//
// This is deprecated.
//
export default function(
  canvasId: string,
  animate: (timestamp: number) => any,
  options: BootstrapOptions = {}): World {

  console.warn("The bootstrap function is deprecated. Use SingleViewApp instead.")

  mustBeString('canvasId', canvasId)
  mustBeFunction('animate', animate)
  mustBeObject('options', options)

  options.height = isDefined(options.height) ? mustBeNumber('options.height', options.height) : void 0
  options.memcheck = isDefined(options.memcheck) ? mustBeBoolean('options.memcheck', options.memcheck) : true
  options.onload = isDefined(options.onload) ? mustBeFunction('options.onload', options.onload) : void 0
  options.onunload = isDefined(options.onunload) ? mustBeFunction('options.onunload', options.onunload) : void 0
  options.width = isDefined(options.width) ? mustBeNumber('options.width', options.width) : void 0

  if (options.memcheck) {
    refChange('start', 'bootstrap')
  }

  const engine = new Engine()
  engine.clearColor(0.1, 0.1, 0.1, 1.0)

  const drawList = new DrawList(engine)

  const ambients: Facet[] = []

  const dirLight = new DirectionalLight(R3.e3.neg(), Color.white)
  ambients.push(dirLight)

  const camera = new PerspectiveCamera()
  ambients.push(camera)

  const controls = new TrackballControls(camera, window)

  const world = new World(engine, drawList, ambients, controls)

  let requestId: number;

  function step(timestamp: number) {
    requestId = window.requestAnimationFrame(step)

    engine.clear()

    controls.update()

    dirLight.direction.copyVector(camera.look).sub(camera.eye)

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
    engine.start(canvas)

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
    drawList.release()
    engine.release()

    if (options.memcheck) {
      refChange('stop', 'onunload')
      refChange('dump', 'onunload')
    }
  }

  // The caller is now responsible for releasing the world.
  return world
}
