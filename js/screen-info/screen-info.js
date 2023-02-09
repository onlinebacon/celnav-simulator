import * as AstronomyEngine from '../astronomy-engine/astronomy-engine.js';

const div = document.querySelector('#info');
const toDeg = (rad) => rad*(180/Math.PI);

let sextantAngle = 0;
let lat = 0;
let lon = 0;
let azm = 0;
let alt = 0;
let height = 0;

const stringifyAngle = (angle) => {
    let total = Math.round(toDeg(angle)*60*10);
    const decmin = total%10;
    total = Math.round((total - decmin)/10);
    const min = total%60;
    total = Math.round((total - min)/60);
    const deg = total;
    return `${deg}° ${min + decmin/10}'`;
};

const getTextTime = () => {
    const str = AstronomyEngine.now().toISOString();
    return str.replace(/[TZ]|\.\d+/g, ' ').trim() + ' UTC';
};

let lastText = null;
const updateInfo = () => {
    let text = '';
    text += 'Press S to toggle sextant mode<br>';
    text += 'Ctrl + click and drag to adjust the angle<br>';
    text += 'Sextant angle: ' + stringifyAngle(sextantAngle) + '<br>';
    text += 'Time: ' + getTextTime() + '<br>';
    text += 'Height: ' + height + ' meters<br>';
    // if (text === lastText) return;
    div.innerHTML = text;
    lastText = text;
};

export const setSextantAngle = (angle) => {
    sextantAngle = angle;
};

export const setPlayerInfo = (player) => {
    azm = player.azm;
    alt = player.alt;
    lat = player.lat;
    lon = player.lon;
    height = player.height;
    sextantAngle = player.sextantAngle;
    updateInfo();
};
