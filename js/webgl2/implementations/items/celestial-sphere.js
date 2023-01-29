import * as DynamicGeometries from '../dynamic-geometries.js';
import * as Programs from '../programs.js';
import { Mat4 } from '../../core/gl-math.js';

let big = null;
let small = null;
const progMap = {
    C: Programs.celestialSphere,
    L: Programs.celestialSphereL,
    R: Programs.celestialSphereR,
};
const transform = new Mat4();

const bigRad =   0.0025;
const smallRad = 0.0008;

export const build = (stars) => {
    big = DynamicGeometries.celestialSphere(stars, bigRad);
    small = DynamicGeometries.celestialSphere(stars, smallRad);
};

export const setOrientation = ({ lat, lon, ariesGHA }) => {
    transform.clear();
    transform.rotateZ(lon + ariesGHA);
    transform.rotateX(-lat);
};

const updateTransforms = (ctx, camera, side) => {
    const prog = progMap[side];
    ctx.useProgram(prog);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
};

export const drawBig = (ctx, camera, side = 'C') => {
    updateTransforms(ctx, camera, side);
    ctx.drawGeometry(big);
};

export const drawSmall = (ctx, camera, side = 'C') => {
    updateTransforms(ctx, camera, side);
    ctx.drawGeometry(small);
};
