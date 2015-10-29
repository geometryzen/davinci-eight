import IAnimation = require('../slideshow/IAnimation')
import IDirector = require('../slideshow/IDirector')
import ISlide = require('../slideshow/ISlide')

import ISlideCommand = require('../slideshow/ISlideCommand')
import IUnknownArray = require('../collections/IUnknownArray')
import Shareable = require('../utils/Shareable')

import ColorRGB = require('../core/ColorRGB')
import ColorAnimation = require('../slideshow/animations/ColorAnimation')

import VectorE3 = require('../math/VectorE3')
import Vector3Animation = require('../slideshow/animations/Vector3Animation')

import SpinorE3 = require('../math/SpinorE3')
import Spinor3Animation = require('../slideshow/animations/Spinor3Animation')

class SlideCommands extends Shareable implements ISlideCommand {
    private commands: IUnknownArray<ISlideCommand>;
    constructor() {
        super('SlideCommands')
        this.commands = new IUnknownArray<ISlideCommand>()
    }
    protected destructor(): void {
        this.commands.release()
        this.commands = void 0
        super.destructor()
    }
    pushWeakRef(command: ISlideCommand): number {
        return this.commands.pushWeakRef(command)
    }
    redo(slide: ISlide, director: IDirector): void {
        for (var i = 0, iLength = this.commands.length; i < iLength; i++) {
            this.commands.getWeakRef(i).redo(slide, director)
        }

    }
    undo(slide: ISlide, director: IDirector): void {
        for (var i = this.commands.length - 1; i >= 0; i--) {
            this.commands.getWeakRef(i).undo(slide, director)
        }
    }
}

export = SlideCommands