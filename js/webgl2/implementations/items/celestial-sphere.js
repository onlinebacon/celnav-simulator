import * as DynamicGeometries from '../dynamic-geometries.js';
import * as Programs from '../programs.js';
import { Mat4 } from '../../core/gl-math.js';

let geometry = null;
const program = Programs.celestialSphere;
const transform = new Mat4();

export const build = (stars) => {
    geometry = DynamicGeometries.celestialSphere(stars);
};

export const setOrientation = ({ lat, lon, ariesGHA }) => {
    transform.clear();
    transform.rotateZ(lon + ariesGHA);
    transform.rotateX(-lat);
};

export const draw = (ctx, camera) => {
    ctx.useProgram(program);
    program.setMat4Uniform('transform', transform);
    program.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};
