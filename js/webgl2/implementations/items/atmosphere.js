import { atmosphere as geometry } from '../static-geometries.js';
import {
    atmosphere as prog,
    atmosphereL as progL,
    atmosphereR as progR,
} from '../programs.js';
import { Mat4 } from '../../core/gl-math.js';

const progMap = {
    C: prog,
    L: progL,
    R: progR,
};

const transform = new Mat4();

export const draw = (ctx, camera, side) => {
    const prog = progMap[side];
    ctx.useProgram(prog);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};
