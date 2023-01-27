import stars from './stars.js';
import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import * as AstronomyEngine from './astronomy-engine.js';
import * as Control from './control.js';
import { Camera } from './webgl2/core/camera.js';
import { Player } from './model/player.js';

const toRad = (deg) => deg*(Math.PI/180);

const camera = new Camera({ vFov: toRad(45) });
const player = new Player();
player.alt = toRad(15);

Control.setCamera(camera);
Control.setPlayer(player);

CelestialSphere.build(stars);
Horizon.build({ dip: toRad(6.2/60) });

Webgl2.setFrame(function(ctx) {
	camera.transform.clear()
	.rotateX(-player.alt)
	.rotateY(player.azm);
	camera.update();
	CelestialSphere.setOrientation({
		lat: player.lat,
		lon: player.lon,
		ariesGHA: AstronomyEngine.getCurrentAriesGHA(),
	});
	CelestialSphere.draw(ctx, camera);
	Horizon.draw(ctx, camera);
});

const handleResize = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	camera.ratio = width/height;
	Webgl2.resize(width, height);
};

document.body.appendChild(Webgl2.canvas);
window.addEventListener('resize', handleResize);

handleResize();
