const { sqrt, sin, cos, tan, asin, acos, PI } = Math;

export const toVertex = ([ lat, lon ]) => {
	const cosLat = cos(lat);
	const x = sin(lon)*cosLat;
	const y = sin(lat);
	const z = cos(lon)*cosLat;
	return [ x, y, z ];
};

export const toCoord = ([ x, y, z ]) => {
	const lat = asin(y);
	const radius = sqrt(z*z + x*x);
	const temp = acos(z/radius);
	const cos = x >= 0 ? temp : - temp;
	return [ lat, cos ];
};

export const normalize = ([ x, y, z ]) => {
    const scale = 1/sqrt(x*x + y*y + z*z);
	return [ x*scale, y*scale, z*scale ];
};

export const applyLatLonToVertex = ([ x, y, z ], [ lat, lon ]) => {
	const sin_lat = sin(lat);
	const cos_lat = cos(lat);
	const sin_lon = sin(lon);
	const cos_lon = cos(lon);
	[ y, z ] = [
		y*cos_lat + z*sin_lat,
		z*cos_lat - y*sin_lat,
	];
	[ x, z ] = [
		x*cos_lon + z*sin_lon,
		z*cos_lon - x*sin_lon,
	];
	return [ x, y, z ];
};

export const antipodal = ([ lat, lon ]) => [
	- lat,
	(lon + PI*2)%(PI*2) - PI,
];

export const interpolateCoords = (a, b, t) => {
	const [ x1, y1, z1 ] = toVertex(a);
	const [ x2, y2, z2 ] = toVertex(b);
	const dx = x2 - x1;
	const dy = y2 - y1;
	const dz = z2 - z1;
	const chord = sqrt(dx*dx + dy*dy + dz*dz);
	const hChord = chord/2;
	const hArc = asin(chord/2);
	const w = (hChord - sqrt(1 - hChord*hChord)*tan(hArc - t*hArc*2))/chord;
	const x = x1 + dx*w;
	const y = y1 + dy*w;
	const z = z1 + dz*w;
	return toCoord(normalize([ x, y, z ]));
};

export const inverseHaversine = (coord, azm, dist) => {
	const sin_dist = sin(dist);
	let vertex = [
		sin(azm)*sin_dist,
		cos(azm)*sin_dist,
		cos(dist),
	];
	vertex = applyLatLonToVertex(vertex, coord);
	return toCoord(normalize(vertex));
};
