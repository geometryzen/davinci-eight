import BrowserDocument from '../base/BrowserDocument'
import BrowserHTMLElement from '../base/BrowserHTMLElement'
import BrowserWindow from '../base/BrowserWindow'
import {OrbitControls} from './OrbitControls'
import {PerspectiveCamera} from '../facets/PerspectiveCamera'
import refChange from '../core/refChange'

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

describe("OrbitControls", function() {
    it("new-release", function() {
        refChange('quiet')
        refChange('reset')
        refChange('quiet')
        refChange('start')
        const mockWindow = new MockWindow()
        const controls = new OrbitControls(void 0, mockWindow)
        expect(controls.isZombie()).toBeFalsy()
        controls.release()
        expect(controls.isZombie()).toBeTruthy()
        const outstanding = refChange('stop')
        expect(outstanding).toBe(0)
        refChange('dump')
    })
    it("new-release", function() {
        refChange('quiet')
        refChange('reset')
        refChange('quiet')
        refChange('start')
        const mockWindow = new MockWindow()
        const controls = new OrbitControls(void 0, mockWindow)
        const view = new PerspectiveCamera()
        controls.setView(view)
        expect(controls.isZombie()).toBeFalsy()
        controls.release()
        expect(controls.isZombie()).toBeTruthy()
        const outstanding = refChange('stop')
        expect(outstanding).toBe(0)
        refChange('dump')
    })
})
