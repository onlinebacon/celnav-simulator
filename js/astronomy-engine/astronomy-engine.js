import Stars from '../db/stars.js';
import SunData from '../db/sun.js';
import Interpolator from './interpolator.js';

const sunInterpolator = new Interpolator(SunData);

const starInterpolators = Stars.map(star => {
	const interpolator = new Interpolator(star);
	return { star, interpolator };
});

const { PI } = Math;
const TAU = PI*2;

let TIME_OFFSET = 0;
let pausedSince = null;

const SID_DAY = 86164090.53820801;
const BASE_TIME = 1688189036000;

const fixLon = (lon) => (lon%TAU + TAU + PI)%TAU - PI;

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

export const getUnixTime = () => {
	return now()/1000;
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
	const lat = dec/180*PI;
	return [ lat, lon ];
};

export const getStars = (size) => {
	return starInterpolators.slice(0, size).map(item => {
		const { interpolator, star } = item;
		const { mag: vmag, bv } = star;
		const { ra, dec } = interpolator.raDecAt(getUnixTime());
		return { vmag, bv, ra, dec };
	});
};

export const setTime = (time) => {
	TIME_OFFSET = time - Date.now();
};

export const getSunRaDec = () => {
	return sunInterpolator.raDecAt(getUnixTime());
};

export const getSunGP = () => {
	const raDec = getSunRaDec();
	return getGP(raDec);
};
