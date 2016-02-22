import Box from './Box'

describe('Box', function() {
    it("should be shareable", function() {
        const box = new Box()
        expect(box.isZombie()).toBe(false)
        box.release()
        expect(box.isZombie()).toBe(true)
    })
    it("width should default to 1", function() {
        const box = new Box()
        expect(box.width).toBe(1)
        box.release()
    })
    it("height should default to 1", function() {
        const box = new Box()
        expect(box.height).toBe(1)
        box.release()
    })
    it("depth should default to 1", function() {
        const box = new Box()
        expect(box.depth).toBe(1)
        box.release()
    })
    it("width should be mutable", function() {
        const box = new Box()
        box.width = 5
        expect(box.width).toBe(5)
        expect(box.height).toBe(1)
        expect(box.depth).toBe(1)
        box.release()
    })
})
