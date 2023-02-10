export const parseAngle = (str) => {
    str = str.toLowerCase();
    let sign = 1;
    if (str.startsWith('-')) {
        sign = -1;
        str = str.replace(/^-\s*/, '');
    } else if (str.startsWith('w')) {
        sign = -1;
        str = str.replace(/^w\s*/, '');
    } else if (str.startsWith('s')) {
        sign = -1;
        str = str.replace(/^s\s*/, '');
    } else if (str.startsWith('e')) {
        str = str.replace(/^e\s*/, '');
    } else if (str.startsWith('n')) {
        str = str.replace(/^n\s*/, '');
    } else if (str.endsWith('w')) {
        sign = -1;
        str = str.replace(/\s*w$/, '');
    } else if (str.endsWith('s')) {
        sign = -1;
        str = str.replace(/\s*s$/, '');
    } else if (str.endsWith('e')) {
        str = str.replace(/\s*e$/, '');
    } else if (str.endsWith('n')) {
        str = str.replace(/\s*n$/, '');
    }
    str = str.replace(/[°'"]/g, '\x20');
    const abs = str.split(/\s+/)
        .map((val, i) => val*Math.pow(60, -i))
        .reduce((a, b) => a + b, 0);
    return abs*sign/180*Math.PI;
};
