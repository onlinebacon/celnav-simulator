import { interpolateCoords } from '../support/coord-math.js';
import Stars from '../db/stars.js';
import Sun from '../db/sun.js';

const { PI } = Math;
const TAU = PI*2;

let TIME_OFFSET = 0;
let pausedSince = null;

const SID_DAY = 86164090.53820801;
const BASE_TIME = 1688189036000;

const fixLon = (lon) => (lon%TAU + TAU + PI)%TAU - PI;

const decToLat = (dec) => dec*(PI/180);
const raToLon = (ra) => (ra*(PI/12) + PI)%TAU - PI;

const latToDec = (lat) => lat*(180/PI);
const lonToRa = (lon) => ((lon + TAU)%TAU)*(12/PI);

const raDecToCoord = ({ ra, dec }) => [
	decToLat(dec),
	raToLon(ra),
];

const coordToRaDec = ([ lat, lon ]) => {
	const ra = lonToRa(lon);
	const dec = latToDec(lat);
	return { ra, dec };
};

export const pause = () => {
	pausedSince = Date.now();
};

export const unpause = () => {
	TIME_OFFSET -= Date.now() - pausedSince;
	pausedSince = null;
};

export const now = () => {
	if (pausedSince !== null) {
		return new Date(pausedSince + TIME_OFFSET);
	}
	return new Date(Date.now() + TIME_OFFSET);
};

export const getCurrentAriesGHA = () => {
	const timeOffset = now() - BASE_TIME;
	const angleOffset = timeOffset/SID_DAY*TAU;
	const trucnatedAngle = angleOffset%TAU;
	const positive = (trucnatedAngle + TAU)%TAU;
	return positive;
};

export const getGP = ({ ra, dec }) => {
	const ariesGHA = getCurrentAriesGHA();
	const lon = fixLon(ra/12*PI - ariesGHA);
	const lat = decToLat(dec);
	return [ lat, lon ];
};

export const getStars = (size) => {
	return Stars.slice(0, size);
};

export const setTime = (time) => {
	TIME_OFFSET = time - Date.now();
};

export const getSunRaDec = () => {
	const unixTime = now()/1000;
	let i = 0;
	let j = Sun.length;
	while (j - i > 1) {
		const m = (i + j) >> 1;
		const { t } = Sun[m];
		if (unixTime < t) {
			j = m;
		} else {
			i = m;
		}
	}
	const a = Sun[i];
	const b = Sun[j];
	const t0 = a.t;
	if (unixTime < t0 || b == null) {
		return null;
	}
	const t1 = b.t;
	const val = (unixTime - t0)/(t1 - t0);
	return coordToRaDec(interpolateCoords(raDecToCoord(a), raDecToCoord(b), val));
};

export const getSunGP = () => {
	const raDec = getSunRaDec();
	return getGP(raDec);
};
