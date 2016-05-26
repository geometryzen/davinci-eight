import {Engine} from '../core/Engine'
import isFunction from '../checks/isFunction'
import Viewport from './Viewport'
import refChange from '../core/refChange'

describe("Viewport", function() {
  it("new-release", function() {
    refChange('quiet')
    refChange('reset')
    refChange('quiet')
    refChange('start')
    const engine = new Engine()
    const view = new Viewport(engine)
    expect(view.isZombie()).toBeFalsy()
    view.release()
    expect(view.isZombie()).toBeTruthy()

    expect(engine.isZombie()).toBeFalsy()
    engine.release()
    expect(engine.isZombie()).toBeTruthy()
    refChange('stop')
    refChange('dump')
  })
  describe("ambients", function() {
    const engine = new Engine()
    const view = new Viewport(engine)
    const ambients = view.ambients
    it("should contain facets", function() {
      const iLen = ambients.length
      for (let i = 0; i < iLen; i++) {
        const facet = ambients[i]
        expect(isFunction(facet.setProperty)).toBeTruthy()
        expect(isFunction(facet.setUniforms)).toBeTruthy()
      }
    })
    view.release()
    engine.release()
  })
})
