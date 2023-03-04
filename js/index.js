import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import * as AstronomyEngine from './astronomy-engine/astronomy-engine.js';
import * as Control from './control.js';
import * as Scene from './scene.js';
import * as Randomizer from './randomizer/randomizer.js';
import * as Textures from './webgl2/implementations/textures.js';
import { encodeTimeLoc, decodeTimeLoc } from './support/time-loc-encoder.js';

import calcDip from './support/calc-dip.js';

import { Camera } from './webgl2/core/camera.js';
import { Player } from './model/player.js';
import queryParser from './support/query-parser.js';

const toRad = (deg) => deg*(Math.PI/180);

const camera = new Camera({ vFov: toRad(45) });
const player = new Player();
player.alt = toRad(15);

Control.setCamera(camera);
Control.setPlayer(player);

Scene.setCamera(camera);
Scene.setPlayer(player);

Horizon.build({ dip: calcDip(player.height) });

const handleResize = () => {
	const width = window.innerWidth;
	const height = window.innerHeight;
	camera.ratio = width/height;
	Webgl2.resize(width, height);
};

const putEncodedStateInURL = () => {
	const { lat, lon } = player;
	const loc = [ lat, lon ];
	const unixTime = AstronomyEngine.getUnixTime();
	const encoded = encodeTimeLoc(unixTime, loc);
	const path = window.location.href.replace(/^.*\/\/[^\/]*/, '');
	const newPath = path.replace(/\?.*|$/, '?init=' + encoded);
	history.pushState({}, null, newPath);
};

const getEncodedStateFromURL = () => {
	const query = window.location.href.replace(/^[^\?]*\??/, '');
	if (!query) return null;
	const params = queryParser(query);
	return params.init ?? null;
};

export const setupObserver = async () => {
	const encoded = getEncodedStateFromURL();
	if (encoded) {
		const [ timestamp, [ lat, lon ] ] = decodeTimeLoc(encoded);
		const date = new Date(timestamp*1000);
		AstronomyEngine.setTime(date);
		player.lat = lat;
		player.lon = lon;
	} else {
		await Randomizer.randomizeSetup(player);
		putEncodedStateInURL();
	}
};

const init = async () => {
	await Promise.all([
		setupObserver(),
		Textures.load(),
	]);
	document.body.appendChild(Webgl2.canvas);
	CelestialSphere.build(AstronomyEngine.getStars(1600));
	Webgl2.start();
};

window.addEventListener('resize', handleResize);

handleResize();

init().catch(err => {
	alert('Oops! Something wen\'t wrong. Please try refreshing the page');
});
