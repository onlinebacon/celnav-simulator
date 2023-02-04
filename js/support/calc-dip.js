const R = 6371e3*7/6;

const calcDip = (heightMeters) => {
    const cos = R/(R + heightMeters);
    const dip = Math.acos(cos);
    return dip;
};

export default calcDip;
