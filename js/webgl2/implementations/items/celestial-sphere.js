import Constants from '../../../constants.js';
import * as DynamicGeometries from '../dynamic-geometries.js';
import * as Programs from '../programs.js';
import { Mat4 } from '../../core/gl-math.js';

const progMap = {
    C: Programs.celestialSphere,
    L: Programs.celestialSphereL,
    R: Programs.celestialSphereR,
};

let geometry = null;
const transform = new Mat4();

export const build = (stars) => {
    geometry = DynamicGeometries.celestialSphere(stars);
};

export const setOrientation = ({ lat, lon, ariesGHA }) => {
    transform.clear();
    // transform.rotateZ(lon + ariesGHA);
    // transform.rotateX(-lat);
};

const updateTransforms = (ctx, camera, side) => {
    const prog = progMap[side];
    ctx.useProgram(prog);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
    prog.setFloatUniform('celSphRad', Constants.CEL_SPHERE_RAD);
    prog.setFloatUniform('scaleStars', 1);
};

export const draw = (ctx, camera, side = 'C') => {
    updateTransforms(ctx, camera, side);
    ctx.drawGeometry(geometry);
};
