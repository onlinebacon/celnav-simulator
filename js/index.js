import stars from './stars.js';
import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import { Camera } from './webgl2/core/camera.js';

const angle = (deg) => deg*(Math.PI/180);

CelestialSphere.build(stars);
Horizon.build({ dip: angle(6.2/60) });

const [ width, height ] = [ 1200, 800 ];
const camera = new Camera({
	vFov: 45,
	ratio: width/height,
});

let azm = 0, alt = 15;

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
});

document.body.appendChild(Webgl2.canvas);

window.addEventListener('wheel', e => {
	let { vFov } = camera;
	const mag = e.deltaY >= 0 ? 1 : -1;
	vFov = Math.exp(Math.log(vFov) + mag*0.05);
	vFov = Math.max(30, Math.min(75, vFov));
	camera.vFov = vFov;
});

let startClick = null;

Webgl2.canvas.addEventListener('mousedown', e => {
	if (e.ctrlKey) return;
	if (e.shiftKey) return;
	if (e.altKey) return;
	if (e.button !== 0) return;
	const x = e.offsetX;
	const y = e.offsetY;
	const { vFov } = camera;
	const hFov = vFov*camera.ratio;
	startClick = { x, y, vFov, hFov, azm, alt };
});

Webgl2.canvas.addEventListener('mousemove', e => {
	const leftClick = e.buttons & 1;
	if (!leftClick) {
		startClick = null;
		return;
	}
	const x = e.offsetX;
	const y = e.offsetY;
	const dx = x - startClick.x;
	const dy = startClick.y - y;
	alt = Math.min(90, startClick.alt - dy/height*startClick.vFov);
	azm = (startClick.azm - dx/width*startClick.hFov + 360)%360;
});
