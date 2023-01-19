import { Mat4 } from './gl-math.js';

const temp = new Mat4();

export class Camera {
	constructor({
		vFov = 90,
		near = 0.1,
		far = 100,
		ratio = 1,
	} = {}) {
		this.vFov = vFov;
		this.near = near;
		this.far = far;
		this.ratio = ratio;
		this.transform = new Mat4();
		this.projection = new Mat4();
		this.update();
	}
	update() {
		const slope = Math.tan(this.vFov/360*Math.PI);
		const my = 1/slope;
		const mx = 1/(slope*this.ratio);
		const n = this.near;
		const f = this.far;
		const m = (f + n)/(f - n);
		const c = f*(1 - m);
		temp.set([
			mx,  0, 0, 0,
			 0, my, 0, 0,
			 0,  0, m, 1,
			 0,  0, c, 0,
		]);
		this.transform.invertTransform(this.projection);
		this.projection.apply(temp);
		return this;
	}
}
