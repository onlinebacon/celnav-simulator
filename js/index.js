import * as Webgl2 from './webgl2.js';
import * as Shaders from './shaders.js';
import * as Geometries from './geometries.js';

import { Camera } from './camera.js';
import { Mat4 } from './gl-math.js';

const [ width, height ] = [ 600, 600 ];
const prog = new Webgl2.Program({
	vertexShader: Shaders.vertex,
	fragShader:   Shaders.frag,
});

const triangles = [{
	geometry: Geometries.cube(1),
	transform: new Mat4().translate([ 0, 0, 0 ]),
}];

const cam = new Camera();
const t0 = Date.now();
Webgl2.setFrame(function(ctx) {
	const t = Date.now() - t0;
	const angle = t*0.001;
	ctx.useProgram(prog);
	cam.transform
		.clear()
		.translate([ 0, 0, -3 ])
		.rotateX(Math.PI*0.125)
		.rotateY(angle);
	cam.update();
	prog.setMat4Uniform('projection', cam.projection);
	for (const triangle of triangles) {
		prog.setMat4Uniform('transform', triangle.transform);
		ctx.drawGeometry(triangle.geometry);
	}
});

Webgl2.resize(width, height);

document.body.appendChild(Webgl2.canvas);
