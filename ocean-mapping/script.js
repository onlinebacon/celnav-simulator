const img = document.querySelector('img');
const canvas = document.createElement('canvas');
const { width, height } = img;
const ctx = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
ctx.drawImage(img, 0, 0, width, height);
const { data } = ctx.getImageData(0, 0, width, height);
const bitMap = { width: 256, height: 128, map: [] };
for (let i=0; i<bitMap.height; ++i) {
    bitMap.map[i] = new Array(bitMap.width).fill(1);
}
const isOcean = (x, y) => {
    const i = (y*width + x)*4;
    return data[i] == 255;
};
const turnOffBit = (row, col) => {
    bitMap.map[row][col] = 0;
};
for (let y=0; y<height; ++y) {
    const row = Math.floor((y + 0.5)/height*bitMap.height);
    for (let x=0; x<width; ++x) {
        const col = Math.floor((x + 0.5)/width*bitMap.width);
        if (!isOcean(x, y)) turnOffBit(row, col);
    }
}
const maxLat = 90 - 23.4;
const minLat = maxLat*-1;
const ranges = bitMap.map.map((bin, i) => {
    if (!bin.includes(1)) return [];
    const lat0 = (0.5 - (i + 0)/bitMap.height)*180;
    const lat1 = (0.5 - (i + 1)/bitMap.height)*180;
    if (lat0 > maxLat || lat1 < minLat) return [];
    const avrLat = (lat0 + lat1)/2;
    const lonCirc = Math.cos(avrLat/180*Math.PI)*360;
    const lonSize = lonCirc/bitMap.width;
    const latSize = lat0 - lat1;
    const area = latSize*lonSize;
    const ranges = [];
    let range = null;
    for (let i=0; i<bin.length; ++i) {
        const lon0 = ((i + 0)/bin.length - 0.5)*360;
        const lon1 = ((i + 1)/bin.length - 0.5)*360;
        const bit = bin[i];
        if (bit === 1 && range !== null) {
            range.lon1 = lon1;
            range.area += area;
        }
        if (bit === 1 && range === null) {
            range = { lat0, lat1, lon0, lon1, area };
            ranges.push(range);
        }
        if (bit === 0 && range !== null) {
            range = null;
        }
    }
    return ranges;
}).flat();
let src = 'export default [\n';
ranges.forEach((range) => {
    range.area = Number(range.area.toPrecision(4));
    let json = JSON.stringify(range);
    json = json.replace(/"/g, '');
    json = json.replace(/([{:,])/g, '$1 ');
    json = json.replace(/}/g, ' }');
    src += '\t' + json + ',\n';
});
src += '];\n';
const textarea = document.querySelector('textarea');
textarea.value = src;
