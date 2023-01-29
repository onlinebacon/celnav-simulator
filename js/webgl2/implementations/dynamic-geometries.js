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

export const celestialSphere = (stars, maxRad) => {
	const nVertices = 5;
	const attr = [];
	const element = [];
	let vCount = 0;
	const addStar = ({ ra, dec, vmag }) => {
		const rad = magToRad(vmag, maxRad);
		const raAngle = ra/12*Math.PI;
		const decAngle = dec/180*Math.PI;
		const transform = new Mat4();
		transform.rotateX(decAngle);
		transform.rotateZ(-raAngle);
		const center = new Vec3([ 0, 1, 0 ]).apply(transform);
		const color = [ 1, 1, 1 ];
		attr.push(
			...center,
			...color,
		);
		for (let i=0; i<nVertices; ++i) {
			const angle = i/nVertices*Math.PI*2;
			const x = Math.sin(angle)*rad;
			const z = Math.cos(angle)*rad;
			const vec = new Vec3([ x, 1, z ]).apply(transform).normalize();
			attr.push(...vec, ...color);
			const triangle = [ 0, 1 + i, 1 + (i + 1)%nVertices ].map(i => i + vCount);
			element.push(...triangle);
		}
		vCount += nVertices + 1;
	};
	stars.forEach(addStar);
	return new Geometry({ attr, element, layout: [ 3, 3 ] });
};
