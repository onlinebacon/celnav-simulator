const { PI } = Math;
const TAU = PI*2;

let TIME_OFFSET = 0;

const SID_DAY = 86164090.53820801;
const BASE_TIME = 1688189036000;

export const now = () => {
    return Date.now() + TIME_OFFSET;
};

export const getCurrentAriesGHA = () => {
    const timeOffset = now() - BASE_TIME;
    const angleOffset = timeOffset/SID_DAY*TAU;
    const trucnatedAngle = angleOffset%TAU;
    const positive = (trucnatedAngle + TAU)%TAU;
    return positive;
};
