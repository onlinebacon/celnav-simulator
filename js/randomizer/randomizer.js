import * as AstronomyEngine from '../astronomy-engine/astronomy-engine.js';
import { coordIsOverWater } from './ocean-checker.js';
import { antipodal, inverseHaversine } from '../support/coord-math.js';

const toRad = (deg) => deg*(Math.PI/180);

const randomAzm = () => {
	const deg = (Math.random() - 0.5)*90 + 270;
	return toRad(deg);
};

const twilightDist = toRad(90 - 8);

const minDate = new Date('2023-01-01 00:00:00 UTC');
const maxDate = new Date('2023-12-30 00:00:00 UTC');
const timeRange = maxDate - minDate;

export const randomizeSetup = async (player) => {
	for (;;) {
		const time = new Date(Math.random()*timeRange + minDate.getTime());
		AstronomyEngine.setTime(time);
		const sunRaDec = AstronomyEngine.getSunRaDec();
		const sunGP = AstronomyEngine.getGP(sunRaDec);
		const antipode = antipodal(sunGP);
		const gp = inverseHaversine(antipode, randomAzm(), twilightDist);
		if (coordIsOverWater(gp)) {
			const [ lat, lon ] = gp;
			player.lat = lat;
			player.lon = lon;
			break;
		}
	}
	console.log('lat: ' + (player.lat/Math.PI*180).toFixed(3));
	console.log('lon: ' + (player.lon/Math.PI*180).toFixed(3));
};
