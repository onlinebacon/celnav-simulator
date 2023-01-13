import {
	rotateMat3X,
	rotateMat3Y,
	rotateVec3X,
	rotateVec3Y,
} from './vec-mat.js';

const width = 800;
const height = 600;
const canvas = document.createElement('canvas');

document.body.appendChild(canvas);
canvas.width = width;
canvas.height = height;
let ratio = width/height;
const gl = canvas.getContext('webgl2');

let vFov;
let yViewSlope;
let xViewSlope;
const setVFov = (deg) => {
	vFov = deg;
	vFov = Math.min(90, vFov);
	const rad = deg/180*Math.PI;
	yViewSlope = Math.tan(rad/2);
	xViewSlope = yViewSlope*ratio;
};

setVFov(70);

const sky_orientation = window.sky_orientation = [
	1, 0, 0,
	0, 1, 0,
	0, 0, 1,
];

const shaderSrc = {
	star_vertex: `
		#version 300 es
		precision highp float;
		uniform mat3 sky_orientation;
		uniform float screen_ratio;
		uniform float star_scale;
		uniform vec3 star_dir;
		uniform vec2 view_slope;
		layout (location = 0) in vec2 vertex_coord;
		void main() {
			vec2 vertex = vertex_coord*star_scale;
			vec3 dir = star_dir*sky_orientation;
			if (dir.z > 0.0) {
				gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
				return;
			}
			float x = dir.x/(-dir.z*view_slope.x) + vertex.x/screen_ratio;
			float y = dir.y/(-dir.z*view_slope.y) + vertex.y;
			gl_Position = vec4(x, y, 0.0, 1.0);
		}
	`,
	star_frag: `
		#version 300 es
		precision highp float;
		uniform vec3 star_color;
		out vec4 FragColor;
		void main() {
			FragColor = vec4(star_color, 1.0);
		}
	`,
};

const compileShader = (src, type) => {
	src = src.replace(/\s*\n\s*/g, '\n').trim();
	const shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	const log = gl.getShaderInfoLog(shader);
	if (log) throw new Error(log);
	return shader;
};

const shaderMap = {
	star_vertex: compileShader(shaderSrc.star_vertex, gl.VERTEX_SHADER),
	star_frag:   compileShader(shaderSrc.star_frag, gl.FRAGMENT_SHADER),
};

const buildProgram = (vertexShader, fragShader) => {
	const glRef = gl.createProgram();
	gl.attachShader(glRef, vertexShader);
	gl.attachShader(glRef, fragShader);
	gl.linkProgram(glRef);
	return { glRef, uniformMap: {} };
};

const buildGeometry = ({ attr, element, layout }) => {
	const glRef = gl.createVertexArray();	
	const attrBuff = gl.createBuffer();
	const elementBuff = gl.createBuffer();
	const BPE = Float32Array.BYTES_PER_ELEMENT;
	const size = layout.reduce((a, b) => a + b, 0);
	const stride = size*BPE;
	gl.bindVertexArray(glRef);
	gl.bindBuffer(gl.ARRAY_BUFFER, attrBuff);
	gl.bufferData(gl.ARRAY_BUFFER, attr, gl.STATIC_DRAW);
	let sum = 0;
	layout.forEach((size, i) => {
		gl.vertexAttribPointer(i, size, gl.FLOAT, false, stride, sum);
		sum += size*BPE;
	});
	layout.forEach((_, i) => gl.enableVertexAttribArray(i));
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuff);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, element, gl.STATIC_DRAW);
	return { glRef, element };
};

const useProgram = (program) => gl.useProgram(program.glRef);

const clear = () => {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};

const drawGeometry = ({ glRef, element }) => {
	gl.bindVertexArray(glRef);
	gl.drawElements(gl.TRIANGLES, element.length, gl.UNSIGNED_BYTE, 0);
};

const getUniformLoc = (prog, name) => prog.uniformMap[name] ?? (
	prog.uniformMap[name] = gl.getUniformLocation(prog.glRef, name)
);

const setFloatUniform = (prog, name, value) => {
	gl.uniform1f(getUniformLoc(prog, name), value);
};

const setVec3Uniform = (prog, name, value) => {
	gl.uniform3fv(getUniformLoc(prog, name), value);
};

const setVec2Uniform = (prog, name, value) => {
	gl.uniform2fv(getUniformLoc(prog, name), value);
};

const setMat3Uniform = (prog, name, value) => {
	gl.uniformMatrix3fv(getUniformLoc(prog, name), true, value);
}

