import * as Webgl2 from './webgl2.js';
import * as Shaders from './shaders.js';
import * as Geometries from './geometries.js';
import stars from './stars.js';
import { Camera } from './camera.js';
import { Mat4 } from './gl-math.js';

const cam = new Camera({ vFov: 45 });
const [ width, height ] = [ 800, 600 ];
const startTime = Date.now();
const hrzProg = new Webgl2.Program({
	vertexShader: Shaders.hrzVertex,
	fragShader:   Shaders.frag,
});
const celSphereProg = new Webgl2.Program({
	vertexShader: Shaders.celSphereVertex,
	fragShader: Shaders.frag,
});
const selectedStars = stars;
const celSphereMesh = {
	prog: celSphereProg,
	geometry: Geometries.celestialSphere(selectedStars),
	transform: new Mat4(),
	color: [ 1, 1, 1 ],
};
const hrzMesh = {
	prog: hrzProg,
	geometry: Geometries.horizon({ depth: 1, radius: 1 }),
	transform: new Mat4(),
	color: [ 0.05, 0.08, 0.15 ],
};
const drawMesh = (ctx, mesh) => {
	ctx.useProgram(mesh.prog);
	mesh.prog.setMat4Uniform('projection', cam.projection);
	mesh.prog.setMat4Uniform('transform', mesh.transform);
	mesh.prog.setVec3Uniform('color', mesh.color);
	ctx.drawGeometry(mesh.geometry);
};
const udpateCam = () => {
	const angle = (Date.now() - startTime)*1e-4;
	cam.vFov = 90;
	cam.transform.clear();
	cam.transform.translate([ 0, 0, 0 ]);
	cam.transform.rotateY(angle);
	hrzMesh.transform.clear().rotateY(angle);
	cam.update();
};
udpateCam();
document.body.appendChild(Webgl2.canvas);
Webgl2.setFrame(function(ctx) {
	udpateCam();
	drawMesh(ctx, hrzMesh);
	drawMesh(ctx, celSphereMesh);
});
Webgl2.resize(width, height);
