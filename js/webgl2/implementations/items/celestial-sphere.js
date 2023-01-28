import * as DynamicGeometries from '../dynamic-geometries.js';
import * as Programs from '../programs.js';
import { Mat4 } from '../../core/gl-math.js';

let geometry = null;
const progMap = {
    C: Programs.celestialSphere,
    L: Programs.celestialSphereL,
    R: Programs.celestialSphereR,
};
const transform = new Mat4();

export const build = (stars) => {
    geometry = DynamicGeometries.celestialSphere(stars);
};

export const setOrientation = ({ lat, lon, ariesGHA }) => {
    transform.clear();
    transform.rotateZ(lon + ariesGHA);
    transform.rotateX(-lat);
};

export const draw = (ctx, camera, side = 'C') => {
    const prog = progMap[side];
    ctx.useProgram(prog);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};
