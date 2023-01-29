import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import * as SextantScope from './webgl2/implementations/items/sextant-scope.js';
import * as AstronomyEngine from './astronomy-engine/astronomy-engine.js';
import { Camera } from './webgl2/core/camera.js';
import { Player } from './model/player.js';

let camera = new Camera();
let player = new Player();

export const setCamera = (c) => camera = c;
export const setPlayer = (p) => player = p;

const drawFixedItems = (ctx, camera, side) => {
	CelestialSphere.draw(ctx, camera, side);
	Horizon.draw(ctx, camera, side);
};

const drawAllItems = (ctx, camera, side) => {
    drawFixedItems(ctx, camera, side);
    SextantScope.draw(ctx, camera, side);
};

Webgl2.setFrame(function(ctx) {
	camera.transform.clear().rotateX(-player.alt).rotateY(player.azm);
	camera.vFov = player.vFov;
	camera.update();
	CelestialSphere.setOrientation({
		lat: player.lat,
		lon: player.lon,
		ariesGHA: AstronomyEngine.getCurrentAriesGHA(),
	});
    if (player.inOpenViewMode()) {
        ctx.fullMode();
        drawFixedItems(ctx, camera, 'C');
    }
    if (player.inSextantMode()) {
        ctx.leftMode();
        drawAllItems(ctx, camera, 'L');
        ctx.rightMode();
        drawAllItems(ctx, camera, 'R');
    }
});
