import { Texture } from '../core/webgl2.js';
import loadImg from '../../support/load-img.js';

const textureSrcs = {
    milkyWay: './img/milky-way.png',
};

const textures = {};

export const load = async () => {
    const entries = Object.entries(textureSrcs);
    const promises = entries.map(async (entry) => {
        const [ name, src ] = entry;
        const img = await loadImg(src);
        textures[name] = new Texture({ img });
    });
    await Promise.all(promises);
};

export const get = (name) => textures[name];
