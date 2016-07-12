import {Geometric3} from './Geometric3'
import R3 from './R3'
import {Unit} from './Unit'
import Spinor3 from './Spinor3'
import Vector3 from './Vector3'

const one = Geometric3.one()
const e1 = Geometric3.fromVector(R3.e1)
const e2 = Geometric3.fromVector(R3.e2)
const e3 = Geometric3.fromVector(R3.e3)
const I = e1.clone().mul(e2).mul(e3)

describe("Geometric3", function() {

    describe("equals", function() {
        it("(M) should be eqial to M", function() {
            const zero: Geometric3 = Geometric3.zero()
            const one: Geometric3 = Geometric3.one()
            expect(zero.equals(zero)).toBe(true)
            expect(one.equals(one)).toBe(true)
            expect(zero.equals(one)).toBe(false)
            expect(one.equals(zero)).toBe(false)
        })
    })

    describe('events', function() {
        let eventName: string
        let key: string
        let value: number
        let source: Geometric3
        function callback(n: string, k: string, v: number, s: Geometric3) {
            eventName = n
            key = k
            value = v
            source = s
        }
        it("should fire the callback function appropriately", function() {
            const M: Geometric3 = Geometric3.zero()

            M.on('change', callback)

            expect(eventName).toBeUndefined()
            expect(key).toBeUndefined()
            expect(value).toBeUndefined()
            expect(source).toBeUndefined()

            M.addScalar(1)
            expect(eventName).toBe('change')
            expect(key).toBe('a')
            expect(value).toBe(1)
            expect(source).toEqual(M)

            eventName = void 0
            key = void 0
            value = void 0
            source = void 0

            M.scale(1)
            expect(eventName).toBeUndefined()
            expect(key).toBeUndefined()
            expect(value).toBeUndefined()
            expect(source).toBeUndefined()
        })
    })

    describe("div", function() {
        it("1 / 1 should be 1", function() {
            const numer: Geometric3 = one.clone()
            const denom: Geometric3 = one.clone()
            const ratio = numer.clone().div(denom)
            expect(ratio.isOne()).toBeTruthy()
        })
        it("1 / 2 should be 0.5", function() {
            const numer: Geometric3 = one.clone()
            const denom: Geometric3 = one.clone().scale(2)
            const ratio = numer.clone().div(denom)
            expect(ratio.toString()).toBe(one.clone().divByScalar(2).toString())
        })
        it("e1 / 1 should be e1", function() {
            const numer: Geometric3 = e1.clone()
            const denom: Geometric3 = one.clone()
            const ratio = numer.clone().div(denom)
            expect(ratio.toString()).toBe(e1.toString())
        })
        it("e1 / e1 should be 1", function() {
            const numer: Geometric3 = e1.clone()
            const denom: Geometric3 = e1.clone()
            const ratio = numer.clone().div(denom)
            expect(ratio.toString()).toBe(one.toString())
        })
        it("e1 / e2 should be e1 * e2", function() {
            const numer: Geometric3 = e1.clone()
            const denom: Geometric3 = e2.clone()
            const ratio = numer.clone().div(denom)
            expect(ratio.toString()).toBe(e1.clone().mul(e2).toString())
        })
        it("e1 / I should be e3 * e2", function() {
            const numer: Geometric3 = e1.clone()
            const denom: Geometric3 = I.clone()
            const ratio = numer.clone().div(denom)
            expect(ratio.toString()).toBe(e3.clone().mul(e2).toString())
        })
    })

    describe("inv", function() {
        it("(1) should be 1", function() {
            const one: Geometric3 = Geometric3.one()
            const inv = one.clone().inv()
            expect(inv.equals(one)).toBe(true)
        })
        it("(2) should be 0.5", function() {
            const two: Geometric3 = Geometric3.scalar(2)
            const inv = two.clone().inv()
            const half: Geometric3 = Geometric3.scalar(0.5)
            expect(inv.equals(half)).toBe(true)
        })
        it("(e1) should be e1", function() {
            const e1: Geometric3 = Geometric3.e1()
            const inv = e1.clone().inv()
            expect(inv.equals(e1)).toBe(true)
        })
        it("(2 * e1) should be 0.5 * e1", function() {
            const e1: Geometric3 = Geometric3.e1()
            const inv = e1.clone().scale(2).inv()
            const halfE1 = e1.clone().scale(0.5)
            expect(inv.equals(halfE1)).toBe(true)
        })
        it("(e2) should be e2", function() {
            const e2: Geometric3 = Geometric3.e2()
            const inv = e2.clone().inv()
            expect(inv.equals(e2)).toBe(true)
        })
        it("(2 * e2) should be 0.5 * e2", function() {
            const e2: Geometric3 = Geometric3.e2()
            const inv = e2.clone().scale(2).inv()
            const halfE2 = e2.clone().scale(0.5)
            expect(inv.equals(halfE2)).toBe(true)
        })
        it("(e3) should be e3", function() {
            const e3: Geometric3 = Geometric3.e3()
            const inv = e3.clone().inv()
            expect(inv.equals(e3)).toBe(true)
        })
        it("(2 * e3) should be 0.5 * e3", function() {
            const e3: Geometric3 = Geometric3.e3()
            const inv = e3.clone().scale(2).inv()
            const halfE3 = e3.clone().scale(0.5)
            expect(inv.equals(halfE3)).toBe(true)
        })
        it("(I) should be -I", function() {
            const e1: Geometric3 = Geometric3.e1()
            const e2: Geometric3 = Geometric3.e2()
            const e3: Geometric3 = Geometric3.e3()
            const I = e1.clone().mul(e2).mul(e3)
            const inv = I.clone().inv()
            const minusI = I.clone().neg()
            expect(inv.equals(minusI)).toBe(true)
        })
        it("(2 * I) should be -0.5 * I", function() {
            const e1: Geometric3 = Geometric3.e1()
            const e2: Geometric3 = Geometric3.e2()
            const e3: Geometric3 = Geometric3.e3()
            const I = e1.clone().mul(e2).mul(e3)
            const inv = I.clone().scale(2).inv()
            const minusHalfI = I.clone().neg().scale(0.5)
            expect(inv.equals(minusHalfI)).toBe(true)
        })
    })

    describe("maskG3", function() {
        it("0 => 0x0", function() {
            expect(Geometric3.zero().maskG3).toBe(0x0)
        })
        it("1 => 0x1", function() {
            expect(Geometric3.one().maskG3).toBe(0x1)
        })
        it("e1 => 0x2", function() {
            expect(e1.maskG3).toBe(0x2)
        })
        it("e2 => 0x2", function() {
            expect(e2.maskG3).toBe(0x2)
        })
        it("e3 => 0x2", function() {
            expect(e3.maskG3).toBe(0x2)
        })
        it("1+e1 => 0x3", function() {
            expect(e1.clone().addScalar(1).maskG3).toBe(0x3)
        })
        it("e1 ^ e2 => 0x4", function() {
            expect(Geometric3.wedge(e1, e2).maskG3).toBe(0x4)
        })
        it("e2 ^ e3 => 0x4", function() {
            expect(Geometric3.wedge(e2, e3).maskG3).toBe(0x4)
        })
        it("e3 ^ e1 => 0x4", function() {
            expect(Geometric3.wedge(e3, e1).maskG3).toBe(0x4)
        })
        it("rotorFromDirections(e1, e2) => 0x5", function() {
            expect(Geometric3.rotorFromDirections(R3.e1, R3.e2).maskG3).toBe(0x5)
        })
        it("pseudoscalar => 0x8", function() {
            const I = new Geometric3().zero().addPseudo(1)
            expect(I.maskG3).toBe(0x8)
        })
    })

    describe("rotorFromGeneratorAngle", function() {
        describe("(e1 ^ e2, PI)", function() {
            const e1 = Geometric3.fromVector(R3.e1)
            const e2 = Geometric3.fromVector(R3.e2)
            const B = e1.clone().ext(e2)
            const R = Geometric3.one().addVector(R3.e1).addVector(R3.e2).addVector(R3.e3).addPseudo(1).add(B)
            R.rotorFromGeneratorAngle(B, Math.PI)
            R.approx(12)
            it("should equal e2 ^ e1", function() {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy()
            })
        })
        describe("(2 * e1 ^ e2, PI/2)", function() {
            const e1 = Geometric3.fromVector(R3.e1)
            const e2 = Geometric3.fromVector(R3.e2)
            const B = e1.clone().ext(e2).scale(2)
            const R = Geometric3.one().addVector(R3.e1).addVector(R3.e2).addVector(R3.e3).addPseudo(1).add(B)
            R.rotorFromGeneratorAngle(B, Math.PI / 2)
            R.approx(12)
            it("should equal e2 ^ e1", function() {
                expect(R.equals(e2.clone().ext(e1))).toBeTruthy()
            })
        })
    })

    describe("reflect", function() {
        const n = R3.vector(1, 0, 0, Unit.ONE)
        const a = Geometric3.vector(2, 3, 0)
        const chain = a.reflect(n)

        it("should reflect (2,3)", function() {
            expect(a.x).toBe(-2)
            expect(a.y).toBe(+3)
            expect(a.z).toBe(0)
        })
        it("should be chainable", function() {
            expect(chain === a).toBe(true)
        })
    })

    describe("stress", function() {
        const stress = R3.vector(7, 11, 13, Unit.ONE)
        const position = Geometric3.vector(2, 3, 5)
        const chain = position.stress(stress)

        it("should piece-wise multiply grade 1 components", function() {
            expect(position.x).toBe(14)
            expect(position.y).toBe(33)
            expect(position.z).toBe(65)
        })
        it("should be chainable", function() {
            expect(chain === position).toBe(true)
        })
    })

    describe("__add__", function() {
        describe("(Geometric3, Geometric3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Geometric3.random()
            const rhG = r.clone()
            const a = l.__add__(r)
            const b = lhG.clone().add(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Vector3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Vector3.random()
            const rhG = Geometric3.fromVector(r)
            const a = l.__add__(r)
            const b = lhG.clone().add(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Spinor3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Spinor3.random()
            const rhG = Geometric3.fromSpinor(r)
            const a = l.__add__(r)
            const b = lhG.clone().add(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, number)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Math.random()
            const rhG = Geometric3.scalar(r)
            const a = l.__add__(r)
            const b = lhG.clone().add(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
    })

    describe("__sub__", function() {
        describe("(Geometric3, Geometric3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Geometric3.random()
            const rhG = r.clone()
            const a = l.__sub__(r)
            const b = lhG.clone().sub(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Vector3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Vector3.random()
            const rhG = Geometric3.fromVector(r)
            const a = l.__sub__(r)
            const b = lhG.clone().sub(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Spinor3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Spinor3.random()
            const rhG = Geometric3.fromSpinor(r)
            const a = l.__sub__(r)
            const b = lhG.clone().sub(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, number)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Math.random()
            const rhG = Geometric3.scalar(r)
            const a = l.__sub__(r)
            const b = lhG.clone().sub(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
    })

    describe("__mul__", function() {
        describe("(Geometric3, Geometric3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Geometric3.random()
            const rhG = r.clone()
            const a = l.__mul__(r)
            const b = lhG.clone().mul(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Vector3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Vector3.random()
            const rhG = Geometric3.fromVector(r)
            const a = l.__mul__(r)
            const b = lhG.clone().mul(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Spinor3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Spinor3.random()
            const rhG = Geometric3.fromSpinor(r)
            const a = l.__mul__(r)
            const b = lhG.clone().mul(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, number)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Math.random()
            const rhG = Geometric3.scalar(r)
            const a = l.__mul__(r)
            const b = lhG.clone().mul(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
    })

    describe("__div__", function() {
        describe("(Geometric3, Geometric3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Geometric3.random()
            const rhG = r.clone()
            const a = l.__div__(r)
            const b = lhG.clone().div(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Vector3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Vector3.random()
            const rhG = Geometric3.fromVector(r)
            const a = l.__div__(r)
            const b = lhG.clone().div(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, Spinor3)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Spinor3.random()
            const rhG = Geometric3.fromSpinor(r)
            const a = l.__div__(r)
            const b = lhG.clone().div(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
        describe("(Geometric3, number)", function() {
            const l = Geometric3.random()
            const lhG = l.clone()
            const r = Math.random()
            const rhG = Geometric3.scalar(r)
            const a = l.__div__(r)
            const b = lhG.clone().div(rhG)
            it("α", function() {
                expect(a.a).toBe(b.a)
            })
            it("x", function() {
                expect(a.x).toBe(b.x)
            })
            it("y", function() {
                expect(a.y).toBe(b.y)
            })
            it("z", function() {
                expect(a.z).toBe(b.z)
            })
            it("yz", function() {
                expect(a.yz).toBe(b.yz)
            })
            it("zx", function() {
                expect(a.zx).toBe(b.zx)
            })
            it("xy", function() {
                expect(a.xy).toBe(b.xy)
            })
            it("β", function() {
                expect(a.b).toBe(b.b)
            })
        })
    })
})
