const compress = require('./compress.js');
const fs = require('fs');
const path = require('path');
let starList = require('./stars-skyfield-data.json');
const text = fs.readFileSync(path.join(__dirname, 'vizier-search.txt')).toString();
const lines = text.split(/\n\r|\r\n|\n/);
const getColumns = [
    [0, 6],
    [96, 6],
];
const bvMap = {};
lines.slice(1).forEach(line => {
    const row = [];
    for (const [a, b] of getColumns) {
        const col = line.substring(a, a + b).trim();
        row.push(col ? Number(col) : null);
    }
    const [ hip, bv ] = row;
    bvMap[hip] = bv;
});
starList = starList.filter(star => star.raList && star.decList);
starList = starList.filter(star => bvMap[star.hip] != null);
starList = starList.map(star => ({ ...star, bv: bvMap[star.hip] }));
starList.sort((a, b) => a.mag - b.mag);
const json = JSON.stringify(compress(starList));
const outputSrc = `export default ${json};`;
fs.writeFileSync(path.join(__dirname, '../js/db/stars.js'), outputSrc);
