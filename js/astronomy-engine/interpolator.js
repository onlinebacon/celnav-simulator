import { interpolateCoords } from '../support/coord-math.js';

const { PI } = Math;
const TAU = PI*2;

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

export const interpolateRaDec = (raDec1, raDec2, value) => {
    const coord1 = raDecToCoord(raDec1);
    const coord2 = raDecToCoord(raDec2);
    const coord = interpolateCoords(coord1, coord2, value);
    return coordToRaDec(coord);
};

export default class Interpolator {
    constructor({ startTime, interval, raList, decList }) {
        this.startTime = startTime;
        this.interval = interval;
        this.raList = raList;
        this.decList = decList;
        this.dataLength = raList.length;
        this.nIntervals = this.dataLength - 1;
        this.endTime = startTime + interval*this.nIntervals;
    }
    raDecAt(unixTime) {
        const {
            startTime, endTime,
            raList, decList,
            interval, nIntervals,
        } = this;
        if (unixTime < startTime) throw new Error('Time outside of interpolator bonudaries');
        if (unixTime > endTime) throw new Error('Time outside of interpolator bonudaries');
        const maxI = nIntervals - 1;
        const i = Math.min(maxI, Math.floor((unixTime - startTime)/interval));
        const j = i + 1;
        const raDec1 = { ra: raList[i], dec: decList[i] };
        const raDec2 = { ra: raList[j], dec: decList[j] };
        const t0 = startTime + i*interval;
        const val = (unixTime - t0)/interval;
        return interpolateRaDec(raDec1, raDec2, val);
    }
}
