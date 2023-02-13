const chars = '0123456789-,.'.split('');
const nChars = chars.length;

const encodeChar = (char, i) => {
    let pos = chars.indexOf(char);
    let inc = nChars*((Math.cos(i*2) + 1)%1)|0;
    pos = (pos + inc)%nChars;
    return pos.toString(16);
};

const decodeChar = (char, i) => {
    let pos = parseInt(char, 16);
    let dec = nChars*((Math.cos(i*2) + 1)%1)|0;
    pos = (pos - dec + nChars)%nChars;
    return chars[pos];
};

export const encodeTimeLoc = (unixTime, [ lat, lon ]) => {
    const raw = unixTime + ',' + lat.toFixed(7) + ',' + lon.toFixed(7);
    const encoded = raw.split('').map(encodeChar).join('');
    return encoded;
};

export const decodeTimeLoc = (encoded) => {
    const raw = encoded.split('').map(decodeChar).join('');
    const [ timestamp, lat, lon ] = raw.split(',').map(Number);
    return [ timestamp, [ lat, lon ] ];
};
