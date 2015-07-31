import Drawable = require('../core/Drawable');
import RenderingContextUser = require('../core/RenderingContextUser');
interface DrawList extends RenderingContextUser {
    add(drawable: Drawable): void;
    remove(drawable: Drawable): void;
    drawGroups: {
        [drawGroupName: string]: Drawable[];
    };
}
export = DrawList;
