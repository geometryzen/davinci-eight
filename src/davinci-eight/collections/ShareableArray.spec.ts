import incLevel from '../base/incLevel'
import ShareableArray from './ShareableArray'
import ShareableBase from '../core/ShareableBase'

class Foo extends ShareableBase {
  constructor(level: number) {
    super('Foo', incLevel(level))
  }
  destructor(level: number) {
    super.destructor(incLevel(level))
  }
}

describe("ShareableArray", function() {
  it("new-release", function() {
    const map = new ShareableArray<Foo>()
    expect(map.isZombie()).toBe(false)
    map.release()
    expect(map.isZombie()).toBe(true)
  })
})
