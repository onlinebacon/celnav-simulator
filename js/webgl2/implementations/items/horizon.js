import { Mat4 } from '../../core/gl-math.js';
import * as Geometries from '../dynamic-geometries.js';
import * as Programs from '../programs.js';

const program = Programs.variableColorGeometry;
const transform = new Mat4();
const radius = 1;
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
    geometry = Geometries.horizon({ dip, radius });
    interpolate(0.05);
};

export const draw = (ctx, camera) => {
    transform.clear().rotateY(camera.transform.getYRotationOfK());
    ctx.useProgram(program);
    program.setVec3Uniform('color', color);
    program.setMat4Uniform('transform', transform);
    program.setMat4Uniform('projection', camera.projection);
    ctx.drawGeometry(geometry);
};
