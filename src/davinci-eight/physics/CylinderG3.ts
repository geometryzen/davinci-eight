import {Color} from '../core/Color';
import {Facet} from '../core/Facet';
import G3 from './G3';
import {Renderable} from '../core/Renderable';
import {scale} from './WorldG3';
import WorldG3 from './WorldG3';

export default class CylinderG3 implements Renderable {
    public name: string;
    public color = Color.blueviolet.clone();
    public X = G3.meter;
    public length = G3.meter;
    public radius = G3.meter;
    public axis = G3.e2;
    public scaleFactor = G3.meter;
    public transparent = false;
    constructor(private world: WorldG3) {
        world.add(this);
    }
    render(ambients: Facet[]): void {
        const cylinder = this.world.cylinder;
        cylinder.X = scale(this.X, this.world.scaleFactor);
        cylinder.axis = scale(this.axis, G3.one);
        cylinder.length = scale(this.length, this.scaleFactor);
        cylinder.radius = scale(this.radius, this.scaleFactor);
        cylinder.color.copy(this.color);
        cylinder.render(ambients);
    }
}
