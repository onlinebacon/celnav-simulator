import { Mat4, Vec3 } from '../core/gl-math.js';
import { Geometry } from '../core/webgl2.js';

export const horizon = ({ dip, radius }) => {
	const tanDip = Math.tan(dip);
	const y = - tanDip*radius/(tanDip + 1);
	const topRadius = radius + y;
	const attr = [ 0, -radius, 0 ];
	const element = [];
	const n = 50;
	for (let i=0; i<=n; ++i) {
		const norm = 2*i/n - 1;
		const shift = norm*Math.pow(Math.abs(norm), 2);
		const angle = Math.PI*0.5*shift;
		const x = Math.sin(angle)*topRadius;
		const z = Math.cos(angle)*topRadius;
		attr.push(x, y, z);
	}
	for (let i=0; i<n; ++i) {
		element.push(0, i + 1, i + 2);
	}
	element.push(0, 1, 2);
	return new Geometry({
		attr, element,
		layout: [ 3 ],
	});
};

const base_mag = -1.45;
const magToRad = (mag, maxRad) => Math.pow(Math.pow(2.512, base_mag - mag), 0.25)*maxRad;

export const celestialSphere = () => {
	const attr = [];
	const element = [];
	return new Geometry({ attr, element, layout: [ 3 ] });
};
