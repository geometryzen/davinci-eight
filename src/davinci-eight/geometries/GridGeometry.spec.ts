import { Engine } from '../core/Engine'
import GridGeometry from './GridGeometry'

describe("GridGeometry", function () {
  it("new-release", function () {
    const engine = new Engine()
    const geometry = new GridGeometry(engine)
    expect(geometry.isZombie()).toBe(false)
    geometry.release()
    expect(geometry.isZombie()).toBe(true)
    engine.release()
  })
})
