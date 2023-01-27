import { canvas } from './webgl2/core/webgl2.js';
import { Camera } from './webgl2/core/camera.js';
import { Player, OPEN_VIEW, SEXTANT_VIEW } from './model/player.js';

const toRad = (deg) => deg*(Math.PI/180);

let camera = new Camera();
let player = new Player();
let startClick = null;

const MAX_FOV_OPEN_VIEW = toRad(60);
const MIN_FOV_OPEN_VIEW = toRad(35);

export const setCamera = (c) => {
    camera = c;
};

export const setPlayer = (p) => {
    player = p;
};

window.addEventListener('wheel', e => {
	let vFov = camera.vFov;
	const mag = e.deltaY >= 0 ? 1 : -1;
	vFov = Math.exp(Math.log(vFov) + mag*0.1);
    switch (player.viewMode) {
        case OPEN_VIEW:
            vFov = Math.min(MAX_FOV_OPEN_VIEW, vFov);
            vFov = Math.max(MIN_FOV_OPEN_VIEW, vFov);
        break;
    }
	camera.vFov = vFov;
});

canvas.addEventListener('mousedown', e => {
    if (e.ctrlKey) return;
	if (e.shiftKey) return;
	if (e.altKey) return;
	if (e.button !== 0) return;
    const { azm, alt } = player;
	const x = e.offsetX;
	const y = e.offsetY;
	const vFov = camera.vFov;
	const hFov = vFov*camera.ratio;
	startClick = { x, y, vFov, hFov, azm, alt };
});

canvas.addEventListener('mousemove', e => {
	const leftClick = e.buttons & 1;
	if (!leftClick) {
		startClick = null;
		return;
	}
    const { width, height } = canvas;
	const x = e.offsetX;
	const y = e.offsetY;
	const dx = x - startClick.x;
	const dy = startClick.y - y;
	const D360 = toRad(360);
	const D90 = toRad(90);
	player.alt = Math.min(D90, startClick.alt - dy/height*startClick.vFov);
	player.azm = (startClick.azm - dx/width*startClick.hFov + D360)%D360;
});
