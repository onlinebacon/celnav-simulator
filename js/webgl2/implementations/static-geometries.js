import Constants from '../../constants.js';
import { Geometry } from '../core/webgl2.js';

const buildSextantScope = () => {
	const element = [];
	const n = 32;
	const radius = 0.9;
	const z = -1;
	const color = [ 0, 0, 0 ];
	const attr = [];
	const size_x = 5;
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

const buildAtmosphere = () => {
	const attr = [];
	const element = [];
	const nRings = 30;
	const nSegments = 60;
	const maxZenith = Math.PI/2 + Constants.MAX_DIP;
	const atmosphereRadius = Constants.ATMOSPHERE_RAD;
	for (let i=1; i<=nRings; ++i) {
		const zenith = i/nRings*maxZenith;
		const alt = Math.PI/2 - zenith;
		const yRad = Math.sin(zenith)*atmosphereRadius;
		const y = Math.cos(zenith)*atmosphereRadius;
		for (let j=0; j<nSegments; ++j) {
			const azm = j/nSegments*Math.PI*2;
			const x = Math.sin(azm)*yRad;
			const z = Math.cos(azm)*yRad;
			attr.push(x, y, z, azm, alt);
		}
	}
	for (let i=1; i<nRings; ++i) {
		const c1 = (i - 1)*nSegments;
		const c2 = (i - 0)*nSegments;
		for (let j=0; j<nSegments; ++j) {
			const inc0 = j;
			const inc1 = (j + 1)%nSegments;
			const a = c1 + inc0;
			const b = c1 + inc1;
			const c = c2 + inc0;
			const d = c2 + inc1;
			element.push(a, b, c);
			element.push(b, d, c);
		}
	}
	const total = nSegments*nRings;
	attr.push(0, atmosphereRadius, 0, 0, Math.PI/2);
	for (let i=0; i<nSegments; ++i) {
		const j = (i + 1)%nSegments;
		element.push(total, j, i);
	}
	return new Geometry({ attr, element, layout: [ 3, 1, 1 ] });
};

export const sextantScope = buildSextantScope();
export const atmosphere = buildAtmosphere();
