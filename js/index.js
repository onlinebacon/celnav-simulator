import * as Webgl2 from './webgl2.js';
import * as Shaders from './shaders.js';
import * as Geometries from './geometries.js';

import stars from './stars.js';
import { Camera } from './camera.js';
import { Mat4 } from './gl-math.js';

let usrAlt = 0;
let lat = 20*(Math.PI/180);
let alt = 30*(Math.PI/180);
let azm = +0*(Math.PI/180);

const [ width, height ] = [ 600, 600 ];

const prog = new Webgl2.Program({
	vertexShader: Shaders.vertex,
	fragShader:   Shaders.frag,
});

const starGeometry = Geometries.star(8);
const base_mag = -1.45;
const base_rad = 0.005;
const magToRad = (mag) => Math.pow(Math.pow(2.512, base_mag - mag), 0.25)*base_rad;

const buildStar = (star) => {
	const geometry = starGeometry;
	const color = [ 1, 1, 1 ];
	const transform = new Mat4();
	const raAng = star.ra/12*Math.PI;
	const decAng = star.dec/180*Math.PI;
	const rad = magToRad(star.vmag);
	transform.scaleTransform(rad);
	transform.rotateX(Math.PI*0.5);
	transform.translate([ 0, 1, 0 ]);
	transform.rotateX(decAng);
	transform.rotateZ(-raAng);
	return { geometry, color, transform };
};

const cam = new Camera({ vFov: 90 });

const selectedStars = stars.slice(0, 500);
const starMeshes = selectedStars.map(buildStar);
const horizonGeometry = Geometries.horizon({
	depth: 0.9,
	radius: 0.9,
});

const identity = new Mat4();
const hrzTransform = new Mat4();
const locTime = new Mat4();

const t0 = Date.now();
const renderSight = (ctx, side = 0) => {
	const skyRot = 220*(Math.PI/180) + (Date.now() - t0)*Math.PI*2/(23.93*3600*100);
	ctx.useProgram(prog);
	prog.setFloatUniform('side', side);
	prog.setMat4Uniform('projection', cam.projection);
	prog.setMat4Uniform('locTime', identity);
	prog.setMat4Uniform('transform', hrzTransform);
	prog.setVec3Uniform('color', [ 0.05, 0.08, 0.15 ]);
	ctx.drawGeometry(horizonGeometry);
	locTime.clear().rotateZ(skyRot).rotateX(-lat);
	for (const { geometry, color, transform } of starMeshes) {
		prog.setMat4Uniform('locTime', locTime);
		prog.setVec3Uniform('color', color);
		prog.setMat4Uniform('transform', transform);
		ctx.drawGeometry(geometry);
	}
};

Webgl2.setFrame(function(ctx) {
	alt = usrAlt;
	udpateCam();
	renderSight(ctx, -1);
	alt = 0;
	udpateCam();
	renderSight(ctx, 1);
});

Webgl2.resize(width, height);
document.body.appendChild(Webgl2.canvas);

const udpateCam = () => {
	cam.transform.clear();
	hrzTransform.clear();
	cam.transform.rotateX(-alt);
	cam.transform.rotateY(azm);
	hrzTransform.rotateY(azm);
	cam.update();
};

window.addEventListener('keydown', e => {
	const key = e.key.toLowerCase().replace(/arrow/, '');
	const inc = 0.0001*cam.vFov;
	if (key === 'up') {
		usrAlt = Math.min(Math.PI*0.25, usrAlt + inc);
	} else if (key === 'down') {
		usrAlt = Math.max(0, usrAlt - inc);
	} else if (key === 'right') {
		azm = (azm + inc)%(Math.PI*2);
	} else if (key === 'left') {
		azm = (azm + Math.PI*2 - inc)%(Math.PI*2);
	}
	console.log((usrAlt/Math.PI*180).toFixed(1)*1);
	udpateCam();
});

window.addEventListener('wheel', e => {
	cam.vFov = Math.max(1, Math.min(120, cam.vFov + e.deltaY));
});

udpateCam();
