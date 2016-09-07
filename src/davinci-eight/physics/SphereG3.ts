import {Color} from '../core/Color';
import {Facet} from '../core/Facet';
import G3 from './G3';
import {Renderable} from '../core/Renderable';
import {scale} from './WorldG3';
import WorldG3 from './WorldG3';

export default class SphereG3 implements Renderable {
    public name: string;
    public color = Color.blueviolet.clone();
    public X = G3.meter;
    public radius = G3.meter;
    public axis = G3.e2;
    public scaleFactor = G3.meter;
    public transparent = false;
    constructor(private world: WorldG3) {
        world.add(this);
        this.color = world.sphere.color.clone();
    }
    render(ambients: Facet[]): void {
        const sphere = this.world.sphere;
        sphere.X = scale(this.X, this.world.scaleFactor);
        sphere.axis.copyVector(this.axis);
        sphere.radius = scale(this.radius, this.scaleFactor).a;
        sphere.color.copy(this.color);
        sphere.render(ambients);
    }
}
