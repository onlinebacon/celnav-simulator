import { canvas } from './webgl2/core/webgl2.js';
import { Camera } from './webgl2/core/camera.js';
import { Player, OPEN_VIEW, SEXT_VIEW } from './model/player.js';
import { haversine } from './support/coord-math.js';
import * as DialogWindow from './dialog-window/dialog-window.js';
import Constants from './constants.js';

const toRad = (deg) => deg*(Math.PI/180);

let camera = new Camera();
let player = new Player();
let startClick = null;

const openRange = [ 0.5, 1.0 ];
const sextRange = [ 0.1, 0.2 ];
const minVFovMap = {
	[OPEN_VIEW]: openRange[0],
	[SEXT_VIEW]: sextRange[0],
};
const maxVFovMap = {
	[OPEN_VIEW]: openRange[1],
	[SEXT_VIEW]: sextRange[1],
};
const MIN_ALT = - Math.PI/4;

const getAverageVFov = (type) => {
	const min = minVFovMap[type];
	const max = maxVFovMap[type];
	return (min + max)/2;
};

export const setCamera = (c) => {
    camera = c;
};

export const setPlayer = (p) => {
    player = p;
	player.vFovMap[OPEN_VIEW] = getAverageVFov(OPEN_VIEW);
	player.vFovMap[SEXT_VIEW] = getAverageVFov(SEXT_VIEW);
};

window.addEventListener('wheel', e => {
	let { vFov, viewMode } = player;
	const mag = e.deltaY >= 0 ? 1 : -1;
	vFov = Math.exp(Math.log(vFov) + mag*0.1);
	const max = maxVFovMap[viewMode];
	const min = minVFovMap[viewMode];
	vFov = Math.min(max, vFov);
	vFov = Math.max(min, vFov);
	player.vFov = vFov;
});

window.addEventListener('keypress', e => {
	const key = e.key.toUpperCase();
	if (key === 'S') {
		player.toggleMode();
	}
});

canvas.addEventListener('contextmenu', e => {
	if (!e.ctrlKey) return;
	e.preventDefault();
	e.stopPropagation();
});

canvas.addEventListener('mousedown', e => {
	const { ctrlKey, shiftKey, altKey } = e;
	if (e.button !== 0) return;
    const { azm, alt } = player;
	const x = e.offsetX;
	const y = e.offsetY;
	const vFov = camera.vFov;
	const hFov = vFov*camera.ratio;
	if (e.ctrlKey) {
		e.preventDefault();
		e.stopPropagation();
	}
	startClick = {
		x, y,
		vFov, hFov,
		azm, alt,
		ctrlKey,
		shiftKey,
		altKey,
		sextantAngle: player.sextantAngle,
	};
});

canvas.addEventListener('mousemove', e => {
	const leftClick = e.buttons & 1;
	if (!leftClick) {
		startClick = null;
		return;
	}
	if (!startClick) return;
    const { width, height } = canvas;
	const x = e.offsetX;
	const y = e.offsetY;
	const dx = x - startClick.x;
	const dy = startClick.y - y;
	const D360 = toRad(360);
	const D90 = toRad(90);

	const hrzRate = startClick.hFov;
	player.azm = (startClick.azm - dx/width*hrzRate + D360)%D360;

	const vrtRate = - startClick.hFov;
	const altInc = dy/height*vrtRate;
	if (player.inSextantMode() && e.ctrlKey) {
		player.sextantAngle = startClick.sextantAngle + altInc*0.75;
	} else {
		player.alt = Math.max(MIN_ALT, Math.min(startClick.alt + altInc, D90));
	}
});

document.querySelector('#submit_button').addEventListener('click', async () => {
	const coord = await DialogWindow.submitCoord();
	if (!coord) {
		return;
	}
	const target = [ player.lat, player.lon ];
	const distance = haversine(coord, target)*Constants.EARTH_RADIUS/Constants.MILE;
	const short = (distance.toPrecision(3)*1).toFixed(1)*1;
	const text = `Your fix is off by ${short <= 6 ? 'only ' : ''} miles`;
	DialogWindow.inform(text);
});
