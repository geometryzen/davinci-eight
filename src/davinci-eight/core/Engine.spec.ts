import {Engine} from './Engine'
import refChange from './refChange'

describe("Engine", function() {
  xit("new-release", function() {
    refChange('start')
    const engine = new Engine()
    expect(engine instanceof Engine).toBe(true)
    engine.release()
    const outstanding = refChange('stop')
    expect(outstanding).toBe(0)
    if (outstanding) {
      refChange('dump')
    }
  })
})
