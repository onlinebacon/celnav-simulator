import { Geometry } from './webgl2.js';

export const horizon = ({ radius, depth }) => {
	const attr = [ 0, -depth, 0 ];
	const element = [];
	const n = 200;
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
