import stars from './stars.js';
import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import * as SextantScope from './webgl2/implementations/items/sextant-scope.js';
import { Camera } from './webgl2/core/camera.js';

CelestialSphere.build(stars);
Horizon.build({ dip: 0 });

const angle = (deg) => deg*(Math.PI/180);
const [ width, height ] = [ 800, 600 ];
const camera = new Camera({
	vFov: 45,
	ratio: width/height,
});

let azm = 0, alt = 0;

Webgl2.resize(width, height);
Webgl2.setFrame(function(ctx) {
	camera.transform.clear()
	.rotateX(angle(-alt))
	.rotateY(angle(azm));
	camera.update();
	CelestialSphere.setOrientation({
		lat: 0,
		lon: 0,
		ariesGHA: Date.now()*0.00001,
	});
	CelestialSphere.draw(ctx, camera);
	Horizon.draw(ctx, camera);
	SextantScope.draw(ctx, camera);
});

document.body.appendChild(Webgl2.canvas);

window.addEventListener('wheel', e => {
	let { vFov } = camera;
	const mag = e.deltaY >= 0 ? 1 : -1;
	vFov = Math.exp(Math.log(vFov) + mag*0.05);
	vFov = Math.max(0.01, Math.min(110, vFov));
	camera.vFov = vFov;
});

window.addEventListener('keydown', e => {
	const { key } = e;
	const { vFov } = camera;
	const inc = vFov*0.01;
	if (/^(arrow)?up$/i.test(key)) {
		alt = Math.min(90, alt + inc);
	}
	if (/^(arrow)?down$/i.test(key)) {
		alt = Math.max(0, alt - inc);
	}
	if (/^(arrow)?right$/i.test(key)) {
		azm = (azm + inc)%360;
	}
	if (/^(arrow)?left$/i.test(key)) {
		azm = (azm - inc + 360)%360;
	}
});
