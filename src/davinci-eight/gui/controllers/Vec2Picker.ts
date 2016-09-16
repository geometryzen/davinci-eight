import Picker from './Picker';
import Vector from './Vector';
import addClass from '../dom/addClass';

export default class Vec2Picker extends Picker<Vector> {
    min: number;
    max: number;
    size: number;
    range: number;
    overPoint: boolean;
    constructor(object: {}, property: string, pos?: number[], properties?: {}) {
        super(object, property, 'ge_vec2picker_', properties);

        this.width = this.width || 200;
        this.height = this.height || 200;

        this.min = this.min || -1;
        this.max = this.max || 1;
        this.size = this.size || 6;
        this.range = this.max - this.min;
        this.overPoint = false;

        let center = ((this.range / 2) - this.max) * -1;
        this.setValue(pos || [center, center]);
        this.updateDisplay();
    }

    complete(): void {
        addClass(this.__li, 'vector');
    }

    protected updateDisplay(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Frame around the Plane.
        this.ctx.strokeStyle = this.dimColor;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.width, this.height);

        // Horizontal and Vertical Grid Lines in the Background.
        this.ctx.beginPath();
        this.ctx.lineWidth = 0.25;
        let sections = 20;
        let step = this.width / sections;
        for (let i = 0; i < sections; i++) {
            this.ctx.moveTo(i * step, 0);
            this.ctx.lineTo(i * step, this.height);
            this.ctx.moveTo(0, i * step);
            this.ctx.lineTo(this.width, i * step);
        }
        this.ctx.stroke();

        // horizontal line
        this.ctx.strokeStyle = this.dimColor;
        this.ctx.lineWidth = 1.0;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0.5 + this.height * 0.5);
        this.ctx.lineTo(this.width, 0.5 + this.height * 0.5);
        this.ctx.closePath();
        this.ctx.stroke();

        // vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(0.5 + this.width * 0.5, 0);
        this.ctx.lineTo(0.5 + this.width * 0.5, this.height);
        this.ctx.closePath();
        this.ctx.stroke();

        // // Triangle line
        // this.ctx.fillStyle = this.dimColor;
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.width * 0.5, 5);
        // this.ctx.lineTo(this.width * 0.48, 0);
        // this.ctx.lineTo(this.width * 0.52, 0);
        // this.ctx.closePath();
        // this.ctx.fill();

        const value = super.getValue();
        let x = Math.round(((value.x - this.min) / this.range) * this.width);
        let y = Math.round(((1 - (value.y - this.min) / this.range)) * this.height);

        let half = this.size / 2;

        if (x < half) {
            x = half;
        }
        if (x > this.width - half) {
            x = this.width - half;
        }
        if (y < half) {
            y = half;
        }
        if (y > this.height - half) {
            y = this.height - half;
        }

        // point
        this.ctx.fillStyle = this.overPoint ? this.selColor : this.fnColor;
        this.ctx.beginPath();
        const radius = this.overPoint ? 4 : 2;
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        this.ctx.fill();

        this.ctx.restore();
        this.overPoint = false;
    }

    onMouseMove(event: MouseEvent) {
        let x = event.offsetX;
        let y = event.offsetY;

        const value = super.getValue();
        value.x = ((this.range / this.width) * x) - (this.range - this.max);
        value.y = (((this.range / this.height) * y) - (this.range - this.max)) * -1;
        super.setValue(value);
        this.overPoint = true;
    }

    setValue(pos: any) {
        const value = new Vector(pos);
        super.setValue(value);
    }
}
