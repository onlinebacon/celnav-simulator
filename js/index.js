import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import * as AstronomyEngine from './astronomy-engine/astronomy-engine.js';
import * as Control from './control.js';
import * as Scene from './scene.js';
import * as Randomizer from './randomizer/randomizer.js';

import calcDip from './support/calc-dip.js';

import { Camera } from './webgl2/core/camera.js';
import { Player } from './model/player.js';

const toRad = (deg) => deg*(Math.PI/180);

const camera = new Camera({ vFov: toRad(45) });
const player = new Player();
player.alt = toRad(15);

Control.setCamera(camera);
Control.setPlayer(player);

Scene.setCamera(camera);
Scene.setPlayer(player);

CelestialSphere.build(AstronomyEngine.getStars(1600));
Horizon.build({ dip: calcDip(player.height) });

Randomizer.randomizeSetup(player);

const handleResize = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	camera.ratio = width/height;
	Webgl2.resize(width, height);
};

document.body.appendChild(Webgl2.canvas);
window.addEventListener('resize', handleResize);

handleResize();
