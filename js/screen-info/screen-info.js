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

const updateInfo = () => {
    div.innerHTML = '';
    div.innerHTML += 'Press S to toggle sextant mode<br>';
    div.innerHTML += 'Ctrl + click and drag to adjust the angle<br>';
    div.innerHTML += 'Sextant angle: ' + stringifyAngle();
};

export const setSextantAngle = (angle) => {
    sextantAngle = angle;
    updateInfo();
};
