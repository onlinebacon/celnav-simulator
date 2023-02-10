import { parseAngle } from '../support/parse-angle.js';

export const submitCoord = async () => {
    const coords = prompt('Type in your coordinates separated by comma')?.trim();
    if (!coords) return null;
    return coords.split(/\s*,\s*/).map(parseAngle);
};

export const inform = async (text) => {
    alert(text);
};
