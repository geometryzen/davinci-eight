import IAnimation from '../slideshow/IAnimation';
import IDirector from '../slideshow/IDirector';
import ISlide from '../slideshow/ISlide';

import ISlideCommand from '../slideshow/ISlideCommand';
import ShareableArray from '../collections/ShareableArray';
import ShareableBase from '../core/ShareableBase';

import AbstractColor from '../core/AbstractColor';
import ColorAnimation from '../slideshow/animations/ColorAnimation';

import VectorE3 from '../math/VectorE3';
import Vector3Animation from '../slideshow/animations/Vector3Animation';

import SpinorE3 from '../math/SpinorE3';
import Spinor3Animation from '../slideshow/animations/Spinor3Animation';

export default class SlideCommands extends ShareableBase implements ISlideCommand {
    private commands: ShareableArray<ISlideCommand>;
    constructor() {
        super('SlideCommands')
        this.commands = new ShareableArray<ISlideCommand>()
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
