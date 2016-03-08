import incLevel from '../base/incLevel'
import NumberShareableMap from './NumberShareableMap'
import ShareableBase from '../core/ShareableBase'

class Foo extends ShareableBase {
  constructor(level: number) {
    super('Foo', incLevel(level))
  }
  destructor(level: number) {
    super.destructor(incLevel(level))
  }
}

describe("NumberShareableMap", function() {
  it("new-release", function() {
    const map = new NumberShareableMap<Foo>()
    expect(map.isZombie()).toBe(false)
    map.release()
    expect(map.isZombie()).toBe(true)
  })
})
