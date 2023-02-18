import * as Animate from './support/animate.js';

const elements = [...document.querySelectorAll('.left-box')];

const marginTop = 15;
const marginLeft = 10;
const spacing = 5;
const maxOffset = 330;

let offset = maxOffset;

const getLeftValue = () => {
    return marginLeft - offset + 'px';
};

const getBoxHeight = (box) => {
    const { height } = window.getComputedStyle(box);
    return Number(height.replace(/px$/, ''));
};

const positionBoxesVertically = () => {
    let y = marginTop;
    elements.forEach((box) => {
        const height = getBoxHeight(box);
        box.style.top = y;
        box.style.left = marginLeft;
        y += height + spacing;
    });
};

let animation = null;

const changeOffsetTo = (value) => {
    animation?.stop();
    const a = offset;
    const b = value;
    animation = Animate.smooth({
        duration: 500,
        it: (t) => {
            offset = a + (b - a)*t;
            elements.forEach(e => {
                e.style.left = getLeftValue();
            });
        },
        callback: () => {
        },
    })
};

export const show = () => {
    changeOffsetTo(0);
};

export const hide = () => {
    changeOffsetTo(maxOffset);
};

const delay = (ms) => new Promise(done => setTimeout(done, ms));

const init = async () => {
    elements.forEach(e => {
        e.style.display = 'block';
        e.style.opacity = '0';
    });
    await delay(0);
    positionBoxesVertically();
    elements.forEach(e => {
        e.style.opacity = '1';
        e.style.left = getLeftValue();
    });
};

init();
