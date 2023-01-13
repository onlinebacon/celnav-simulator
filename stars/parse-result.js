const fs = require('fs');
let text = fs.readFileSync('./result.txt').toString();
let lines = text.split(/\r\n/);
let headerLine = lines.find(line => line.startsWith('HIP'));
let headerIndex = lines.indexOf(headerLine) + 2;
lines = lines.slice(headerIndex).reverse().slice(3).reverse();
const parseAngle = (str) => {
    const abs = str.split(/\s+/).map((val, i) => Math.abs(val)*Math.pow(60, -i)).reduce((a, b) => a + b);
    if (str[0] === '-') return -abs;
    return abs;
};
lines = lines.map(line => {
    let hip  = line.slice(0, 6).trim()*1;
    let ra   = parseAngle(line.slice(6, 18).trim());
    let dec  = parseAngle(line.slice(18, 30).trim());
    let vmag = line.slice(30, 36).trim()*1;
    let bv   = line.slice(36, 43).trim()*1;
    let vi   = line.slice(43).trim()*1;
    return { hip, ra, dec, vmag, bv, vi };
});
const json = JSON.stringify(lines, null, '  ');
fs.writeFileSync('stars.js', 'const stars = ' + json + ';');
