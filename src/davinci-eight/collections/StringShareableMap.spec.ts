import incLevel from '../base/incLevel'
import StringShareableMap from './StringShareableMap'
import ShareableBase from '../core/ShareableBase'

class Foo extends ShareableBase {
  constructor(level: number) {
    super('Foo', incLevel(level))
  }
  destructor(level: number) {
    super.destructor(incLevel(level))
  }
}

describe("StringShareableMap", function() {
  it("new-release", function() {
    const map = new StringShareableMap<Foo>()
    expect(map.isZombie()).toBe(false)
    map.release()
    expect(map.isZombie()).toBe(true)
  })
})