const init = () => {
	gl.enable(gl.DEPTH_TEST);
	gl.viewport(0, 0, width, height);
	gl.clearColor(0.05, 0.05, 0.10, 1);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
};

const buildStarGeometry = () => {
	const n = 4;
	const r1 = 0.015;
	const r0 = r1*0.3;
	const attr = [];
	const element = [];
	const step = Math.PI*2/(n*2);
	for (let i=0; i<n; ++i) {
		const angle = step*i*2;
		attr.push(Math.sin(angle)*r1, Math.cos(angle)*r1);
		attr.push(Math.sin(angle + step)*r0, Math.cos(angle + step)*r0);
		element.push(i*2, i*2 + 1, (i + n - 1)%n*2 + 1);
		element.push(i*2 + 1, (i + n - 1)%n*2 + 1, n*2);
	}
	attr.push(0, 0, 0, 0.5, 1);
	return buildGeometry({
		attr: new Float32Array(attr),
		element: new Uint8Array(element),
		layout: [ 2 ],
	});
};

const buildStar = (ra, dec, mag, bv) => {
	ra = ((ra + 12)%24 - 12)/12*Math.PI;
	dec = dec/180*Math.PI;
	const dir = [ 0, 0, 1 ];
	rotateVec3X(dir, dec, dir);
	rotateVec3Y(dir, -ra, dir);
	const twinkle = Math.random() + 1;
	return { twinkle, dir, mag, color: [ 1, 1, 1 ] };
};

const base_mag = -1.45;
const base_scale = 1;
const magToRad = (mag) => Math.pow(Math.pow(2.512, base_mag - mag), 0.25)*base_scale;

init();

const starGeometry = buildStarGeometry();
const starProg = buildProgram(shaderMap.star_vertex, shaderMap.star_frag);
useProgram(starProg);
setFloatUniform(starProg, 'screen_ratio', ratio);
setFloatUniform(starProg, 'star_scale', 1);

const tm = (h, m, s) => h + m/60 + s/3600;
const stars = [

	// Pisces
	[ tm(23, 18, 21.02), tm(3, 24, 28.6), 3.7, 0.92 ],
	[ tm(23, 43, 12.86), tm(1, 54, 21.7), 4.45, 0.19 ],
	[ tm(23, 28, 6.26), tm(1, 22, 51.6), 4.95, 0.04 ],
	[ tm(23, 41, 7.66), tm(5, 45, 2.4), 4.10, 0.51 ],
	[ tm(23, 29, 7.68), tm(6, 30, 18.2), 4.25, 1.07 ],
	[ tm(0, 0, 29.27), tm(6, 59, 25.4), 4.0, 0.41 ],
	[ tm(0, 21, 46.67), tm(8, 19, 4.0), 5.35, 1.36 ],

].map(radec => buildStar(...radec));

const frame = () => {
	clear();
	setVec2Uniform(starProg, 'view_slope', [ xViewSlope, yViewSlope ]);
	setMat3Uniform(starProg, 'sky_orientation', sky_orientation);
	const t = new Date();
	const zoom_scale = 1/yViewSlope;
	stars.forEach(star => {
		const { twinkle, dir, mag, color } = star;
		const rad = magToRad(mag);
		const oscilation = 1 + Math.sin(t/(500*twinkle))*0.1;
		const scale = oscilation*rad*zoom_scale;
		setFloatUniform(starProg, 'star_scale', scale);
		setVec3Uniform(starProg, 'star_dir', dir);
		setVec3Uniform(starProg, 'star_color', color);
		drawGeometry(starGeometry);
	});
};

window.onkeydown = (e) => {
	const key = e.key.toLowerCase().replace(/arrow/, '');
	const angle = 0.05*yViewSlope;
	if (key === 'right') {
		rotateMat3Y(sky_orientation, -angle, sky_orientation);
	}
	if (key === 'left') {
		rotateMat3Y(sky_orientation, angle, sky_orientation);
	}
	if (key === 'up') {
		rotateMat3X(sky_orientation, angle, sky_orientation);
	}
	if (key === 'down') {
		rotateMat3X(sky_orientation, -angle, sky_orientation);
	}
};

window.onwheel = (e) => {
	const sign = e.deltaY/Math.abs(e.deltaY);
	if (isNaN(sign)) return;
	setVFov((1 + sign*0.01)*vFov);
};

const frameLoop = () => {
	frame();
	requestAnimationFrame(frameLoop);
};
frameLoop();
