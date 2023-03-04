import loadImg from '../../support/load-img.js';

const textureSrcs = {
    milkyWay: './img/milky-way.png',
};

const images = {};

export const load = async () => {
    const entries = Object.entries(textureSrcs);
    const promises = entries.map(async (entry) => {
        const [ name, src ] = entry;
        const img = await loadImg(src);
        images[name] = img;
    });
    await Promise.all(promises);
};

export const get = (name) => images[name];
