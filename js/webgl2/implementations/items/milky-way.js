import * as Geometries from '../static-geometries.js';
import * as Programs from '../programs.js';
import { Mat4 } from '../../core/gl-math.js';

const progMap = {
    C: Programs.texturedGeometry,
    R: Programs.texturedGeometryR,
    L: Programs.texturedGeometryL,
};

const transform = new Mat4();
const geometry = Geometries.milkyWay;

export const draw = (ctx, camera, side = 'C') => {
    const prog = progMap[side]
    ctx.useProgram(prog);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};

export const setTransform = (mat4) => {
    transform.set(mat4);
};
