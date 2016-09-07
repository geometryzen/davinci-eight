import Slide from '../slideshow/Slide';
import ISlideCommand from '../slideshow/ISlideCommand';
import ShareableArray from '../collections/ShareableArray';
import {ShareableBase} from '../core/ShareableBase';
import SlideHost from './SlideHost';

export default class SlideCommands extends ShareableBase implements ISlideCommand {
    private commands: ShareableArray<ISlideCommand>;
    constructor() {
        super();
        this.setLoggingName('SlideCommands');
        this.commands = new ShareableArray<ISlideCommand>([]);
    }
    protected destructor(levelUp: number): void {
        this.commands.release();
        this.commands = void 0;
        super.destructor(levelUp + 1);
    }
    pushWeakRef(command: ISlideCommand): number {
        return this.commands.pushWeakRef(command);
    }
    redo(slide: Slide, host: SlideHost): void {
        for (let i = 0, iLength = this.commands.length; i < iLength; i++) {
            this.commands.getWeakRef(i).redo(slide, host);
        }

    }
    undo(slide: Slide, host: SlideHost): void {
        for (let i = this.commands.length - 1; i >= 0; i--) {
            this.commands.getWeakRef(i).undo(slide, host);
        }
    }
}
