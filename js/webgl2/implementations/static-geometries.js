import { Geometry } from '../core/webgl2.js';

const buildSextantScope = () => {
	const element = [];
	const n = 32;
	const radius = 0.9;
	const z = -1;
	const color = [ 0, 0, 0 ];
	const attr = [];
	const size_x = 2;
	const size_y = 1;
	for (let i=0; i<=n; ++i) {
		const angle = i/n*Math.PI;
		const x = Math.sin(angle)*radius;
		const y = Math.cos(angle)*radius;
		attr.push(-size_x, y, z, ...color);
		attr.push(     -x, y, z, ...color);
		attr.push(      x, y, z, ...color);
		attr.push( size_x, y, z, ...color);
		if (i) {
			const s = (i - 1)*4;
			element.push(s, s + 1, s + 4);
			element.push(s + 4, s + 1, s + 5);
			element.push(s + 2, s + 3, s + 6);
			element.push(s + 6, s + 3, s + 7);
		}
	}
	const s = (n + 1)*4;
	attr.push(-size_x,  size_y, z, ...color);
	attr.push( size_x,  size_y, z, ...color);
	attr.push(-size_x, -size_y, z, ...color);
	attr.push( size_x, -size_y, z, ...color);
	element.push(s, s + 1, 0);
	element.push(0, s + 1, 3);
	element.push(s - 4, s - 1, s + 2);
	element.push(s + 2, s - 1, s + 3);
	return new Geometry({
		attr, element,
		layout: [ 3, 3 ],
	});
};

export const sextantScope = buildSextantScope();
