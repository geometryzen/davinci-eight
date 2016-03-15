import BrowserApp from './BrowserApp'
import BrowserWindow from './BrowserWindow'
import BrowserDocument from './BrowserDocument'
import BrowserHTMLElement from './BrowserHTMLElement'

const EVENT_TYPE_DCL = 'DOMContentLoaded'
const EVENT_TYPE_UNLOAD = 'unload'

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

class MyBrowserApp extends BrowserApp {
  constructor(wnd?: BrowserWindow) {
    super(wnd)
  }
  protected run(): void {
  }
  protected destructor(): void {
    super.destructor()
  }
}

describe("BrowserApp", function() {
  it("should wait for the DOMContentLoaded", function() {
    const mockWindow = new MockWindow()
    const mockDocument = mockWindow.document

    expect(Object.keys(mockDocument.listening).length).toBe(0)
    expect(Object.keys(mockWindow.listening).length).toBe(0)

    const browserApp = new MyBrowserApp(mockWindow)

    expect(browserApp.isWaiting()).toBe(true)
    expect(browserApp.isRunning()).toBe(false)
    expect(browserApp.isZombie()).toBe(false)

    expect(Object.keys(mockDocument.listening).length).toBe(1)
    expect(Object.keys(mockDocument.listening)[0]).toBe(EVENT_TYPE_DCL)
    expect(Object.keys(mockWindow.listening).length).toBe(0)

    mockDocument.listening[EVENT_TYPE_DCL](null)

    expect(browserApp.isWaiting()).toBe(false)
    expect(browserApp.isRunning()).toBe(true)
    expect(browserApp.isZombie()).toBe(false)

    expect(Object.keys(mockDocument.listening).length).toBe(0)
    expect(Object.keys(mockWindow.listening).length).toBe(1)
    expect(Object.keys(mockWindow.listening)[0]).toBe(EVENT_TYPE_UNLOAD)

    mockWindow.listening[EVENT_TYPE_UNLOAD](null)

    expect(browserApp.isWaiting()).toBe(false)
    expect(browserApp.isRunning()).toBe(false)
    expect(browserApp.isZombie()).toBe(true)
  })
})