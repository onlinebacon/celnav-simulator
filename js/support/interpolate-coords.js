const { sqrt, sin, cos, tan, asin, acos } = Math;

const toVertex = ([ lat, lon ]) => {
	const cosLat = cos(lat);
	const x = sin(lon)*cosLat;
	const y = sin(lat);
	const z = cos(lon)*cosLat;
	return [ x, y, z ];
};

const interpolateCoords = (a, b, t) => {
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
	const scale = 1/sqrt(x*x + y*y + z*z);
	const [ nx, ny, nz ] = [ x*scale, y*scale, z*scale ];
	const lat = asin(ny);
	const radius = sqrt(nz*nz + nx*nx);
	const temp = acos(nz/radius);
	const cos = nx >= 0 ? temp : - temp;
	return [ lat, cos ];
};

export default interpolateCoords;
