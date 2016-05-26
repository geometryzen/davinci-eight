import BrowserDocument from '../base/BrowserDocument'
import BrowserHTMLElement from '../base/BrowserHTMLElement'
import BrowserWindow from '../base/BrowserWindow'
import {PerspectiveCamera} from '../facets/PerspectiveCamera'
import refChange from '../core/refChange'
import R3 from '../math/R3'
import {TrackballControls} from './TrackballControls'

class MockElement implements BrowserHTMLElement {
  clientLeft: number;
  clientTop: number;
  ownerDocument: BrowserDocument;
  public listening: { [type: string]: EventListener } = {}
  getBoundingClientRect(): { left: number, top: number, width: number, height: number } {
    throw new Error()
  }
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
    this.listening[type] = listener
  }
  removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
    delete this.listening[type]
  }
  dispatchEvent(evt: Event): boolean {
    throw new Error(`MockElement.dispatchEvent(${evt.type})`)
  }
}

class MockDocument implements BrowserDocument {
  public documentElement: BrowserHTMLElement
  public listening: { [type: string]: EventListener } = {}
  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
    this.listening[type] = listener
  }
  removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
    delete this.listening[type]
  }
  dispatchEvent(evt: Event): boolean {
    throw new Error(`MockDocument.dispatchEvent(${evt.type})`)
  }
  getElementById(elementId: string): HTMLElement {
    throw new Error(`MockDocument.getElementById(${elementId})`)
  }
}

class MockWindow implements BrowserWindow {
  public document = new MockDocument()
  public listening: { [type: string]: EventListener } = {}

  addEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
    this.listening[type] = listener
  }
  cancelAnimationFrame(handle: number): void {
    return window.cancelAnimationFrame(handle)
  }
  removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void {
    delete this.listening[type]
  }
  requestAnimationFrame(callback: FrameRequestCallback): number {
    return window.requestAnimationFrame(callback)
  }
  dispatchEvent(evt: Event): boolean {
    throw new Error(`MockWindow.dispatchEvent(${evt.type})`)
  }
}

describe("TrackballControls", function() {
  it("new-release", function() {
    refChange('quiet')
    refChange('reset')
    refChange('quiet')
    refChange('start')
    const camera = new PerspectiveCamera()
    const mockWindow = new MockWindow()
    const controls = new TrackballControls(camera, mockWindow)
    expect(controls.isZombie()).toBeFalsy()
    controls.release()
    expect(controls.isZombie()).toBeTruthy()
    const outstanding = refChange('stop')
    expect(outstanding).toBe(0)
    refChange('dump')
  })
  it("move(0, 0)", function() {
    refChange('quiet')
    refChange('reset')
    refChange('quiet')
    refChange('start')

    const camera = new PerspectiveCamera()
    expect(camera.eye.toString()).toBe(R3.e3.toString())
    expect(camera.look.toString()).toBe(R3.zero.toString())
    expect(camera.up.toString()).toBe(R3.e2.toString())
    const mockWindow = new MockWindow()
    const controls = new TrackballControls(camera, mockWindow)

    controls.move(0, 0)

    controls.update()

    expect(camera.eye.toString()).toBe(R3.e3.toString())
    expect(camera.look.toString()).toBe(R3.zero.toString())
    expect(camera.up.toString()).toBe(R3.e2.toString())

    controls.release()

    const outstanding = refChange('stop')
    expect(outstanding).toBe(0)
    refChange('dump')
  })
  describe("move(+0.25, 0)", function() {
    const camera = new PerspectiveCamera()
    const mockWindow = new MockWindow()
    const controls = new TrackballControls(camera, mockWindow)

    controls.move(+0.25, 0)

    controls.update()
    it("should change eye to -e1", function() {
      expect(camera.eye.approx(15).toString()).toBe(R3.e1.neg().toString())
    })
    it("should leave look unchanged", function() {
      expect(camera.look.toString()).toBe(R3.zero.toString())
    })
    it("should leave up unchanged", function() {
      expect(camera.up.toString()).toBe(R3.e2.toString())
    })

    controls.release()
  })
  describe("move(-0.25, 0)", function() {
    const camera = new PerspectiveCamera()
    const mockWindow = new MockWindow()
    const controls = new TrackballControls(camera, mockWindow)

    controls.move(-0.25, 0)

    controls.update()
    it("should change eye to +e1", function() {
      expect(camera.eye.approx(15).toString()).toBe(R3.e1.toString())
    })
    it("should leave look unchanged", function() {
      expect(camera.look.toString()).toBe(R3.zero.toString())
    })
    it("should leave up unchanged", function() {
      expect(camera.up.toString()).toBe(R3.e2.toString())
    })

    controls.release()
  })
  describe("move(0, +0.25)", function() {
    const camera = new PerspectiveCamera()
    const mockWindow = new MockWindow()
    const controls = new TrackballControls(camera, mockWindow)

    controls.move(0, +0.25)

    controls.update()
    it("should change eye to -e2", function() {
      expect(camera.eye.approx(15).toString()).toBe(R3.e2.neg().toString())
    })
    it("should leave look unchanged", function() {
      expect(camera.look.toString()).toBe(R3.zero.toString())
    })
    it("should change up to +e3", function() {
      expect(camera.up.approx(15).toString()).toBe(R3.e3.toString())
    })

    controls.release()
  })
  describe("move(0, -0.25)", function() {
    const camera = new PerspectiveCamera()
    const mockWindow = new MockWindow()
    const controls = new TrackballControls(camera, mockWindow)

    controls.move(0, -0.25)

    controls.update()
    it("should change eye to +e2", function() {
      expect(camera.eye.approx(15).toString()).toBe(R3.e2.toString())
    })
    it("should leave look unchanged", function() {
      expect(camera.look.toString()).toBe(R3.zero.toString())
    })
    it("should change up to -e3", function() {
      expect(camera.up.approx(15).toString()).toBe(R3.e3.neg().toString())
    })

    controls.release()
  })
})
