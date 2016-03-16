import EngineApp from './EngineApp'
import EngineAppOptions from './EngineAppOptions'

class MyEngineApp extends EngineApp {
  constructor(options: EngineAppOptions) {
    super(options)
  }
}

describe("EngineApp", function() {
  it("construction", function() {
    const options: EngineAppOptions = {canvasId: 'my-canvas'}
    const app = new MyEngineApp(options)
    expect(app.isZombie()).toBeFalsy()
  })
})