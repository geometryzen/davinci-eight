import EIGHTLogger from './EIGHTLogger'
import refChange from '../core/refChange'

describe("EIGHTLogger", function() {
  it("new-release", function() {
    refChange('start')
    const logger = new EIGHTLogger()
    logger.release()
    const outstanding = refChange('stop')
    expect(outstanding).toBe(0)
  })
})
