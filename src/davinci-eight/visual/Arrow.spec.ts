import Arrow from './Arrow'

describe("Arrow", function() {
  it("new-release", function() {
    const arrow = new Arrow()
    expect(arrow.isZombie()).toBe(false)
    arrow.release()
    expect(arrow.isZombie()).toBe(true)
  })
})
