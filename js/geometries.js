import { Geometry } from './webgl2.js';
import { Vec4 } from './gl-math.js';

export const triangle = ([ r, g, b ]) => {
	const xOf = (i) => Math.sin(i*120/180*Math.PI)*0.5;
	const yOf = (i) => Math.cos(i*120/180*Math.PI)*0.5;
	return new Geometry({
		attr: [
			xOf(0), yOf(0), 0, r, g, b,
			xOf(1), yOf(1), 0, r, g, b,
			xOf(2), yOf(2), 0, r, g, b,
		],
		element: [ 0, 1, 2 ],
		layout: [ 3, 3 ],
	});
};

export const cube = (size = 1) => {
	let nFaces = 0;
	const attr = [];
	const element = [];
	const toRad = (val) => val*Math.PI*0.5;
	const scale = size*0.5;
	const addFace = (rx, ry, r, g, b) => {
		const base = nFaces*4;
		const vecs = [
			new Vec4([ -scale, -scale, -scale ]),
			new Vec4([ +scale, -scale, -scale ]),
			new Vec4([ -scale, +scale, -scale ]),
			new Vec4([ +scale, +scale, -scale ]),
		];
		vecs.forEach((vec) => {
			const [ x, y, z ] = vec.rotateX(toRad(rx)).rotateY(toRad(ry));
			attr.push(x, y, z, r, g, b);
		});
		element.push(...[ 0, 2, 3, 0, 3, 1 ].map(val => val + base));
		++ nFaces;
	};
	const [ a, b, c ] = [ 0.2, 0.4, 0.8 ];
	addFace(0, 0, a, b, c);
	addFace(0, 1, b, a, c);
	addFace(0, 2, c, a, b);
	addFace(0, 3, b, c, a);
	addFace(1, 0, c, b, a);
	addFace(3, 0, a, c, b);
	return new Geometry({ attr, element, layout: [ 3, 3 ] });
};
