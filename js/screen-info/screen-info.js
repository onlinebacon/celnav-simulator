const div = document.querySelector('#info');
const toDeg = (rad) => rad*(180/Math.PI);

let sextantAngle = 0;

const stringifyAngle = () => {
    let total = Math.round(toDeg(sextantAngle)*60*10);
    const decmin = total%10;
    total = Math.round((total - decmin)/10);
    const min = total%60;
    total = Math.round((total - min)/60);
    const deg = total;
    return `${deg}° ${min + decmin/10}'`;
};

let lastText = null;
const updateInfo = () => {
    let text = '';
    text += 'Press S to toggle sextant mode<br>';
    text += 'Ctrl + click and drag to adjust the angle<br>';
    text += 'Sextant angle: ' + stringifyAngle();
    if (text === lastText) return;
    div.innerHTML = text;
    lastText = text;
};

export const setSextantAngle = (angle) => {
    sextantAngle = angle;
    updateInfo();
};
