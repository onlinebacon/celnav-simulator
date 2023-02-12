import Constants from '../../../constants.js';
import { Mat4 } from '../../core/gl-math.js';
import * as Geometries from '../dynamic-geometries.js';
import * as Programs from '../programs.js';

const progMap = {
    C: Programs.variableColorGeometry,
    R: Programs.variableColorGeometryR,
    L: Programs.variableColorGeometryL,
};

const transform = new Mat4();

let geometry = null;

export const build = ({ dip }) => {
    geometry = Geometries.horizon({
        dip,
        radius: Constants.HORIZON_RAD,
    });
};

export const draw = (ctx, camera, side = 'C') => {
    const prog = progMap[side]
    transform.clear().rotateY(camera.transform.getYRotationOfK());
    ctx.useProgram(prog);
    prog.setVec3Uniform('color', Constants.WATER_COLOR);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};
