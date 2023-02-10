import { skyBg as prog } from '../programs.js';
import { skyBg as geometry } from '../static-geometries.js';
import { Mat4 } from '../../core/gl-math.js';

const transform = new Mat4();

export const draw = (ctx, camera, side) => {
    ctx.useProgram(prog);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};
