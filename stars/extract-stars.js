const fs = require('fs');
const path = require('path');
const buff = fs.readFileSync(path.join(__dirname, 'source.txt'));
const source = buff.toString()
	.replace(/\r\n|\n\r/g, '\n')
	.replace(/\s*#END#(.|\s)*/, '')
	.replace(/(^|\n)#[^\n]*/g, '')
	.replace(/[\-\s]+--\n/, '')
	.replace(/^(.|\s)*?(--+)(\s*--+)*\n/, '');

const parseAngle = (angle) => {
	const sign = angle[0] === '-' ? -1 : 1;
	const [ a, b, c ] = angle.split(/\s+/).map(val => Math.abs(val));
	return sign*(a + b/60 + c/3600);
};
const colLen = [6, 11, 11, 5, 6, 5];
const stars = source.split(/\n/).map(line => {
	const cols = [];
	let start = 0;
	for (let i=0; i<colLen.length; ++i) {
		const len = colLen[i];
		cols.push(line.substring(start, start + len).trim());
		start += len + 1;
	}
	const [ hip, ra, dec, vmag, bv, vi ] = cols;
	return {
		hip:  Number(hip),
		ra:   parseAngle(ra),
		dec:  parseAngle(dec),
		vmag: Number(vmag),
		bv:   Number(bv),
		vi:   Number(vi),
	};
});
stars.sort((a, b) => a.vmag - b.vmag);
const json = JSON.stringify(stars, null, '\t');
const file = `export default ${json};`;
fs.writeFileSync(path.join(__dirname, '../js/stars.js'), file);
