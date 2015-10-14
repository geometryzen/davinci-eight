import ISlideCommand = require('../../slideshow/ISlideCommand');
import ISlideHost = require('../../slideshow/ISlideHost');
import Shareable = require('../../utils/Shareable');
declare class TestCommand extends Shareable implements ISlideCommand {
    private name;
    constructor(name: string);
    protected destructor(): void;
    redo(host: ISlideHost): void;
    undo(host: ISlideHost): void;
}
export = TestCommand;
