import Facet from '../core/Facet'
import mustBeFunction from '../checks/mustBeFunction'
import mustBeString from '../checks/mustBeString'
import refChange from '../core/refChange'
import DrawList from './DrawList'
import World from './World'
import WebGLRenderer from '../core/WebGLRenderer'

export default function(canvasId: string, animate: (timestamp: number) => any, terminate: () => any, options: { memcheck?: boolean } = {}): World {

  mustBeString('canvasId', canvasId)
  mustBeFunction('animate', animate)
  mustBeFunction('terminate', terminate)

  const memcheck = options.memcheck

  if (memcheck) {
    refChange('start', 'bootstrap')
  }

  const visual = new WebGLRenderer()
  visual.clearColor(0.1, 0.1, 0.1, 1.0)

  const drawList = new DrawList()

  const ambients: Facet[] = []

  const world = new World(visual, drawList, ambients)

  let requestId: number;

  function step(timestamp: number/*DOMHighResTimeStamp*/) {
    requestId = requestAnimationFrame(step)
    visual.clear()
    animate(timestamp)
    drawList.draw(ambients)
  }

  window.onload = function() {
    const canvas = <HTMLCanvasElement>document.getElementById(canvasId)
    canvas.width = 600
    canvas.height = 600
    visual.start(canvas)

    requestId = requestAnimationFrame(step)
  }

  window.onunload = function() {

    terminate()

    drawList.release()
    visual.release()

    if (memcheck) {
      refChange('stop', 'onunload')
      refChange('dump', 'onunload')
    }
  }

  // The caller is now responsible for releasing the world.
  return world
}
