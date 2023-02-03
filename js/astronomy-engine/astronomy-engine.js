import interpolateCoords from  '../support/interpolate-coords.js';
import Stars from '../db/stars.js';
import Sun from '../db/sun.js';

const { PI } = Math;
const TAU = PI*2;

let TIME_OFFSET = 0;

const SID_DAY = 86164090.53820801;
const BASE_TIME = 1688189036000;

const decToLat = (deg) => deg*(PI/180);
const latToDec = (rad) => rad*(180/PI);
const raToLon = (ra) => (ra*(PI/12) + PI)%TAU - PI;
const lonToRa = (rad) => (rad*(12/PI) + TAU)%TAU;

const interpolate = ({ t0, t1, t, v0, v1 }) => {
	return (t - t0)/(t1 - t0)*(v1 - v0) + v0;
};

const raDecToCoord = ({ ra, dec }) => [
	decToLat(dec),
	raToLon(ra),
];

export const now = () => {
	return new Date(Date.now() + TIME_OFFSET);
};

export const getCurrentAriesGHA = () => {
	const timeOffset = now() - BASE_TIME;
	const angleOffset = timeOffset/SID_DAY*TAU;
	const trucnatedAngle = angleOffset%TAU;
	const positive = (trucnatedAngle + TAU)%TAU;
	return positive;
};

export const getStars = (size) => {
	return Stars.slice(0, size);
};

export const setTime = (time) => {
	TIME_OFFSET = time - Date.now();
};

export const getSunRaDecAt = (time) => {
	const unixTime = time/1000;
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
	const [ lat, lon ] = interpolateCoords(raDecToCoord(a), raDecToCoord(b), val);
	const ra = lonToRa(lon);
	const dec = latToDec(lat);
	return { ra, dec };
};
