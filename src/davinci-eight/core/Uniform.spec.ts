import Uniform from './Uniform'
import config from '../config'
import ErrorMode from './ErrorMode'

describe("Uniform", function() {
  describe("(null)", function() {
    it("should be allowed in WARNME mode.", function() {
      const originalMode = config.errorMode
      config.errorMode = ErrorMode.WARNME
      try {
        const uLoc = new Uniform(null)
        expect(uLoc).toBeDefined()
      }
      finally {
        config.errorMode = originalMode
      }
    })
  })
})
