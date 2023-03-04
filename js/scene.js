import * as Webgl2 from './webgl2/core/webgl2.js';
import * as CelestialSphere from './webgl2/implementations/items/celestial-sphere.js';
import * as Horizon from './webgl2/implementations/items/horizon.js';
import * as SextantScope from './webgl2/implementations/items/sextant-scope.js';
import * as Atmosphere from './webgl2/implementations/items/atmosphere.js';
import * as MilkyWay from './webgl2/implementations/items/milky-way.js';
import * as AstronomyEngine from './astronomy-engine/astronomy-engine.js';
import * as ScreenInfo from './screen-info/screen-info.js';
import { Camera } from './webgl2/core/camera.js';
import { Player } from './model/player.js';
import Constants from './constants.js';

let camera = new Camera();
let player = new Player();

Webgl2.setBackgroundColor(Constants.BG_COLOR);

export const setCamera = (c) => camera = c;
export const setPlayer = (p) => player = p;

const drawFixedItems = (ctx, camera, side) => {
    MilkyWay.draw(ctx, camera, side);
    CelestialSphere.draw(ctx, camera, side);
    Atmosphere.draw(ctx, camera, side);
	Horizon.draw(ctx, camera, side);
};

const drawAllItems = (ctx, camera, side) => {
    drawFixedItems(ctx, camera, side);
    SextantScope.draw(ctx, camera, side);
};

const updateCamera = (alt) => {
	camera.transform.clear().rotateX(-alt).rotateY(player.azm);
	camera.vFov = player.vFov;
	camera.update();
	CelestialSphere.setOrientation({
		lat: player.lat,
		lon: player.lon,
		ariesGHA: AstronomyEngine.getCurrentAriesGHA(),
	});
    MilkyWay.setTransform(CelestialSphere.transform);
};

Webgl2.setFrame(function(ctx) {
    updateCamera(player.alt);
    if (player.inOpenViewMode()) {
        ctx.fullMode();
        drawFixedItems(ctx, camera, 'C');
    }
    if (player.inSextantMode()) {
        ctx.leftMode();
        drawAllItems(ctx, camera, 'L');

        updateCamera(player.alt + player.sextantAngle);
        ctx.rightMode();
        drawAllItems(ctx, camera, 'R');
    }
    ScreenInfo.setPlayerInfo(player);
});
