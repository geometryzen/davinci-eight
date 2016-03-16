import G3 from './G3'
import Spinor3 from './Spinor3'
import Vector3 from './Vector3'

describe("Spinor3", function() {
  describe("constructor", function() {
    it("coords argument should be preserved", function() {
      var coords = [1, 2, 3, 4];
      var m = Spinor3.spinor(1, 2, 3, 4);
      expect(m.coords[0]).toBe(coords[0]);
      expect(m.coords[1]).toBe(coords[1]);
      expect(m.coords[2]).toBe(coords[2]);
      expect(m.coords[3]).toBe(coords[3]);
      expect(m.modified).toBe(false);
    });
    it("no argument should create identity", function() {
      var m = Spinor3.one();
      expect(m.coords[0]).toBe(0);
      expect(m.coords[1]).toBe(0);
      expect(m.coords[2]).toBe(0);
      expect(m.coords[3]).toBe(1);
      expect(m.modified).toBe(false);
    });
  });
  describe("copy", function() {
    it("should preserve values and set modified flag", function() {
      const source = Spinor3.one()
      source.yz = 1
      source.zx = 2
      source.xy = 3
      source.α = 4
      const m = Spinor3.zero().copy(source);
      expect(m.coords[0]).toBe(1);
      expect(m.coords[1]).toBe(2);
      expect(m.coords[2]).toBe(3);
      expect(m.coords[3]).toBe(4);
      expect(m.modified).toBe(true);
    });
    it("should preserved modified flag when no change", function() {
      const source = Spinor3.spinor(0, 0, 0, 1);
      const m = Spinor3.one().copy(source);
      expect(m.coords[0]).toBe(0);
      expect(m.coords[1]).toBe(0);
      expect(m.coords[2]).toBe(0);
      expect(m.coords[3]).toBe(1);
      expect(m.modified).toBe(false);
    });
  });

  describe("isOne", function() {
    it("1 => true", function() {
      expect(Spinor3.one().isOne()).toBeTruthy()
    })
    it("0 => false", function() {
      expect(Spinor3.zero().isOne()).toBeFalsy()
    })
  })

  describe("isZero", function() {
    it("1 => false", function() {
      expect(Spinor3.one().isZero()).toBeFalsy()
    })
    it("0 => true", function() {
      expect(Spinor3.zero().isZero()).toBeTruthy()
    })
  })

  describe("maskG3", function() {
    it("1 => 0x1", function() {
      expect(Spinor3.one().maskG3).toBe(0x1)
    })
    it("0 => 0x0", function() {
      expect(Spinor3.zero().maskG3).toBe(0x0)
    })
    it("e1 ^ e2 => 0x4", function() {
      expect(Spinor3.wedge(G3.e1, G3.e2).maskG3).toBe(0x4)
    })
    it("e2 ^ e3 => 0x4", function() {
      expect(Spinor3.wedge(G3.e2, G3.e3).maskG3).toBe(0x4)
    })
    it("e3 ^ e1 => 0x4", function() {
      expect(Spinor3.wedge(G3.e3, G3.e1).maskG3).toBe(0x4)
    })
    it("rotorFromDirections(e1, e2) => 0x5", function() {
      expect(Spinor3.rotorFromDirections(G3.e1, G3.e2).maskG3).toBe(0x5)
    })
  })

  describe("mul", function() {
    const r = Spinor3.spinor(2, 3, 5, 7)
    const s = Spinor3.spinor(11, 13, 17, 19)
    const t = r.clone().mul(s)

    it("should multiply each coordinate by the scalar value", function() {
      expect(t.yz).toBe(129)
      expect(t.zx).toBe(127)
      expect(t.xy).toBe(221)
      expect(t.α).toBe(-13)
      expect(t.coords[0]).toBe(129)
      expect(t.coords[1]).toBe(127)
      expect(t.coords[2]).toBe(221)
      expect(t.coords[3]).toBe(-13)
      expect(t.modified).toBe(true)
    })

    describe("should agree with G3", function() {

      const R = G3.fromSpinor(r)
      const S = G3.fromSpinor(s)
      const T = R.mul(S)

      it("in vector and pseudo components", function() {
        expect(T.x).toBe(0)
        expect(T.y).toBe(0)
        expect(T.z).toBe(0)
        expect(T.β).toBe(0)
      })

      it("in α component", function() {
        expect(t.α).toBe(T.α)
      })
      it("in yz component", function() {
        expect(t.yz).toBe(T.yz)
      })
      it("in zx component", function() {
        expect(t.zx).toBe(T.zx)
      })
      it("in xy component", function() {
        expect(t.xy).toBe(T.xy)
      })
    })
  })

  describe("exp", function() {
    it("should preserve the identity", function() {
      var m = Spinor3.spinor(0, 0, 0, 1);
      var r = m.exp();
      expect(m.coords[0]).toBe(0);
      expect(m.coords[1]).toBe(0);
      expect(m.coords[2]).toBe(0);
      expect(m.coords[3]).toBe(Math.exp(1));
      expect(m.modified).toBe(true);
      expect(r).toBe(m);
    });
    it("should correspond with scalar exponentiation", function() {
      var m = Spinor3.spinor(0, 0, 0, 3);
      var clone = m.clone();
      m.exp();
      expect(m.coords[0]).toBe(0);
      expect(m.coords[1]).toBe(0);
      expect(m.coords[2]).toBe(0);
      expect(m.α).toBe(Math.exp(clone.α));
      expect(m.modified).toBe(true);
    });
  });

  describe("rotate", function() {

    const r = Spinor3.spinor(11, 13, 17, 19)
    const m = Spinor3.spinor(2, 3, 5, 7)
    const s = m.clone().rotate(r)

    it("should do the right thing", function() {
      expect(s.coords[0]).toBe(2244)
      expect(s.coords[1]).toBe(3940)
      expect(s.coords[2]).toBe(3608)
      expect(s.coords[3]).toBe(6580)
      expect(s.modified).toBe(true)
    })

    it("should agree with R * M * rev(R) using G3", function() {

      const R = G3.fromSpinor(r)
      const M = G3.fromSpinor(m)
      const S = R.mul(M).mul(R.rev())

      expect(s.α).toBe(S.α)
      expect(s.yz).toBe(S.yz)
      expect(s.zx).toBe(S.zx)
      expect(s.xy).toBe(S.xy)
    })
  })

  describe("scale", function() {
    it("should multiply each coordinate by the scalar value", function() {
      const m = Spinor3.spinor(2, 3, 5, 7).scale(2)
      expect(m.coords[0]).toBe(4)
      expect(m.coords[1]).toBe(6)
      expect(m.coords[2]).toBe(10)
      expect(m.coords[3]).toBe(14)
      expect(m.modified).toBe(true)
    })
  })

  describe("stress", function() {
    const σ = Vector3.vector(11, 13, 17)
    const a = Spinor3.spinor(2, 3, 5, 7)
    const b = a.clone().stress(σ)

    it("should leave the scalar coordinate unchanged", function() {
      expect(b.α).toBe(a.α)
    })

    it("should scale the bivector coordinates by the corresponding scale factors", function() {
      expect(b.yz).toBe(a.yz * σ.y * σ.z)
      expect(b.zx).toBe(a.zx * σ.z * σ.x)
      expect(b.xy).toBe(a.xy * σ.x * σ.y)
    })

    it("should set the modified flag", function() {
      expect(b.modified).toBe(true)
    })
  })

  describe("toExponential", function() {
    it("of Spinor3.zero() should be 0", function() {
      const s = Spinor3.zero()
      expect(s.toExponential()).toBe("0")
    })
    it("of Spinor3.one().scale(5) should be 5e+0", function() {
      const s = Spinor3.one().scale(5)
      expect(s.toExponential()).toBe("5e+0")
    })
  })

  describe("toFixed", function() {
    describe("()", function() {
      it("of Spinor3.zero() should be 0", function() {
        const s = Spinor3.zero()
        expect(s.toFixed()).toBe("0")
      })
      it("of Spinor3.one().scale(5) should be 5", function() {
        const s = Spinor3.one().scale(5)
        expect(s.toFixed()).toBe("5")
      })
    })
    describe("(4)", function() {
      it("of Spinor3.zero() should be 0", function() {
        const s = Spinor3.zero()
        expect(s.toFixed(4)).toBe("0")
      })
      it("of Spinor3.one().scale(5) should be 5.0000", function() {
        const s = Spinor3.one().scale(5)
        expect(s.toFixed(4)).toBe("5.0000")
      })
    })
  })

  describe("toString", function() {
    it("of Spinor3.zero() should be 0", function() {
      const s = Spinor3.zero()
      expect(s.toString()).toBe("0")
    })
    it("of Spinor3.one() should be 1", function() {
      const s = Spinor3.one()
      expect(s.toString()).toBe("1")
    })
    it("of Spinor3.spinor(0, 0, 0, 1) should be 1", function() {
      const s = Spinor3.spinor(0, 0, 0, 1)
      expect(s.toString()).toBe("1")
    })
    it("of Spinor3.spinor(1, 0, 0, 0) should be e23", function() {
      const s = Spinor3.spinor(1, 0, 0, 0)
      expect(s.toString()).toBe("e23")
    })
    it("of Spinor3.spinor(0, 1, 0, 0) should be e31", function() {
      const s = Spinor3.spinor(0, 1, 0, 0)
      expect(s.toString()).toBe("e31")
    })
    it("of Spinor3.spinor(0, 0, 1, 0) should be e12", function() {
      const s = Spinor3.spinor(0, 0, 1, 0)
      expect(s.toString()).toBe("e12")
    })
    it("of Spinor3.spinor(0, 0, 0, 5) should be 5", function() {
      const s = Spinor3.spinor(0, 0, 0, 5)
      expect(s.toString()).toBe("5")
    })
    it("of Spinor3.spinor(5, 0, 0, 0) should be 5*e23", function() {
      const s = Spinor3.spinor(5, 0, 0, 0)
      expect(s.toString()).toBe("5*e23")
    })
    it("of Spinor3.spinor(0, 5, 0, 0) should be 5*e31", function() {
      const s = Spinor3.spinor(0, 5, 0, 0)
      expect(s.toString()).toBe("5*e31")
    })
    it("of Spinor3.spinor(0, 0, 5, 0) should be 5*e12", function() {
      const s = Spinor3.spinor(0, 0, 5, 0)
      expect(s.toString()).toBe("5*e12")
    })
    it("of Spinor3.spinor(0, 0, 0, -5) should be -5", function() {
      const s = Spinor3.spinor(0, 0, 0, -5)
      expect(s.toString()).toBe("-5")
    })
    it("of Spinor3.spinor(-5, 0, 0, 0) should be -5*e23", function() {
      const s = Spinor3.spinor(-5, 0, 0, 0)
      expect(s.toString()).toBe("-5*e23")
    })
    it("of Spinor3.spinor(0, -5, 0, 0) should be -5*e31", function() {
      const s = Spinor3.spinor(0, -5, 0, 0)
      expect(s.toString()).toBe("-5*e31")
    })
    it("of Spinor3.spinor(0, 0, -5, 0) should be -5*e12", function() {
      const s = Spinor3.spinor(0, 0, -5, 0)
      expect(s.toString()).toBe("-5*e12")
    })
  })
})
