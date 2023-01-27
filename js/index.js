import stars from './stars.js';
import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import * as AstronomyEngine from './astronomy-engine.js';
import { Camera } from './webgl2/core/camera.js';

document.body.appendChild(Webgl2.canvas);

const toRad = (deg) => deg*(Math.PI/180);

let width;
let height;
let startClick = null;

let azm = 0;
let alt = toRad(15);
let lat = 0;
let lon = 0;

CelestialSphere.build(stars);
Horizon.build({ dip: toRad(6.2/60) });

const camera = new Camera({ vFov: toRad(45) });

Webgl2.setFrame(function(ctx) {
	camera.transform.clear()
	.rotateX(-alt)
	.rotateY(azm);
	camera.update();
	CelestialSphere.setOrientation({
		lat, lon,
		ariesGHA: AstronomyEngine.getCurrentAriesGHA(),
	});
	CelestialSphere.draw(ctx, camera);
	Horizon.draw(ctx, camera);
});

window.addEventListener('wheel', e => {
	let vFov = camera.vFov;
	const mag = e.deltaY >= 0 ? 1 : -1;
	vFov = Math.exp(Math.log(vFov) + mag*0.1);
	vFov = Math.max(toRad(35), Math.min(toRad(60), vFov));
	camera.vFov = vFov;
});

Webgl2.canvas.addEventListener('mousedown', e => {
	if (e.ctrlKey) return;
	if (e.shiftKey) return;
	if (e.altKey) return;
	if (e.button !== 0) return;
	const x = e.offsetX;
	const y = e.offsetY;
	const vFov = camera.vFov;
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
	const D360 = toRad(360);
	const D90 = toRad(90);
	alt = Math.min(D90, startClick.alt - dy/height*startClick.vFov);
	azm = (startClick.azm - dx/width*startClick.hFov + D360)%D360;
});

const handleResize = () => {
	width = window.innerWidth;
	height = window.innerHeight;
	camera.ratio = width/height;
	Webgl2.resize(width, height);
};

window.addEventListener('resize', handleResize);

handleResize();
