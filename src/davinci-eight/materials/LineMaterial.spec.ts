import { Engine } from '../core/Engine'
import { LineMaterial } from './LineMaterial'
import LineMaterialOptions from '../materials/LineMaterialOptions'

describe("LineMaterial", function() {
    it("new-release", function() {
        const matOptions: LineMaterialOptions = void 0
        const engine: Engine = new Engine()
        const material = new LineMaterial(engine, matOptions)
        expect(material.isZombie()).toBe(false)
        material.release()
        expect(material.isZombie()).toBe(true)
        engine.release()
    })
})
