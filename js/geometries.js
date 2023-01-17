import { Mat4, Vec3 } from './gl-math.js';
import { Geometry } from './webgl2.js';

export const horizon = ({ radius, depth }) => {
	const attr = [ 0, -depth, 0 ];
	const element = [];
	const n = 50;
	for (let i=0; i<=n; ++i) {
		const norm = 2*i/n - 1;
		const shift = norm*Math.pow(Math.abs(norm), 2);
		const angle = Math.PI*0.5*shift;
		const sin = Math.sin(angle);
		const cos = Math.cos(angle);
		attr.push(sin*radius, 0, cos*radius);
	}
	for (let i=0; i<n; ++i) {
		element.push(0, i + 1, i + 2);
	}
	return new Geometry({
		attr, element,
		layout: [ 3 ],
	});
};

export const star = (vertices = 8) => {
	const attr = [ 0, 0, 0 ];
	const element = [];
	for (let i=0; i<vertices; ++i) {
		const angle = Math.PI*2*i/vertices;
		const x = Math.sin(angle);
		const y = Math.cos(angle);
		attr.push(x, y, 0);
		element.push(0, i + 1, (i + 1)%vertices + 1);
	}
	return new Geometry({
		attr, element,
		layout: [ 3 ],
	})
};

const base_mag = -1.45;
const base_rad = 0.005;
const magToRad = (mag) => Math.pow(Math.pow(2.512, base_mag - mag), 0.25)*base_rad;

export const celestialSphere = (stars) => {
	const nVertices = 8;
	const attr = [];
	const element = [];
	let vCount = 0;
	const addStar = ({ ra, dec, vmag }) => {
		const rad = magToRad(vmag);
		const raAngle = ra/12*Math.PI;
		const decAngle = dec/180*Math.PI;
		const transform = new Mat4();
		transform.rotateX(decAngle);
		transform.rotateZ(-raAngle);
		const color = [ 1, 1, 1 ];
		attr.push(
			...new Vec3([ 0, 1, 0 ]).apply(transform),
			...color,
		);
		for (let i=0; i<nVertices; ++i) {
			const angle = i/nVertices*Math.PI*2;
			const x = Math.sin(angle)*rad;
			const z = Math.cos(angle)*rad;	
			const vec = new Vec3([ x, 1, z ]).apply(transform);
			attr.push(...vec, ...color);
			const triangle = [ 0, 1 + i, 1 + (i + 1)%nVertices ].map(i => i + vCount);
			element.push(...triangle);
		}
		vCount += nVertices + 1;
	};
	stars.forEach(addStar);
	return new Geometry({
		attr, element,
		layout: [ 3, 3 ],
	});
};
