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
const ocean = [ 0.1, 0.2, 0.3 ];
const darkSky = [ 0.05, 0.06, 0.10 ];
const color = [ 0, 0, 0 ];

let geometry = null;

const interpolate = (value) => {
    const inv = (1 - value);
    for (let i=0; i<3; ++i) {
        color[i] = darkSky[i]*inv + ocean[i]*value;
    }
};

export const build = ({ dip }) => {
    geometry = Geometries.horizon({
        dip,
        radius: Constants.HORIZON_RAD,
    });
    interpolate(0.17);
};

export const draw = (ctx, camera, side = 'C') => {
    const prog = progMap[side]
    transform.clear().rotateY(camera.transform.getYRotationOfK());
    ctx.useProgram(prog);
    prog.setVec3Uniform('color', color);
    prog.setMat4Uniform('transform', transform);
    prog.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};
